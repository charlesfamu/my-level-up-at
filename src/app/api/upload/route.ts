import mammoth from 'mammoth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import PdfParse from 'pdf-parse';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractTextFromFile(file: File, mimeType: string): Promise<string> {
  if (mimeType.includes('text/plain')) {
    // Handle plain text files
    return await file.text();
  } else if (mimeType.includes('pdf')) {
    // Handle PDF files
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { text } = await PdfParse(buffer);
    return text;
  } else if (mimeType.includes('word')) {
    // Handle Word documents
    const arrayBuffer = await file.arrayBuffer();
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    return text;
  } else {
    throw new Error('Unsupported file type');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file) {
      const text = await extractTextFromFile(file, file.type);
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert resume writer with a strong ability to extract and summarize key information from professional documents.
            You will be given text from a resume. Your task is to analyze and extract the most relevant keywords,
            skills, experiences, and qualifications from the resume. Create a concise and detailed summary, avoiding any personal information
            or professional titles.` 
          },
          { 
            role: 'user', 
            content: text 
          },
        ],
        max_tokens: 500,
        temperature: 0.5,
        top_p: 1,
      });

      return NextResponse.json({ analysis: response.choices?.[0].message?.content ?? '' }, { status: 200 });
    }
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unsupported file type') {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 415 });
    }
    console.error('Error processing file', error);
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 });
  }
}
