import { useState } from 'react';
import LaunchScreen from './LaunchScreen';
import TeacherPortal from './TeacherPortal';
import StudentPortal from './StudentPortal';

export type AppState = 'NONE' | 'TEACHER' | 'STUDENT';

export default function App() {
  const [role, setRole] = useState<AppState>('NONE');

  return (
    <div className="w-full min-h-screen bg-brand-border flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-brand-bg h-[100dvh] flex flex-col relative shadow-2xl overflow-hidden sm:border-x sm:border-brand-border">
        {role === 'NONE' && <LaunchScreen onSelectRole={setRole} />}
        {role === 'TEACHER' && <TeacherPortal onLogout={() => setRole('NONE')} />}
        {role === 'STUDENT' && <StudentPortal onLogout={() => setRole('NONE')} />}
      </div>
    </div>
  );
}

