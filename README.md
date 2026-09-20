# ANUVAA

Offline-first Hindi → Santali classroom language assistant.

A teacher speaks Hindi. The class reads and hears Santali in Ol Chiki. Everything
runs on one laptop with no internet: offline ASR in the browser, a locally
verified phrase pack, locally recorded audio.

**Nothing in the runtime calls a hosted API.** No OpenAI, no Gemini, no Claude,
no Google Translate. The only network traffic is between the classroom laptop
and student devices on the same LAN.

---

## The one thing to read first

**ANUVAA never invents a Santali translation.**

The shipped phrase pack contains 54 Hindi classroom phrases and **zero** Santali
translations, because none have been verified by a speaker yet. Ask it to
translate and it will tell you the phrase is in the curriculum and that the
Santali is awaiting verification. It will not guess.

That is the design, not an unfinished corner. Santali is a low-resource language
with roughly 7.6 million speakers and very little digitised parallel text.
Plausible-looking Ol Chiki generated from nothing would be indistinguishable from
correct Ol Chiki to every judge in the room and wrong to every child in the
classroom. A language-preservation tool that fabricates the language is worse
than no tool.

To make the pack live, fill in `scripts/seed_hi_sat.csv` and rebuild:

```bash
python scripts/prepare_translation_pack.py
```

The builder refuses any row where the Santali cell is not Ol Chiki codepoints
(U+1C50–U+1C7F), or lacks a `source` and a `verified_by`. Sources to draw from:
Jharkhand/Odisha state Santali primers, the Ol Chiki curriculum published by the
All India Santali Writers' Association, AI4Bharat's Samanantar corpus, or a
native-speaker teacher sitting with the CSV for an hour.

---

## Run it

```bash
python -m venv .venv && .venv/bin/pip install -r requirements.txt
cd frontend && npm install && npm run build && cd ..
./run.sh
```

Then open **http://localhost:8000** — student portal at `/`, teacher portal at
`/teacher`. On the classroom Wi-Fi, other devices use the laptop's LAN IP.

Development, with hot reload and Vite proxying the API:

```bash
.venv/bin/python -m uvicorn backend.main:app --reload    # terminal 1
cd frontend && npm run dev                                # terminal 2
```

### Offline speech recognition (one command)

```bash
./scripts/fetch_vosk_model.sh
```

Downloads `vosk-model-small-hi-0.22` (~42 MB, Apache 2.0), verifies the unpack
looks like a real Kaldi model, and repacks it as
`frontend/public/models/vosk-hindi/model.tar.gz` — the format `vosk-browser`
loads. Pass `--large` for the 1.5 GB model, which is noticeably better in a
noisy room.

This is the only file the repo cannot ship, because of its size and its separate
licence. Until it is installed the microphone button reads "Mic unavailable" and
the portal accepts typed Hindi, which runs the identical translation path.

---

## How speech recognition works

Kaldi acoustic and language models compiled to WebAssembly, running in a Web
Worker. **The browser's `SpeechRecognition` API is never used** and no audio
leaves the device — both are hard requirements, not preferences.

```
getUserMedia ──▶ AudioContext ──▶ AudioWorklet ──▶ Float32 chunks (2048 frames)
                                       │
                                       ├─▶ RMS ──▶ level meter + voice activity
                                       └─▶ recognizer.acceptWaveformFloat()
                                                 │
                                       partialresult ──▶ live provisional text
                                       result ───────▶ final text + latency
```

**AudioWorklet, not ScriptProcessorNode.** Capture runs on the audio thread, so
a slow React render cannot drop samples. The worklet is inlined as a Blob URL
rather than shipped as a separate file in `public/`, so it cannot drift out of
sync with the code that uses it. ScriptProcessorNode is kept as a fallback for
older school hardware, routed through a silent gain node because it only fires
while connected to the graph destination.

