'use client'
import { useResumeContext } from '@/context/ResumeContext';
import { camelCaseToTitleCase } from '@/utils';

const TechnicalSkills = () => {
  const { skillsNeeded } = useResumeContext();
  const { desiredRole, report } = skillsNeeded ?? {};
  if (!desiredRole || !report?.technicalSkills) return null;

  return (
    <section id="techskills" className="w-full max-w-5xl mx-auto px-4 md:px-6 my-8">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-left">{desiredRole} Need These Technical Skills</h2>
        <ul className="flex flex-wrap gap-2 w-full max-w-6xl">
          {report.technicalSkills.map((skill, index) => (
            <li key={index} className="p-4 min-w-[250px] max-w-[300px]">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{camelCaseToTitleCase(skill.id)}</h2>
                <p className="text-sm md:text-base mt-2 leading-tight">{skill.details}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TechnicalSkills;