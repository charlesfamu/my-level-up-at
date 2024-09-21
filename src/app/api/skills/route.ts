import { SkillsNeeded } from '@/context/ResumeContext';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getUserPrompt = (isJobDescription: boolean, currentSkills: string, desiredProfession: string) => {
  const basePrompt = process.env.BASE_PROMPT || '';

  if (isJobDescription) {
    return `${process.env.JOB_DESCRIPTION_PROMPT}${desiredProfession}. ${basePrompt}`;
  } else {
    return `${process.env.CURRENT_SKILLS_PROMPT}${currentSkills}. ${process.env.DESIRED_PROFESSION_PROMPT}${desiredProfession}. ${basePrompt}`;
  }
};

export async function POST(request: NextRequest) {
  const { currentSkills, desiredProfession, isJobDescription } = await request.json();

  const systemPrompt = process.env.SYSTEM_PROMPT;
  const systemPromptJSON = process.env.SYSTEM_PROMPT_JSON;
  const userPrompt = getUserPrompt(isJobDescription, currentSkills, desiredProfession);
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { 
        role: 'system', 
        content: `${systemPrompt}. ${systemPromptJSON}`, 
      },
      { 
        role: 'user', 
        content: userPrompt, 
      },
    ],
    max_tokens: 2000,
    response_format: {
      'type': 'json_object'
    },
    temperature: 0.5,
    top_p: 1,
  });

  try {
    const completionContent = response.choices?.[0]?.message?.content ?? '';
    const parsedResponse = JSON.parse(completionContent) ?? {};
    
    const defaultSkills: SkillsNeeded = {
      currentJob: parsedResponse.currentJob || '',
      desiredRole: parsedResponse.desiredRole || '',
      report: {
        introduction: parsedResponse.report?.introduction ?? '',
        technicalSkills: parsedResponse.report?.technicalSkills ?? [],
        softSkills: parsedResponse.report?.softSkills ?? [],
        certificationsOrCourses: parsedResponse.report?.certificationsOrCourses ?? [],
        industryKnowledge: parsedResponse.report?.industryKnowledge ?? [],
        networkingAndCommunity: parsedResponse.report?.networkingAndCommunity ?? [],
        transferableSkills: parsedResponse.report?.transferableSkills ?? [],
      },
    };

    return NextResponse.json({ skillsNeeded: defaultSkills }, { status: 200 });
  } catch (error) {
    console.error('Error parsing response:', error);
    return NextResponse.json({ error: 'Failed to parse the response.' }, { status: 500 });
  }
}
