'use client'
import { useResumeContext } from '@/context/ResumeContext';
import { camelCaseToTitleCase } from '@/utils';

const SoftSkills = () => {
  const { skillsNeeded } = useResumeContext();
  const { desiredRole, report } = skillsNeeded ?? {};
  if (!desiredRole || !report?.softSkills) return null;

  return (
    <section id="softSkills" className="w-full max-w-5xl mx-auto px-4 md:px-6 my-8">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold mb-4">How About the Soft Skills</h2>
        <ol className="list-decimal pl-12 space-y-2 w-full max-w-6xl">
          {report.softSkills.map((skill, index) => (
            <li key={index} className="text-base md:text-lg font-semibold text-left marker:text-gray-700">
              <h3 className="text-base md:text-lg font-semibold">{camelCaseToTitleCase(skill)}</h3>
            </li>
          ))}
        </ol>
      </div>
      
    </section>
  );
}

export default SoftSkills;