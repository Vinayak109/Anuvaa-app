import React, { useState } from 'react';
import { Home, BookOpen, CheckSquare, Star, User, Smile, Play, CheckCircle2, ChevronRight, XCircle, Building2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBar, BottomNav } from './SharedUI';
import { STUDENT_QUIZZES } from './mockData';

export default function StudentPortal({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('HOME');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [internalView, setInternalView] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [loginStep, setLoginStep] = useState<'SETUP' | 'SELECT' | 'PROMPT'>('SETUP');
  const [selectedSchool, setSelectedSchool] = useState('JEP-4928');
  const [selectedClass, setSelectedClass] = useState('Class 2');
  const [dynamicStudents, setDynamicStudents] = useState<any[]>([]);
  const [loginPrompt, setLoginPrompt] = useState<any>(null);
  const [nameInput, setNameInput] = useState('');
  const [password, setPassword] = useState('');

  const [hasData, setHasData] = useState(true); // For demoing empty states

  const tabs = [
    { id: 'HOME', label: 'होम', icon: <Home size={22} strokeWidth={2} /> },
    { id: 'LESSON', label: 'पाठ', icon: <BookOpen size={22} strokeWidth={2} /> },
    { id: 'QUIZ', label: 'क्विज़', icon: <CheckSquare size={22} strokeWidth={2} /> },
    { id: 'MARKS', label: 'अंक', icon: <Star size={22} strokeWidth={2} /> },
  ];

  const handleTabChange = (id: string) => {
    const currentIndex = tabs.findIndex(t => t.id === (internalView || activeTab));
    const nextIndex = tabs.findIndex(t => t.id === id);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveTab(id);
    setInternalView(null);
  };

  const handleInternalNav = (view: string) => {
    setDirection(1);
    setInternalView(view);
  };

  const handleLogin = (name: string) => {
    setStudentName(name);
    setIsLoggedIn(true);
  };

  const generateStudents = () => {
    const names = [
      "अमित (Amit)", "प्रिया (Priya)", "रोहन (Rohan)", "अंजलि (Anjali)",
      "विशाल (Vishal)", "नेहा (Neha)", "सुमित (Sumit)", "किरण (Kiran)",
      "आदित्य (Aditya)", "पूजा (Pooja)", "समीर (Sameer)", "काव्या (Kavya)",
      "राहुल (Rahul)", "मीना (Meena)", "सुनीता (Sunita)", "रमेश (Ramesh)",
      "सोनू (Sonu)", "रीता (Rita)", "गौरव (Gaurav)", "निशा (Nisha)"
    ];
    // Shuffle array
    const shuffled = [...names].sort(() => 0.5 - Math.random()).slice(0, 10);
    const brandColors = [
      'bg-brand-primary/10 text-brand-primary',
      'bg-brand-accent/10 text-brand-accent',
      'bg-brand-warning/10 text-brand-warning',
      'bg-blue-100 text-blue-700',
      'bg-rose-100 text-rose-700',
      'bg-purple-100 text-purple-700'
    ];
    const icons = ['User', 'Smile', 'Star'];

    const generated = shuffled.map((name, idx) => ({
      id: `gen-${idx}`,
      name,
      color: brandColors[idx % brandColors.length],
      icon: icons[idx % icons.length]
    }));

    setDynamicStudents(generated);
    setLoginStep('SELECT');
  };

  if (!isLoggedIn) {
    if (loginStep === 'PROMPT' && loginPrompt) {
      return (
        <div className="flex flex-col h-full bg-brand-bg relative overflow-hidden">
          <TopBar title="लॉग इन (Login)" showBack onBack={() => setLoginStep('SELECT')} />
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex-1 p-6 flex flex-col items-center"
          >
             <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 mt-8 ${loginPrompt.color} shadow-sm border border-brand-border`}>
               {loginPrompt.icon === 'User' ? <User size={40} strokeWidth={2} /> : loginPrompt.icon === 'Smile' ? <Smile size={40} strokeWidth={2} /> : <Star size={40} strokeWidth={2} />}
             </div>
             
             <div className="w-full space-y-6 mt-4">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-brand-muted">नाम (Name)</label>
                 <input 
                   type="text" 
                   value={nameInput} 
                   onChange={e => setNameInput(e.target.value)} 
                   className="w-full p-4 rounded-2xl border border-brand-border font-bold text-brand-text outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-white transition-all shadow-sm" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold text-brand-muted">पासकोड (Passcode)</label>
                 <input 
                   type="password" 
                   value={password} 
                   onChange={e => setPassword(e.target.value)} 
                   placeholder="••••" 
                   className="w-full p-4 rounded-2xl border border-brand-border font-bold text-brand-text outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-white tracking-widest text-2xl text-center transition-all shadow-sm" 
                 />
               </div>
             </div>

             <div className="mt-auto w-full pt-8 pb-10">
               <button 
                 disabled={!nameInput.trim() || !password.trim()} 
                 onClick={() => handleLogin(nameInput.trim())}
                 className="w-full bg-brand-primary text-white p-4 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98] transition-transform flex justify-center items-center gap-2 shadow-lg shadow-brand-primary/20"
               >
                 प्रवेश करें (Enter)
               </button>
             </div>
          </motion.div>
        </div>
      );
    }

    if (loginStep === 'SELECT') {
      return (
        <div className="flex flex-col h-full bg-brand-bg relative overflow-hidden">
          <TopBar title="अपना नाम चुनें" showBack onBack={() => setLoginStep('SETUP')} />
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex-1 p-6 flex flex-col overflow-y-auto pb-12"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-brand-text">{selectedClass}</h2>
              <p className="text-brand-muted font-bold mt-1">10 छात्र मिले (10 students found)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              {dynamicStudents.map((s, idx) => (
                <motion.button 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3, ease: "easeOut" }}
                  key={s.id}
                  onClick={() => {
                    setLoginPrompt(s);
                    setNameInput(s.name.split(' ')[0]);
                    setPassword('');
                    setLoginStep('PROMPT');
                  }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-brand-border flex flex-col items-center gap-4 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${s.color}`}>
                    {s.icon === 'User' ? <User size={32} strokeWidth={2} /> : s.icon === 'Smile' ? <Smile size={32} strokeWidth={2} /> : <Star size={32} strokeWidth={2} />}
                  </div>
                  <div className="font-extrabold text-xl text-brand-text">{s.name.split(' ')[0]}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-brand-bg relative overflow-hidden">
        <TopBar title="कक्षा चुनें (Select Class)" showBack onBack={onLogout} />
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex-1 p-6 flex flex-col"
        >
          <div className="text-center mb-6 mt-2">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-brand-border">
              <Building2 size={24} strokeWidth={2} className="text-brand-primary" />
            </div>
            <h2 className="text-xl font-extrabold text-brand-text">स्कूल विवरण</h2>
            <p className="text-brand-muted font-bold text-sm">(School Details)</p>
          </div>
          
          <div className="flex gap-3 bg-white p-4 rounded-3xl shadow-sm border border-brand-border">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-brand-muted pl-1">स्कूल (School)</label>
              <div className="relative">
                <select 
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full p-3 pr-10 rounded-2xl border border-brand-border font-bold text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 bg-brand-bg transition-all shadow-sm appearance-none"
                >
                  <option value="JEP-4928">JEP-4928</option>
                  <option value="JEP-1032">JEP-1032</option>
                  <option value="JEP-8841">JEP-8841</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-primary">
                  <ChevronDown size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-bold text-brand-muted pl-1">कक्षा (Class)</label>
              <div className="relative">
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-3 pr-10 rounded-2xl border border-brand-border font-bold text-sm text-brand-text outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 bg-brand-bg transition-all shadow-sm appearance-none"
                >
                  <option value="कक्षा 1 (Class 1)">कक्षा 1</option>
                  <option value="कक्षा 2 (Class 2)">कक्षा 2</option>
                  <option value="कक्षा 3 (Class 3)">कक्षा 3</option>
                  <option value="कक्षा 4 (Class 4)">कक्षा 4</option>
                  <option value="कक्षा 5 (Class 5)">कक्षा 5</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-primary">
                  <ChevronDown size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto w-full pt-8 pb-6">
            <button 
              onClick={generateStudents}
              className="w-full bg-brand-primary text-white p-4 rounded-2xl font-bold text-lg active:scale-[0.98] transition-transform flex justify-center items-center gap-2 shadow-lg shadow-brand-primary/20"
            >
              छात्र खोजें (Find Students)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentView = internalView || activeTab;

  return (
    <div className="flex flex-col h-full bg-sand">
      <TopBar 
        title={
          currentView === 'HOME' ? `नमस्ते, ${studentName}!` : 
          currentView === 'LESSON' ? 'आज का पाठ' : 
          currentView === 'QUIZ' ? 'क्विज़ खेलें' : 
          currentView === 'MARKS' ? 'मेरे अंक' : ''
        } 
        showBack={true}
        onBack={() => {
          setDirection(-1);
          currentView === 'HOME' ? setIsLoggedIn(false) : handleTabChange('HOME');
        }}
      />

      <div className="flex-1 overflow-x-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentView}
            custom={direction}
            initial={(d) => ({ opacity: 0, x: d === 1 ? 20 : -20 })}
            animate={{ opacity: 1, x: 0 }}
            exit={(d) => ({ opacity: 0, x: d === 1 ? -20 : 20 })}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full overflow-y-auto"
          >
            {currentView === 'HOME' && (
              <div className="p-6 space-y-5">
                 <div className="mb-4 bg-white border border-brand-border p-3.5 rounded-xl shadow-sm text-center">
                    <p className="text-[11px] font-bold text-brand-muted leading-tight">PALASH कार्यक्रम, झारखंड शिक्षा परियोजना परिषद (JEPC) के साथ संरेखित</p>
                 </div>
                 
                 {!hasData ? (
                   <div className="flex flex-col items-center justify-center py-10 text-center">
                     <div className="w-28 h-28 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 border border-brand-primary/20">
                       <Smile size={48} strokeWidth={1.5} className="text-brand-primary/60" />
                     </div>
                     <h3 className="text-2xl font-extrabold text-brand-text mb-2">अभी तक कोई पाठ या क्विज़ नहीं</h3>
                     <p className="text-brand-muted font-bold">(No lessons or quizzes yet)</p>
                     <button onClick={() => setHasData(true)} className="mt-12 text-[10px] font-bold text-brand-muted/50 underline">Load Data (Demo)</button>
                   </div>
                 ) : (
                   <>
                    <div className="grid grid-cols-2 gap-5">
                      <StudentCard 
                        icon={<BookOpen size={36} strokeWidth={2} className="text-brand-primary" />}
                        title="आज का पाठ"
                        subtitle="(Today's Lesson)"
                        color="bg-brand-primary/10"
                        onClick={() => handleInternalNav('LESSON')}
                      />
                      <StudentCard 
                        icon={<CheckSquare size={36} strokeWidth={2} className="text-brand-accent" />}
                        title="क्विज़"
                        subtitle="(Quiz)"
                        color="bg-brand-accent/10"
                        onClick={() => handleInternalNav('QUIZ')}
                      />
                      <StudentCard 
                        icon={<Star size={36} strokeWidth={2} className="text-brand-warning" />}
                        title="मेरे अंक"
                        subtitle="(My Marks)"
                        color="bg-brand-warning/10"
                        onClick={() => handleInternalNav('MARKS')}
                      />
                      <StudentCard 
                        icon={<User size={36} strokeWidth={2} className="text-[#3B82F6]" />}
                        title="प्रोफ़ाइल"
                        subtitle="(Profile)"
                        color="bg-blue-100"
                        onClick={onLogout}
                      />
                    </div>
                    
                    <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-brand-border flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
                      <div>
                        <h3 className="font-extrabold text-xl text-brand-text mb-1">कहानी सुनें</h3>
                        <p className="text-brand-muted font-bold">(Listen to a story)</p>
                      </div>
                      <button className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20">
                        <Play size={24} strokeWidth={2} className="fill-current ml-1" />
                      </button>
                    </div>
                    <div className="text-center pt-8">
                       <button onClick={() => setHasData(false)} className="text-[10px] font-bold text-brand-muted/50 underline">Clear Data (Demo)</button>
                    </div>
                   </>
                 )}
              </div>
            )}

            {currentView === 'LESSON' && (
              <div className="p-6 space-y-6">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-brand-border relative">
                  <button className="absolute top-5 right-5 w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center active:bg-brand-primary/20 transition-colors">
                    <Play size={24} strokeWidth={2} className="fill-current ml-1" />
                  </button>
                  
                  <div className="pr-14">
                    <h3 className="text-3xl font-extrabold text-brand-text mb-2 leading-tight">सेताक् रेयाक् बेड़ा</h3>
                    <p className="text-brand-muted font-bold mb-8">(सुबह का समय / Morning Time)</p>
                    
                    <div className="space-y-4">
                      <div className="p-5 bg-brand-bg rounded-2xl border border-brand-border">
                        <p className="text-xl font-bold text-brand-primary mb-2">सिञ चांदोय राकाप् एना।</p>
                        <p className="text-sm font-bold text-brand-muted">सूरज निकल आया है। (The sun has risen.)</p>
                      </div>
                      <div className="p-5 bg-brand-bg rounded-2xl border border-brand-border">
                        <p className="text-xl font-bold text-brand-primary mb-2">चेड़े कोवाक् राक् अड़ाम आंजोमोग काना।</p>
                        <p className="text-sm font-bold text-brand-muted">पक्षियों की चहचहाहट सुनाई दे रही है। (Birds are chirping.)</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-primary/20"></div>
                  <div className="w-3 h-3 rounded-full bg-brand-primary/20"></div>
                </div>
                
                <button className="w-full bg-brand-primary text-white rounded-2xl p-5 text-xl font-bold shadow-lg shadow-brand-primary/20 flex justify-center items-center gap-2 active:scale-[0.98] transition-transform">
                  अगला (Next) <ChevronRight size={24} strokeWidth={2.5} />
                </button>
              </div>
            )}

            {currentView === 'QUIZ' && (
              <QuizTakingView onComplete={() => handleTabChange('HOME')} />
            )}

            {currentView === 'MARKS' && (
              <div className="p-6 space-y-6">
                <div className="bg-brand-warning/10 rounded-3xl p-8 text-center mb-8 border border-brand-warning/20">
                  <div className="flex justify-center gap-3 mb-5">
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: 'spring' }}><Star size={36} strokeWidth={2} className="fill-brand-warning text-brand-warning" /></motion.div>
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }}><Star size={44} strokeWidth={2} className="fill-brand-warning text-brand-warning" /></motion.div>
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: 'spring' }}><Star size={36} strokeWidth={2} className="fill-brand-warning text-brand-warning" /></motion.div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-brand-warning">बहुत बढ़िया!</h3>
                  <p className="font-bold text-brand-muted mt-2">(Excellent work!)</p>
                </div>
                
                <h4 className="font-bold text-brand-muted px-2">मेरे पिछले क्विज़ (Past Quizzes)</h4>
                
                <div className="space-y-4">
                  {STUDENT_QUIZZES.map((quiz, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      key={quiz.id} className="bg-white rounded-2xl p-5 shadow-sm border border-brand-border flex items-center justify-between"
                    >
                      <div className="font-extrabold text-brand-text text-xl">{quiz.title}</div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map(star => (
                          <Star 
                            key={star} 
                            size={22} strokeWidth={2}
                            className={star <= quiz.stars ? "fill-brand-warning text-brand-warning" : "text-brand-border"} 
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav tabs={tabs} activeTab={activeTab} onChange={handleTabChange} theme="student" />
    </div>
  );
}

function StudentCard({ icon, title, subtitle, color, onClick }: { icon: React.ReactNode, title: string, subtitle: string, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-6 rounded-3xl shadow-sm border border-brand-border flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all min-h-[170px]"
    >
      <div className={`p-4 rounded-full border border-brand-border ${color}`}>
        {icon}
      </div>
      <div>
        <div className="font-extrabold text-xl text-brand-text leading-tight">{title}</div>
        <div className="text-xs font-bold text-brand-muted mt-1.5">{subtitle}</div>
      </div>
    </button>
  );
}

function QuizTakingView({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (idx: number) => {
    setSelected(idx);
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onComplete();
      }, 2000);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full p-6 relative">
      <div className="flex gap-2.5 mb-8">
        <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.5 }} className="h-3 flex-1 bg-brand-primary rounded-full origin-left"></motion.div>
        <div className="h-3 flex-1 bg-brand-primary/20 rounded-full"></div>
        <div className="h-3 flex-1 bg-brand-primary/20 rounded-full"></div>
      </div>
      
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-brand-border mb-8">
        <h2 className="text-3xl font-extrabold text-center mb-4 leading-tight text-brand-text">सेब का रंग क्या है?</h2>
        <p className="text-brand-muted text-center font-bold text-lg">(What is the color of an apple?)</p>
      </div>

      <div className="flex flex-col gap-5 mt-auto pb-6">
        <button 
          onClick={() => handleSubmit(0)}
          className={`w-full rounded-3xl p-6 text-2xl font-bold border-4 transition-all text-center flex items-center justify-center gap-3 active:scale-[0.98] ${selected === 0 ? 'bg-brand-success/10 border-brand-success text-brand-success' : 'bg-white border-brand-border text-brand-text active:bg-brand-bg hover:border-brand-primary/30'}`}
        >
          लाल (Red) {selected === 0 && <CheckCircle2 size={28} strokeWidth={2.5} className="text-brand-success" />}
        </button>
        <button 
          onClick={() => handleSubmit(1)}
          className={`w-full rounded-3xl p-6 text-2xl font-bold border-4 transition-all text-center flex items-center justify-center gap-3 active:scale-[0.98] ${selected === 1 ? 'bg-brand-warning/10 border-brand-warning text-brand-warning' : 'bg-white border-brand-border text-brand-text active:bg-brand-bg hover:border-brand-primary/30'}`}
        >
          हरा (Green) {selected === 1 && <XCircle size={28} strokeWidth={2.5} className="text-brand-warning" />}
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-brand-bg/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 20 }}
              className="w-24 h-24 rounded-full bg-[#E57A3A]/20 flex items-center justify-center mb-6"
            >
              <motion.svg viewBox="0 0 50 50" className="w-12 h-12 text-[#E57A3A]" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} d="M14 27l8 8 16-16" />
              </motion.svg>
            </motion.div>
            <h3 className="text-3xl font-extrabold text-brand-text text-center mb-2">आड़ी नापाय!</h3>
            <p className="text-[#E57A3A] font-bold text-lg">(Aadi napay! / बहुत अच्छा!)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