**Sample rate is read, not assumed.** We ask for 16 kHz, but Safari and some
Android browsers ignore the hint. The recognizer is constructed around
`audioContext.sampleRate`, whatever that turns out to be — a mismatch between
the graph rate and the recognizer rate produces confident garbage rather than an
error, which is the worst kind of bug to find on stage.

**The microphone is never routed to the speakers.** Obvious in hindsight, deeply
embarrassing in a classroom.

### Microphone states

`checking → downloading → unpacking → ready → requesting-mic → listening`, plus
`stopping`, `unsupported` and `error`. Every state has its own button label and
status line, and each error names the fix rather than just the failure. Stopping
calls `retrieveFinalResult()` so a half-finished sentence is flushed instead of
silently discarded.

### Loading UI

`createModel` fetches the archive itself and reports no progress, which means a
blank screen for however long 42 MB takes off a school laptop's disk. So the
archive is streamed once through our own reader to produce a real byte-count
progress bar; that fills the HTTP cache, and `createModel` then re-requests it
and is served the cached copy. The unpack phase after that is genuinely
indeterminate and says so.

### Two latencies, measured separately

| Metric | Measured from | Measured to |
|---|---|---|
| `speech→text` | last audio frame above the voice-activity threshold | final transcript |
| `speech→screen` | same point | Santali on screen |

Starting the clock at the last frame of *speech* rather than when Vosk emits a
result is what makes the number honest: it excludes the silence Vosk waits
through before deciding an utterance ended, and it includes Vosk's own decoding
time, which a timer started in our own callback would quietly hide.

The backend mounts `/models` explicitly so a missing model returns a real 404.
Without that mount the SPA catch-all would hand the loader an HTML page with
HTTP 200, and it would fail much later and much less clearly. The probe also
rejects any response under 1 MB for the same reason.

---

## Tests

```bash
.venv/bin/python -m pytest tests -q     # 56 passed
cd frontend && npx vitest run           # 48 passed
```

The suites deliberately overlap. `test_translation.py` and `translator.test.ts`
assert the same normalisation and matching behaviour on both sides, because the
Python matcher and the TypeScript matcher must agree — otherwise the classroom
gets one answer over Wi-Fi and a different one when the link drops.

---

## How a phrase travels

```
teacher speaks Hindi
  → Vosk Hindi ASR                  in-browser wasm, no audio leaves the device
  → normalise                       NFC, strip danda/ZWJ, drop ASR filler tokens
  → match against the pack          exact on the normalised key, else fuzzy
  → verified Santali + Ol Chiki     or an honest "awaiting verification"
  → play local WAV                  recorded by a speaker, never synthesised
```

Measured on this machine: **0.05–0.6 ms** server-side per lookup, against a 3 s
budget. The budget is spent almost entirely inside Vosk; the translation itself
is free. The teacher portal reports true speech-to-screen latency, timestamped at
the moment Vosk finalises an utterance rather than when our code starts.

### Matching

Exact match on the normalised key handles most classroom speech, because the pack
is built from phrases teachers actually say. Misses fall through to a fuzzy score:

```
0.65 × Jaccard(tokens) + 0.35 × character_similarity     threshold 0.62
```

Token overlap carries the heavier weight because ASR output drifts by a word far
more often than by a character. Below threshold ANUVAA returns "not in the pack"
with near-misses to choose from, rather than serving the closest thing it found.

### Plugging in IndicTrans2 320M

Everything above the provider layer talks to `TranslationProvider` and never to a
concrete engine. `backend/providers/indictrans2.py` already implements the
interface and reports `ready: false` with no model on disk, so the chain falls
through to the phrase pack — asserted in `test_engine_prefers_verified_pack_over_neural`.

To activate it:

1. Put the CTranslate2-converted model on disk, point `ANUVAA_INDICTRANS2_DIR` at it
2. `pip install ctranslate2 sentencepiece IndicTransToolkit` (all local, no network at inference)
3. Fill in `_load` and `_translate_batch`

