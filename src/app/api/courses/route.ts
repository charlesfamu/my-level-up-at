import { NextRequest, NextResponse } from 'next/server';
const UDEMY_COURSES_ENDPOINT = process.env.UDEMY_COURSES_ENDPOINT;
const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));

async function fetchUdemyCoursesFromTitle(title: string) {
  const params = new URLSearchParams({
    search: title,
    is_affiliate_agreed: 'True',
    ordering: 'relevance',
  });

  const url = `${UDEMY_COURSES_ENDPOINT}/?${params.toString()}`;
  try {
    const response = await Promise.race([
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': process.env.UDEMY_BEARER_TOKEN ?? '',
          'Content-Type': 'application/json',
        }
      }),
      timeout(5000)
    ]);

    if (response instanceof Response && response.ok) {
      const {results} = await response.json();
      // return first element in data array
      return results?.[0] ?? [];
    } else if (response instanceof Response) {
      // Handle non-OK HTTP responses
      throw new Error(`Failed to fetch course: ${title} - ${response.statusText}`);
    } else {
      throw response;
    }

  } catch (error) {
    console.log('Error fetching course data:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  // trim top 3 skill areas, don't pass all the skills in the certificationsOrCourses key
  // pass in array of skill areas
  // Promise.all on skill areas and call getCourses on each skill area

  const { searchParams } = new URL(request.url);
  const titles = searchParams.get('titles');
  if (titles) {
    const coursesArray = titles.split(',');
    
    try {
      const results = await Promise.all(coursesArray.map(fetchUdemyCoursesFromTitle));
      return NextResponse.json({ courses: results }, { status: 200 });
    } catch (error) {
      console.log('Error fetching course data:', error);
      return NextResponse.json({ error: 'Fetching course data failed'}, { status: 500 });
    } 
  
  } else {
    return NextResponse.json({ courses: [] }, { status: 200 });
  }
}