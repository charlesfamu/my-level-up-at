'use client'

import DesiredProfessionCard from '@/components/DesiredProfessionCard';
import MainContainer from '@/components/MainContainer';
import ProcessingState from '@/components/ProcessingState';
import UploadResumeCard from '@/components/UploadResumeCard';
import WelcomeCard from '@/components/WelcomeCard';
import { Steps, useResumeContext } from '@/context/ResumeContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { step, setStep, loading, clearCourses, courses } = useResumeContext();
  const router = useRouter();

  useEffect(() => {
    if (step === Steps.Upload && courses) {
      clearCourses();
    }
  }, [step, courses, clearCourses]);

  useEffect(() => {
    if (step === Steps.Results) {
      router.push('/report');
    }
  }, [step, router, setStep]);

  if (step === Steps.Results) {
    return (
      <div className="flex items-center justify-center w-full">
        <ProcessingState prompt="Loading Report..."/>
      </div>
    );
  }

  return (
    <MainContainer>
      {step === Steps.Welcome && <WelcomeCard />}
      {step === Steps.Upload && <UploadResumeCard />}
      {step === Steps.Input && <DesiredProfessionCard />}
    </MainContainer>
  );
}
