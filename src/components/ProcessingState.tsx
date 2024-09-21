'use client'

interface ProcessingStateProps {
  prompt?: string;
}

const ProcessingState = ({ prompt = 'Loading...' }: ProcessingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Spinner with aria-label for accessibility */}
      <div
        className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 mb-4"
        aria-label="Loading spinner"
      ></div>
      <p className="text-xs">{prompt}</p>
    </div>
  );
}

export default ProcessingState;