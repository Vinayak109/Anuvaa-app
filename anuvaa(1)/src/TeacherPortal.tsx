import React, { useState, useEffect } from 'react';
import { Mic, FileText, Users, Home, Bluetooth, Play, PlusCircle, CheckCircle2, Waves, Minus, Share, Flag, Filter, Volume2, Smartphone, ArrowDownUp, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBar, BottomNav } from './SharedUI';
import { CLASS_MARKS } from './mockData';

export default function TeacherPortal({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('HOME');
  const [internalView, setInternalView] = useState<string | null>(null);

  const tabs = [
    { id: 'HOME', label: 'होम', icon: <Home size={22} /> },
    { id: 'TRANSLATE', label: 'अनुवाद', icon: <Mic size={22} /> },
    { id: 'QUIZ', label: 'क्विज़', icon: <FileText size={22} /> },
    { id: 'CLASS', label: 'कक्षा', icon: <Users size={22} /> },
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setInternalView(null);
  };

  const currentView = internalView || activeTab;

  return (
    <div className="flex flex-col h-full bg-sand">
      <TopBar 
        title={
          currentView === 'HOME' ? 'शिक्षक डैशबोर्ड' : 
          currentView === 'TRANSLATE' ? 'लाइव अनुवाद' : 
          currentView === 'QUIZ' ? 'नया क्विज़' : 
          currentView === 'CLASS' ? 'कक्षा के अंक' : ''
        } 
        showBack={true}
        onBack={() => currentView === 'HOME' ? onLogout() : handleTabChange('HOME')}
      />

      <div className="flex-1 overflow-y-auto">
        {currentView === 'HOME' && (
          <div className="p-4 space-y-6">
            <div className="mb-6 bg-white border border-brand-border p-4 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-brand-text">नमस्ते, शिक्षिका!</h2>
              <p className="text-brand-muted font-medium mb-2">(Hello, Teacher)</p>
              <div className="flex items-center gap-2 text-xs font-bold bg-brand-bg px-3 py-1.5 rounded-lg text-brand-text inline-flex border border-brand-border">
                School ID / विद्यालय आईडी: <span className="text-brand-primary">JEP-4928</span>
              </div>
              <div className="mt-4 border-t border-brand-border pt-3">
                <p className="text-[10px] font-bold text-brand-muted leading-tight">PALASH कार्यक्रम, झारखंड शिक्षा परियोजना परिषद (JEPC) के साथ संरेखित</p>
              </div>
            </div>

            <div className="bg-[#FFF8E7] border border-brand-warning/30 rounded-2xl p-4 flex items-center justify-between mb-6">
              <div className="font-bold text-brand-warning">3 क्विज़ जांचने बाकी हैं</div>
              <button className="bg-brand-warning text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-sm" onClick={() => handleTabChange('CLASS')}>
                देखें (View)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DashboardCard 
                icon={<Mic size={28} className="text-brand-primary" />}
                title="लाइव अनुवाद"
                subtitle="Live Translate"
                onClick={() => handleTabChange('TRANSLATE')}
              />
              <DashboardCard 
                icon={<PlusCircle size={28} className="text-brand-accent" />}
                title="नया क्विज़"
                subtitle="Create Quiz"
                onClick={() => handleTabChange('QUIZ')}
              />
              <DashboardCard 
                icon={<FileText size={28} className="text-[#3B82F6]" />}
                title="असाइनमेंट"
                subtitle="Assignments"
                onClick={() => {}}
              />
              <DashboardCard 
                icon={<Users size={28} className="text-[#8B5CF6]" />}
                title="कक्षा के अंक"
                subtitle="Class Marks"
                onClick={() => handleTabChange('CLASS')}
              />
            </div>
            
            <button 
              onClick={onLogout}
              className="mt-8 w-full py-4 text-brand-muted font-bold underline"
            >
              लॉग आउट (Log Out)
            </button>
          </div>
        )}

        {currentView === 'TRANSLATE' && (
          <LiveTranslateView />
        )}

        {currentView === 'QUIZ' && (
          <CreateQuizView />
        )}

        {currentView === 'CLASS' && (
          <ClassMarksView />
        )}
      </div>

      <BottomNav tabs={tabs} activeTab={activeTab} onChange={handleTabChange} theme="teacher" />
    </div>
  );
}

function DashboardCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-5 rounded-3xl shadow-sm border border-brand-border flex flex-col items-center text-center gap-3 active:scale-95 transition-transform"
    >
      <div className="bg-brand-bg p-4 rounded-full border border-brand-border">
        {icon}
      </div>
      <div>
        <div className="font-bold text-brand-text">{title}</div>
        <div className="text-xs font-bold text-brand-muted">{subtitle}</div>
      </div>
    </button>
  );
}

