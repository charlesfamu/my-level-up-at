'use client';

import { fetchCourses } from '@/services/course.services';
import { fetchSkills, uploadResume } from '@/services/skill.services';
import { camelCaseToTitleCase } from '@/utils';

import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

export enum Steps {
  Welcome = 'home',
  Upload = 'resume',
  Input = 'desires',
  Results = 'report',  
}

export enum ReportKeys {
  Certification = 'certificationsOrCourses',
  Industry = 'industryKnowledge',
  Introduction = 'introduction',
  Networking = 'networkingAndCommunity',
  SoftSkills = 'softSkills',
  TechnicalSkills = 'technicalSkills',
  TransferableSkills = 'transferableSkills',
}

export type SkillDetails = {
  id: string;
  details: string;
}

export type Course = {
  id: number;
  image_240x135: string;
  headline: string;
  title: string; 
  url: string;
}

export type Report = {
  [ReportKeys.Certification]: SkillDetails[];
  [ReportKeys.Industry]: string[];
  [ReportKeys.Introduction]: string;
  [ReportKeys.Networking]: string[];
  [ReportKeys.SoftSkills]: string[];
  [ReportKeys.TechnicalSkills]: SkillDetails[];
  [ReportKeys.TransferableSkills]: string[];
}

export type SkillsNeeded = {
  currentJob: string;
  desiredRole: string;
  report: Report;
}

export type ResumeContextType = {
  resumeFile: File | null;
  resumeSkills: string | null;
  desiredProfession: string | null;
  skillsNeeded: SkillsNeeded | null;
  courses: Course[] | null;
  loading: boolean;
  showBanner: boolean;
  step: string;
  clearCourses: () => void;
  clearResumeSkills: () => void;
  handleCloseBanner: () => void;
  handleFetchCourses: () => Promise<void>;
  handleUploadResume: (file: File) => Promise<void>;
  handleSubmitProfession: (profession: string | null, isJobDescription?: boolean) => Promise<void>;
  setStep: React.Dispatch<React.SetStateAction<string>>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeSkills, setResumeSkills] = useState<string | null>(null);
  const [desiredProfession, setDesiredProfession] = useState<string | null>(null);
  const [skillsNeeded, setSkillsNeeded] = useState<SkillsNeeded | null>(null);
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<string>(Steps.Welcome);
  const [showBanner, setShowBanner] = useState(true);

  const handleCloseBanner = useCallback(() => {
    setShowBanner(false);
  }, [setShowBanner]);

  const clearResumeSkills = useCallback(() => {
    setResumeSkills(null);
  }, [setResumeSkills]);

  const clearCourses = useCallback(() => {
    setCourses(null);
  }, [setCourses]);

  const handleFetchCourses = useCallback(async () => {
    setLoading(true);
    if (skillsNeeded) {
      const { certificationsOrCourses } = skillsNeeded.report ?? {};
      const titles = (certificationsOrCourses ?? []).map(details => {
        return camelCaseToTitleCase(details.id);
      }).join();
      const courses = await fetchCourses(titles);
      if (courses && Array.isArray(courses)) {
        setCourses(courses);
      }
    }
    setLoading(false);
  }, [skillsNeeded, setLoading, setCourses]);

  const handleUploadResume = useCallback(async (file: File) => {
    if (!file) return;

    setResumeFile(file);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const data = await uploadResume(formData);
    if (data) {
      setResumeSkills(data.analysis);
    } else {
      setResumeFile(null);
    }

    setLoading(false);
  }, [setLoading, setResumeSkills]);

  const handleSubmitProfession = useCallback(async (profession: string | null, isJobDescription: boolean = false) => {
    if (!profession || !resumeSkills) return;

    setLoading(true);
    setDesiredProfession(profession);

    const body = JSON.stringify({ 
      currentSkills: resumeSkills, 
      desiredProfession: profession, 
      isJobDescription 
    });

    const data = await fetchSkills(body);

    if (data) {
      setSkillsNeeded(data.skillsNeeded);
      setStep(Steps.Results);
    }

    setLoading(false);
  }, [resumeSkills, setLoading, setDesiredProfession, setSkillsNeeded, setStep]);

  const value = {
    resumeFile,
    resumeSkills,
    desiredProfession,
    skillsNeeded,
    courses,
    loading,
    showBanner,
    step,
    clearCourses,
    clearResumeSkills,
    handleCloseBanner,
    handleFetchCourses,
    handleUploadResume,
    handleSubmitProfession,
    setShowBanner,
    setStep,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}
