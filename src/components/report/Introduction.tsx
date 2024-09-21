'use client'
import { useResumeContext } from '@/context/ResumeContext';

const Introduction = () => {
  const { skillsNeeded } = useResumeContext();
  const { desiredRole, report } = skillsNeeded ?? {};
  if (!desiredRole || !report?.introduction) return null;

  return (
    <section id="introduction" className="w-full max-w-5xl mx-auto px-4 md:px-6 transition-all duration-300">
      <div className="flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4">Your {desiredRole} Transition Plan</h1>
        <p className="text-muted-foreground md:text-xl mx-auto lg:mx-0">{report.introduction}</p>
      </div>
    </section>
  );
};

export default Introduction;