function LiveTranslateView() {
  const [state, setState] = useState<'idle' | 'listening' | 'translating' | 'done'>('idle');
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    let interval: any;
    if (state === 'translating') {
      interval = setInterval(() => {
        setLatency(prev => prev + 0.2);
      }, 200);
      setTimeout(() => {
        setState('done');
      }, 2400); // simulate 2.4s latency
    }
    return () => clearInterval(interval);
  }, [state]);

  const handleMicPress = () => {
    if (state === 'idle') {
      setState('listening');
      setTimeout(() => setState('translating'), 2000);
    } else {
      setState('idle');
      setLatency(0);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-full">
      <button className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-5 py-2.5 rounded-full font-bold mb-10 shadow-sm border border-brand-primary/20">
        <Bluetooth size={16} />
        कक्षा के स्पीकर से जुड़ें
      </button>

      <div className="relative mb-8 flex justify-center items-center h-32">
        {state === 'listening' && (
          <motion.div 
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute w-28 h-28 rounded-full bg-brand-accent/40"
          />
        )}
        <button 
          onClick={handleMicPress}
          className={`w-28 h-28 rounded-full flex items-center justify-center shadow-xl shadow-brand-accent/30 active:scale-95 transition-all z-10 ${state === 'idle' || state === 'done' ? 'bg-brand-accent text-white' : 'bg-brand-accent-dark text-white shadow-inner'}`}
        >
          <Mic size={40} strokeWidth={2.5} />
        </button>
      </div>

      <div className="h-8 mb-6 flex justify-center items-center">
        {state === 'listening' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div 
                key={i} 
                animate={{ height: ['8px', '24px', '8px'] }} 
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                className="w-1.5 bg-brand-accent rounded-full"
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center font-bold text-brand-muted text-lg">
             {state === 'translating' ? 'अनुवाद हो रहा है... (Translating)' : 'बोलने के लिए दबाएं (Tap to Speak)'}
          </div>
        )}
      </div>

      <div className="w-full space-y-4">
        <AnimatePresence>
          {(state === 'translating' || state === 'done') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white rounded-3xl p-5 shadow-sm border border-brand-border relative"
            >
              <div className="text-xs font-extrabold text-brand-muted mb-2 uppercase tracking-wider">Hindi (Recognized)</div>
              <div className="text-2xl font-bold text-brand-text">आज हम गिनती सीखेंगे।</div>
            </motion.div>
          )}

          {state === 'done' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-brand-primary text-white rounded-3xl p-5 shadow-md relative"
            >
              <div className="text-xs font-extrabold text-white/70 mb-2 uppercase tracking-wider">Santhali (Translated)</div>
              <div className="text-3xl font-extrabold leading-tight">तेहिन आबो लेखाबोन चेदा।</div>
              <div className="absolute top-5 right-5 flex items-center gap-1.5 text-brand-primary bg-white px-3 py-1.5 rounded-full font-bold text-xs shadow-sm">
                <Play size={12} className="fill-current" />
                🔊 Playing ({latency.toFixed(1)}s)
              </div>
            </motion.div>
          )}

          {state === 'translating' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center text-sm font-bold text-brand-muted"
            >
              Latency: {latency.toFixed(1)}s...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CreateQuizView() {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([{ type: 'mcq', marks: 5 }]);

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="sticky top-0 bg-brand-bg z-10 px-6 py-4 flex justify-between items-center border-b border-brand-border">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= s ? 'bg-brand-primary border-brand-primary text-white' : 'bg-transparent border-brand-border text-brand-muted'}`}>
              {s}
            </div>
            {s !== 3 && <div className={`flex-1 h-1 mx-2 rounded-full ${step > s ? 'bg-brand-primary' : 'bg-brand-border'}`} />}
          </div>
        ))}
      </div>

      <div className="p-4 space-y-6">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-muted">क्विज़ का नाम (Title)</label>
              <input type="text" placeholder="e.g. रंगों के नाम" className="w-full text-lg font-bold outline-none border border-brand-border rounded-2xl p-4 text-brand-text focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-muted">कक्षा (Grade)</label>
              <select className="w-full bg-white border border-brand-border rounded-2xl p-4 font-bold text-brand-text outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary">
                <option>कक्षा 1 (Class 1)</option>
                <option>कक्षा 2 (Class 2)</option>
                <option>कक्षा 3 (Class 3)</option>
                <option>कक्षा 4 (Class 4)</option>
                <option>कक्षा 5 (Class 5)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-brand-muted">बुनियादी साक्षरता स्तर (Foundational Level)</label>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full border border-brand-primary bg-brand-primary/10 text-brand-primary font-bold text-sm">पहचान स्तर / Recognition</button>
                <button className="px-4 py-2 rounded-full border border-brand-border bg-white text-brand-muted font-bold text-sm">समझ स्तर / Comprehension</button>
                <button className="px-4 py-2 rounded-full border border-brand-border bg-white text-brand-muted font-bold text-sm">प्रवाह स्तर / Fluency</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-muted">प्रकार (Type)</label>
              <div className="flex gap-2">
                <button className="flex-1 p-3 rounded-2xl border border-brand-primary bg-brand-primary/10 text-brand-primary font-bold text-center">क्विज़ (Quiz)</button>
                <button className="flex-1 p-3 rounded-2xl border border-brand-border bg-white text-brand-muted font-bold text-center">असाइनमेंट (Assignment)</button>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full bg-brand-primary text-white rounded-2xl p-4 text-lg font-bold shadow-lg shadow-brand-primary/20 active:scale-95 transition-transform mt-4 flex justify-center items-center gap-2">
              अगला (Next) <Check size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-brand-border shadow-sm">
              <span className="font-bold text-brand-text">कुल प्रश्न: {questions.length}</span>
              <span className="font-bold text-brand-primary">अंक: {questions.reduce((sum, q) => sum + q.marks, 0)}</span>
            </div>

            {questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border border-brand-border space-y-4 relative">
                <div className="absolute -top-3 -left-3 bg-brand-primary text-white w-8 h-8 flex items-center justify-center rounded-full font-bold border-4 border-brand-bg">{idx + 1}</div>
                
                <div className="flex justify-between items-center">
                  <select className="bg-brand-bg rounded-lg p-2 font-bold text-xs text-brand-muted outline-none border border-brand-border">
                    <option>बहुविकल्पी (MCQ)</option>
                    <option>सही-गलत (True/False)</option>
                    <option>लघु उत्तर (Short Answer)</option>
                  </select>
                  
                  <div className="flex items-center gap-3 bg-brand-bg p-1.5 rounded-full border border-brand-border">
                    <button className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-brand-muted shadow-sm" onClick={() => {
                       const newQs = [...questions];
                       if(newQs[idx].marks > 1) newQs[idx].marks -= 1;
                       setQuestions(newQs);
                    }}><Minus size={14}/></button>
                    <span className="font-bold text-sm text-brand-text w-4 text-center">{q.marks}</span>
                    <button className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-brand-muted shadow-sm" onClick={() => {
                       const newQs = [...questions];
                       newQs[idx].marks += 1;
                       setQuestions(newQs);
                    }}><PlusCircle size={14}/></button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex bg-brand-bg rounded-xl border border-brand-border overflow-hidden p-1">
                    <textarea placeholder="प्रश्न (Hindi)" className="w-full bg-transparent p-2 text-sm font-bold outline-none text-brand-text border-b border-brand-border/50 resize-none h-14" />
                  </div>
                  <div className="flex bg-brand-primary/5 rounded-xl border border-brand-primary/20 overflow-hidden p-1 relative">
                    <textarea placeholder="प्रश्न (Santhali)" className="w-full bg-transparent p-2 text-sm font-bold outline-none text-brand-primary resize-none h-14" />
                    <button className="absolute bottom-2 right-2 p-1.5 bg-white text-brand-primary rounded-full shadow-sm border border-brand-primary/10 active:scale-95 transition-transform"><Volume2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => setQuestions([...questions, { type: 'mcq', marks: 5 }])} className="w-full border-2 border-dashed border-brand-border text-brand-muted rounded-3xl p-4 font-bold flex justify-center items-center gap-2 hover:bg-white active:bg-brand-bg">
              <PlusCircle size={20} /> नया प्रश्न (Add Question)
            </button>

            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-white border border-brand-border text-brand-text rounded-2xl p-4 text-lg font-bold shadow-sm active:scale-95 transition-transform text-center">
                पीछे (Back)
              </button>
              <button onClick={() => setStep(3)} className="flex-1 bg-brand-primary text-white rounded-2xl p-4 text-lg font-bold shadow-lg shadow-brand-primary/20 active:scale-95 transition-transform flex justify-center items-center gap-2">
                अगला (Next) <Check size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h3 className="font-bold text-brand-text text-lg px-2">छात्र पूर्वावलोकन (Student Preview)</h3>
            
            <div className="bg-white rounded-[2.5rem] p-4 shadow-xl border-[6px] border-slate-800 mx-4 relative overflow-hidden aspect-[9/16] flex flex-col">
              <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 rounded-b-xl w-32 mx-auto"></div>
              
              <div className="flex gap-1 mb-4 mt-4">
                <div className="h-1.5 flex-1 bg-brand-primary rounded-full"></div>
                <div className="h-1.5 flex-1 bg-brand-primary/20 rounded-full"></div>
              </div>
              
              <div className="bg-brand-bg rounded-2xl p-4 shadow-sm border border-brand-border mb-4">
                <h4 className="text-xl font-extrabold text-brand-text leading-tight mb-2">प्रश्न यहाँ आएगा?</h4>
                <p className="text-brand-primary font-bold text-sm">(Santhali text preview)</p>
              </div>
              
              <div className="space-y-2 mt-auto">
                <div className="bg-white rounded-xl p-3 border-2 border-brand-border font-bold text-brand-text text-center text-sm">विकल्प ए (Option A)</div>
                <div className="bg-white rounded-xl p-3 border-2 border-brand-border font-bold text-brand-text text-center text-sm">विकल्प बी (Option B)</div>
              </div>
            </div>

            {questions.length < 3 && (
              <div className="bg-brand-warning/10 border border-brand-warning text-brand-warning p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                <Flag size={16} /> कम से कम 3 प्रश्न जोड़ें (Add at least 3 questions)
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <button disabled={questions.length < 3} onClick={() => {}} className="w-full bg-brand-primary text-white disabled:opacity-50 disabled:active:scale-100 rounded-2xl p-4 text-lg font-bold shadow-lg shadow-brand-primary/20 active:scale-95 transition-transform flex justify-center items-center gap-2">
                कक्षा को भेजें (Assign to Class)
              </button>
              <button onClick={() => {}} className="w-full bg-transparent border-2 border-brand-primary text-brand-primary rounded-2xl p-4 text-lg font-bold active:scale-95 transition-transform text-center">
                मसौदा सहेजें (Save as Draft)
              </button>
            </div>
            
            <button onClick={() => setStep(2)} className="w-full text-brand-muted font-bold underline py-2 text-center">
              पीछे जाएं (Go Back)
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ClassMarksView() {
  const [students, setStudents] = useState(CLASS_MARKS);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const toggleFlag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStudents(students.map(s => s.id === id ? { ...s, flagged: !s.flagged } : s));
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a.flagged && !b.flagged) return -1;
    if (!a.flagged && b.flagged) return 1;
    return 0;
  });

  return (
    <div className="p-4 space-y-6 pb-24 relative">
      <button className="w-full bg-white border border-brand-border text-brand-muted rounded-xl p-3 font-bold text-sm flex justify-center items-center gap-2 shadow-sm active:bg-brand-bg transition-colors">
        <Share size={16} /> PALASH समन्वयक के साथ साझा करें
      </button>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 border border-brand-border shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-brand-text">72%</span>
          <span className="text-[10px] font-bold text-brand-muted mt-1 leading-tight">औसत स्कोर<br/>(Average)</span>
        </div>
        <div className="bg-brand-success/10 rounded-2xl p-3 border border-brand-success/20 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-brand-success">18</span>
          <span className="text-[10px] font-bold text-brand-success mt-1 leading-tight">पूर्ण<br/>(Completed)</span>
        </div>
        <div className="bg-brand-warning/10 rounded-2xl p-3 border border-brand-warning/20 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-brand-warning">4</span>
          <span className="text-[10px] font-bold text-brand-warning mt-1 leading-tight">लंबित<br/>(Pending)</span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-white border border-brand-border rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm">
          <Filter size={16} className="text-brand-muted" />
          <select className="bg-transparent font-bold text-brand-text text-sm outline-none w-full">
            <option>गिनती (Numbers)</option>
            <option>रंगों के नाम (Colors)</option>
          </select>
        </div>
        <button className="bg-white border border-brand-border rounded-xl p-2 shadow-sm text-brand-muted flex items-center justify-center">
          <ArrowDownUp size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {sortedStudents.map((student, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              key={student.id} 
              onClick={() => setSelectedStudent(student)}
              className={`bg-white rounded-2xl p-4 shadow-sm border active:scale-[0.98] transition-transform ${student.flagged ? 'border-brand-accent shadow-brand-accent/10' : 'border-brand-border'}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="font-bold text-brand-text">{student.name}</div>
                <button onClick={(e) => toggleFlag(student.id, e)} className={`p-1.5 rounded-full border transition-colors ${student.flagged ? 'bg-brand-accent border-brand-accent text-white' : 'bg-transparent border-brand-border text-brand-muted'}`}>
                  <Flag size={14} className={student.flagged ? 'fill-current' : ''} />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-brand-bg rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: student.numericScore > 0 ? `${(student.numericScore / 10) * 100}%` : '0%' }} transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${student.numericScore >= 8 ? 'bg-brand-success' : student.numericScore >= 5 ? 'bg-brand-warning' : student.numericScore > 0 ? 'bg-brand-accent' : 'bg-transparent'}`} 
                  />
                </div>
                <div className="text-xs font-bold text-brand-text w-10 text-right">{student.score}</div>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div className={`text-xs font-bold px-2 py-1 rounded-md ${student.status === 'Submitted' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-warning/10 text-brand-warning'}`}>
                  {student.status === 'Submitted' ? 'पूर्ण (Done)' : 'लंबित (Pending)'}
                </div>
                {student.flagged && <div className="text-[10px] font-bold text-brand-accent">सहायता चाहिए (Needs Support)</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex flex-col justify-end"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-brand-bg rounded-t-[2rem] w-full max-w-md mx-auto h-[70vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 bg-white border-b border-brand-border flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-extrabold text-brand-text">{selectedStudent.name}</h3>
                  <p className="text-sm font-bold text-brand-muted">क्विज़ इतिहास (Quiz History)</p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="w-10 h-10 rounded-full bg-brand-bg text-brand-muted flex items-center justify-center"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="relative border-l-2 border-brand-border ml-3 space-y-6 pb-6 mt-2">
                  {selectedStudent.history?.map((hist: any, i: number) => (
                    <div key={i} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-brand-bg bg-brand-primary"></div>
                      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-sm flex justify-between items-center">
                        <div>
                          <div className="text-xs font-bold text-brand-muted mb-1">{hist.date}</div>
                          <div className="font-bold text-brand-text">{hist.title}</div>
                        </div>
                        <div className={`font-extrabold text-lg ${hist.score === '-' ? 'text-brand-warning' : 'text-brand-primary'}`}>{hist.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

