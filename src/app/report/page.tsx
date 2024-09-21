'use client'

import Banner, { BannerHandles } from '@/components/Banner';
import Certification from '@/components/report/Certification';
import Industry from '@/components/report/Industry';
import Introduction from '@/components/report/Introduction';
import Networking from '@/components/report/Networking';
import SoftSkills from '@/components/report/SoftSkills';
import TechnicalSkills from '@/components/report/TechnicalSkills';
import TransferableSkills from '@/components/report/TransferableSkills';
import { Steps, useResumeContext } from '@/context/ResumeContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const Report = () => {
  const { courses, handleFetchCourses, skillsNeeded, setStep } = useResumeContext();
  const [bannerOpened, setBannerOpened] = useState(true);
  const [eventTracked, setEventTracked] = useState(false);
  const router = useRouter();
  const bannerRef = useRef<BannerHandles>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const { desiredRole, report } = skillsNeeded ?? {};
  const reportKeys = Object.keys(report ?? {});

  const goToWelcomePage = () => {
    router.replace('/');
  };

  const goToCertifications = () => {
    certificateRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!eventTracked && desiredRole && reportKeys.length) {
      setEventTracked(true);
    }
  }, [eventTracked, desiredRole, reportKeys]);

  useEffect(() => {
    setStep(Steps.Welcome);
  }, [setStep]);

  useEffect(() => {
    const fetchData = async () => {
      if (!courses) {
        await handleFetchCourses();
      }
    };
    
    fetchData();
  }, [courses, handleFetchCourses]);

  if (!desiredRole || !reportKeys.length) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={goToWelcomePage}
            aria-label="Get Started"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Banner
        bannerText="Level Up with These Courses."
        ref={bannerRef} 
        onClose={() => {
          bannerRef.current?.hide();
          setBannerOpened(false);
        }} 
        onTriggerGoToSlide={goToCertifications}
      />

      <div className="w-full max-w-full">
        <div className={`${bannerOpened ? 'mt-20 md:mt-24' : 'mt-8 md:mt-12'} transition-all duration-300`}>
          <Introduction />
        </div>
        <TransferableSkills />
        <TechnicalSkills />
        <SoftSkills />
        <Industry />
        <Networking />
        <div ref={certificateRef}>
          <Certification />
        </div>
      </div>
    </div>
  );
}

export default Report;