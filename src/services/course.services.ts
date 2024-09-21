import { Course } from "@/context/ResumeContext";

export async function fetchCourses(titles: string) {
  try {
    const url = `/api/courses?titles=${titles}`;
    const response = await fetch(url);
    if (response instanceof Response && response.ok) {
      const { courses }: {courses: Course[] } = await response.json();
      // only return unique courses
      if (courses) {
        const seen = new Map();

        const uniqueCourses = courses.filter(course => {
          if (!seen.has(course.id)) {
            seen.set(course.id, true);
            return true;
          }
          return false;
        });

        return uniqueCourses;
      } 
      return courses;
    } else if (response instanceof Response) {
      // Handle non-OK HTTP responses
      throw new Error(response.statusText);
    } else {
      throw response;
    }
  } catch (error) {
    // console.log(`Error fetching courses from titles, ${error}`);
    return null;
  }
  
}