No route, component or type changes. Note that it runs **behind** the phrase pack
permanently, not instead of it: a human-verified translation always wins, and
model output is labelled as machine-generated so it is never mistaken for
verified curriculum material.

---

## Offline behaviour

| Resource | Strategy |
|---|---|
| Phrase pack | IndexedDB, synced once at startup; all lookups local thereafter |
| Lessons, quizzes, roster | IndexedDB write-through cache on every successful GET |
| App shell, fonts | Service worker, cache-first |
| API calls | Service worker, network-first with cache fallback |
| Quiz attempts taken offline | Queued in IndexedDB, replayed and tagged `synced_from: offline` |

Pull the network cable mid-lesson and translation, lessons and quizzes all keep
working. The badge says "Working offline" rather than showing an error, because
offline is the normal operating state.

---

## Layout

```
backend/
  main.py           FastAPI app, LAN CORS, health, serves the built SPA + /audio
  database.py       plain sqlite3, WAL, schema + curriculum seeding
  models.py         pydantic schemas
  routes/           translation · curriculum · quizzes · students
  providers/        base · normalize · phrase_pack · indictrans2   ← the seam
  data/             phrases.json (generated) · curriculum.json
frontend/src/
  lib/              vosk · translator · audio · offlineStore · api · types
  components/       VoiceTranslator · TranslationCard · LatencyBadge ·
                    OfflineBadge · LessonCard · QuizCard · Shell
  pages/            TeacherDashboard · Lessons · Assessment ·
                    StudentLogin · StudentDashboard · Quiz
scripts/
  prepare_translation_pack.py   CSV → validated pack, with Ol Chiki gating
  seed_hi_sat.csv               the editable source of truth
tests/                          backend suite + synthetic Ol Chiki fixture
```

`providers/` is an addition to the original structure: it is what keeps the
IndicTrans2 seam out of the route handlers.

---

## Design notes

Colour carries meaning rather than decorating. Blue is the Hindi the teacher
speaks, purple the Santali the class hears, green verified, amber awaiting
verification — consistently, in every card, badge and progress bar.

The signature element is the microphone, which doubles as the latency
instrument: concentric rings track live input amplitude so the teacher can see
the room is being heard before any text appears, and the arc around the button
drains as the 3-second budget is spent — amber past two thirds, red past the
budget. One control, both signals, no spinner competing for attention in front
of a class.

Fonts are self-hosted (Noto Sans Ol Chiki, Devanagari, and a subsetted Latin;
211 KB total, OFL). A font CDN would break the offline requirement, and without
a bundled Ol Chiki font Santali renders as empty boxes on a stock laptop.

---

## Known limitations

- **No verified Santali translations ship with the pack.** Covered above. This is
  the honest state of the data, and the single highest-value thing to fix before
  a demo.
- **No audio ships either.** Recording a speaker is the only correct source. There
  is deliberately no TTS fallback — pronunciation is exactly what the class is
  learning, and a synthetic voice reading Ol Chiki would be a second place to
  invent the language.
- **Student login has no authentication.** Tapping a roll number on a shared
  classroom laptop is the whole flow. Correct for an offline single-room device;
  do not ship this shape anywhere student records leave the room.
- **Vosk small-model accuracy** on Hindi in a noisy classroom is moderate. The
  fuzzy matcher absorbs a word of drift; beyond that the teacher retries or types.
  The `--large` model helps and costs load time.
- **The audio pipeline is tested against injected fakes, not a real microphone.**
  28 tests drive the whole path — permission refusal, streaming chunks into the
  recognizer, partial revisions, final results, latency, teardown — with a fake
  `getUserMedia`, `AudioContext` and Vosk model. That catches logic and lifecycle
  bugs but cannot catch acoustic problems. Real-microphone behaviour is the one
  thing you have to confirm on your own laptop.
- **The quiz answer key reaches the client** when an attempt is graded. Fine for a
  practice tool, wrong for anything summative.
