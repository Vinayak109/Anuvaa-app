import { BookOpen, UserCircle2 } from 'lucide-react';
import { OfflineBadge } from './SharedUI';
import { motion } from 'motion/react';

interface LaunchScreenProps {
  onSelectRole: (role: 'TEACHER' | 'STUDENT') => void;
}

export default function LaunchScreen({ onSelectRole }: LaunchScreenProps) {
  return (
    <div className="flex-1 flex flex-col p-6 items-center justify-center relative bg-brand-bg overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute top-6 right-6"
      >
        <OfflineBadge />
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm space-y-12">
        
        {/* App Branding */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-full mx-auto flex items-center justify-center mb-4">
            <BookOpen size={40} strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold text-brand-text tracking-tight">अनुवा</h1>
          <p className="text-lg font-bold text-brand-muted">Anuvaa</p>
          
          <p className="text-[15px] font-bold text-brand-primary/90 mt-2">जो भाषा दिल की है, वही सीखने की भी</p>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 inline-block bg-white border border-brand-border px-3 py-2 rounded-lg shadow-sm"
          >
             <p className="text-[10px] font-bold text-brand-muted leading-tight">PALASH कार्यक्रम, झारखंड शिक्षा परियोजना परिषद (JEPC) के साथ संरेखित</p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="w-full space-y-4"
        >
          <div>
            <button 
              onClick={() => onSelectRole('TEACHER')}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl p-5 flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20 active:scale-[0.98] active:bg-brand-primary transition-all group"
            >
              <UserCircle2 size={24} strokeWidth={2} className="group-active:scale-95 transition-transform" />
              <span className="text-2xl font-bold">मैं शिक्षक हूं</span>
            </button>
            <p className="text-center text-sm font-semibold text-brand-muted mt-2">(I am a Teacher)</p>
          </div>
          
          <div className="h-2"></div>

          <div>
            <button 
              onClick={() => onSelectRole('STUDENT')}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl p-5 flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20 active:scale-[0.98] active:bg-brand-primary transition-all group"
            >
              <UserCircle2 size={24} strokeWidth={2} className="group-active:scale-95 transition-transform" />
              <span className="text-2xl font-bold">मैं छात्र हूं</span>
            </button>
            <p className="text-center text-sm font-semibold text-brand-muted mt-2">(I am a Student)</p>
          </div>
        </motion.div>

      </div>
      
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-6 w-full text-center"
      >
        <p className="text-[13px] font-bold text-brand-muted/70">झारखंड के शिक्षकों और छात्रों के लिए</p>
      </motion.div>
    </div>
  );
}
