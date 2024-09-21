'use client'
import { useResumeContext } from '@/context/ResumeContext';
import { camelCaseToTitleCase } from '@/utils';

const Industry = () => {
  const { skillsNeeded } = useResumeContext();
  const { desiredRole, report } = skillsNeeded ?? {};
  if (!desiredRole || !report?.industryKnowledge) return null;

  return (
    <section id="industryKnowledge" className="w-full max-w-5xl mx-auto px-4 md:px-6 my-8">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-left">Learn the Industry</h2>
        <ol className="list-decimal pl-12 space-y-2 w-full max-w-6xl">
          {report.industryKnowledge.map((knowledge, index) => (
            <li key={index} className="text-base md:text-lg font-semibold text-left marker:text-gray-700">
              <h3 className="text-base md:text-lg font-semibold">{camelCaseToTitleCase(knowledge)}</h3>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Industry;