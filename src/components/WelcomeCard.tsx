import { RightArrowIcon } from '@/components/CustomIcons';
import { Steps, useResumeContext } from '@/context/ResumeContext';

const WelcomeCard = () => {
  const { setStep } = useResumeContext();
  return (
    <div className="flex flex-col justify-between bg-card text-card-foreground p-4 sm:p-6 max-w-full sm:max-w-md min-h-80">
      <h1 className="text-2xl sm:text-2xl font-bold">Welcome to your career transition assistant</h1>
      <p className="mb-4 sm:mb-8 text-sm sm:text-base">
        Meet the AI career coach, bridging the gap between your current skills and the ones you need to land your dream job.
      </p>
      <button 
        className="flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 w-full sm:w-60 hover:bg-accent transition-all rounded-sm"
        onClick={() => setStep(Steps.Upload)}
      >
        <span>Let&rsquo;s Get Started</span>
        <RightArrowIcon className="w-4 h-4 text-primary-foreground ml-2" />
      </button>
    </div>
  );
}

export default WelcomeCard;
