'use client';

import { LeftArrowIcon, RightArrowIcon } from '@/components/CustomIcons';
import ProcessingState from '@/components/ProcessingState';
import { Steps, useResumeContext } from '@/context/ResumeContext';
import { useCallback, useEffect, useRef, useState } from 'react';

// Modal Component
const ErrorModal = ({ onClose }: { onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Close modal when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-card text-card-foreground p-4 sm:p-6 max-w-full sm:max-w-md w-full min-h-80 rounded shadow-md flex flex-col justify-between"
      >
        <div>
          <h2 id="modal-title" className="text-2xl font-bold mb-4">
            Error
          </h2>
          <p className="mb-4">
            There was an issue loading your resume. Please ensure that your file
            is in the correct format: Word document (.doc/.docx), PDF, or plain text.
          </p>
        </div>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:bg-accent mt-4"
          onClick={onClose}
          aria-label="Close Error Modal"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const UploadResumeCard = () => {
  const { clearResumeSkills, handleUploadResume, loading, resumeFile, resumeSkills, setStep } = useResumeContext();
  const [error, setError] = useState(false);
  const [triggerFileUpload, setTriggerFileUpload] = useState(false);

  useEffect(() => {
    if (triggerFileUpload && !loading && !resumeSkills) {
      setError(true);
      setTriggerFileUpload(false);
    }
  }, [resumeSkills, loading, triggerFileUpload])
  
  const handleFileChange = async (e: React.BaseSyntheticEvent) => {
    const file = e.target.files?.[0];
    if (file) {
      setTriggerFileUpload(true);
      clearResumeSkills();
      await handleUploadResume(file);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-card text-card-foreground p-4 sm:p-6 max-w-full sm:max-w-md min-h-80">
      <h1 className="text-2xl sm:text-2xl font-bold mb-2">Upload Your Resume</h1>
      <p className="text-sm sm:text-base">Let us help you in your journey. Upload your most up-to-date resume to get started.</p>
      <label
        className="flex flex-col justify-center items-center border-dashed border border-gray-300 p-2 sm:p-4 text-center min-h-24 cursor-pointer mt-4 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        tabIndex={0}
        aria-label="Click to upload your resume"
      >
        {loading ? (
          <ProcessingState prompt="Processing your resume..." />
        ) : (
          <>
            <span className="text-xs sm:text-xs">
              {resumeFile
                ? `Click to update your resume (${resumeFile?.name})`
                : 'Click to upload your resume'}
            </span>
            <input
              type="file"
              className="w-full hidden"
              onChange={handleFileChange}
              aria-describedby="resume-upload-description"
            />
          </>
        )}
      </label>
      <div className="flex flex-col sm:flex-row justify-between mt-4">
        <button 
          className={`flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 w-full sm:w-24 transition-all mb-2 sm:mb-0 rounded-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
          onClick={() => setStep(Steps.Welcome)}
        >
          <LeftArrowIcon className="w-4 h-4 text-primary-foreground mr-2" />
          <span>Back</span>
        </button>
        <button
          className={`flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 w-full sm:w-24 transition-all rounded-sm ${loading || !resumeSkills ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
          onClick={() => setStep(Steps.Input)}
          disabled={loading || !resumeSkills}
        >
          <span>Next</span>
          <RightArrowIcon className="w-4 h-4 text-primary-foreground ml-2" />
        </button>
      </div>
      {error && <ErrorModal onClose={() => setError(false)} />}
    </div>
  );
};

export default UploadResumeCard;