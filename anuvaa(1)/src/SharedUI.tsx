import React from 'react';
import { WifiOff, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function OfflineBadge() {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1.5 bg-brand-bg text-brand-muted px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-brand-border">
        <WifiOff size={16} strokeWidth={2} />
        <span>ऑफ़लाइन (Offline)</span>
      </div>
    </div>
  );
}

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export function TopBar({ title, showBack, onBack, rightElement }: TopBarProps) {
  return (
    <div className="flex flex-col bg-brand-primary sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={onBack} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all text-white"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          )}
          {title && <h1 className="text-xl font-bold text-white">{title}</h1>}
        </div>
        <div>
          {rightElement || <OfflineBadge />}
        </div>
      </div>
      <div className="px-5 pb-4 text-center">
         <p className="text-[11px] text-white/90 font-medium">बच्चों का डेटा केवल आपके डिवाइस पर रहता है (Data stays on device)</p>
      </div>
    </div>
  );
}

interface BottomNavProps {
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  theme?: 'teacher' | 'student';
}

export function BottomNav({ tabs, activeTab, onChange, theme = 'teacher' }: BottomNavProps) {
  const activeColor = theme === 'teacher' ? 'text-brand-primary' : 'text-brand-primary';

  return (
    <div className="bg-white border-t border-brand-border px-2 pb-safe pt-2 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors z-10 ${
                isActive ? activeColor : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-pill" 
                  className="absolute inset-0 w-16 mx-auto bg-brand-primary/10 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`transition-transform duration-200 z-10 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] font-bold tracking-wide z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
