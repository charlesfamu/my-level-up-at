'use client'
import { LeftArrowIcon } from '@/components/CustomIcons';
import ProcessingState from '@/components/ProcessingState';
import { Steps, useResumeContext } from '@/context/ResumeContext';
import { useState } from 'react';

const DesiredProfessionCard = () => {
  const { handleSubmitProfession, loading, setStep } = useResumeContext();
  
  const [profession, setProfession] = useState<string | null>(null);
  const [isJobDescription, setIsJobDescription] = useState<boolean>(false);

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    handleSubmitProfession(profession, isJobDescription);
  };

  const handleProfessionChange = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    setProfession(e.target.value);
  };

  const handleJobDescriptionChange = (e: React.BaseSyntheticEvent) => {
    // e.preventDefault();
    setIsJobDescription(e.target.checked);
  };

  return (
    <div className="flex flex-col justify-between bg-card text-card-foreground p-4 sm:p-6 max-w-full sm:max-w-md min-h-80 mx-auto">
      <h1 className="text-2xl sm:text-2xl font-bold mb-2">Entire Desired Profession</h1>
      <p className="text-sm sm:text-base mb-4">You&apos;re almost done! Enter your desired profession or the job description. If you enter a job description,
        remember to click the box below before submitting.
      </p>
      <div className="mb-4">
        {loading ? (
          <ProcessingState prompt='Processing the details...'/>
        ) : (
          <>
            <textarea
              className="w-full h-32 border border-gray-300 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-2"
              value={profession ?? ''}
              onChange={handleProfessionChange}
            />
            <div className="flex">
              <input
                id="jobDescriptionCheckbox"
                type="checkbox" 
                checked={isJobDescription}
                onChange={handleJobDescriptionChange} 
                className="mr-1 text-black cursor-pointer" 
              />
              <label htmlFor="jobDescriptionCheckbox" className="text-xs sm:text-xs cursor-pointer">
                Click if is a job description
              </label>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between">
        <button 
          className={`flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 w-full sm:w-24 transition-all mb-2 sm:mb-0 rounded-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
          onClick={() => setStep(Steps.Upload)}
          disabled={loading}
        >
          <LeftArrowIcon className="w-4 h-4 text-primary-foreground mr-2" />
          <span>Back</span>
        </button>
        <button
          onClick={handleSubmit}
          className={`flex items-center justify-center bg-blue-500 text-white px-4 py-2 w-full sm:w-24 rounded-sm font-bold transition mb-2 sm:mb-0 ${loading || !profession ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
          disabled={loading || !profession}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DesiredProfessionCard;