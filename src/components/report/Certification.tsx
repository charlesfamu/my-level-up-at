'use client'
import ProcessingState from '@/components/ProcessingState';
import { useResumeContext } from '@/context/ResumeContext';
import { camelCaseToTitleCase } from '@/utils';
import Image from 'next/image';

const Certification = () => {
  const { courses, loading, skillsNeeded } = useResumeContext();
  const { desiredRole, report } = skillsNeeded ?? {};
 
  if (!desiredRole || !report?.certificationsOrCourses) return null;
  return (
    <section id="certification" className="w-full max-w-5xl mx-auto px-4 md:px-6 my-8">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold mb-4 text-left">{desiredRole} Certifications</h2>
        <ul className="flex flex-wrap gap-2 w-full max-w-6xl">
          {report.certificationsOrCourses.map((cert, index) => (
            <li key={index} className="p-4 min-w-[250px] max-w-[300px]">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{camelCaseToTitleCase(cert.id)}</h2>
                <p className="text-sm md:text-base mt-2 leading-tight">{cert.details}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* Courses List */}
        {loading && <ProcessingState prompt="loading courses..." />}
        {!loading && courses && (
          <>
            <h2 id="recommendedCourses" className="text-3xl font-bold mb-4">Recommended Courses from Udemy</h2>
            <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl">
              {courses.map((course) => (
                <a
                  key={course.id}
                  href={`https://www.udemy.com${course.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col p-4 min-w-[250px] max-w-[300px] overflow-hidden bg-gray-800 bg-opacity-80 rounded-lg border border-gray-700 transition-transform transform hover:scale-105 hover:border-blue-500 hover:shadow-lg cursor-pointer"
                  >
                  <div className="relative w-full h-0 pb-[56.25%]"> {/* Aspect ratio for video */}
                    <Image
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                      src={course.image_240x135}
                      alt={course.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-2 text-left">
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <p className="text-xs">{course.headline}</p>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Certification;