import { forwardRef, useImperativeHandle, useState } from 'react';

interface BannerProps {
  bannerText?: string;
  onClose: () => void;
  onTriggerGoToSlide: () => void;
}

export interface BannerHandles {
  hide: () => void;
  triggerGoToSlide: (index: number) => void;
}

const Banner = forwardRef<BannerHandles, BannerProps>(
  function Banner({ bannerText = 'Banner Text', onClose, onTriggerGoToSlide }, ref) {
    const [isVisible, setIsVisible] = useState(true);

    useImperativeHandle(ref, () => ({
      hide: () => setIsVisible(false),
      triggerGoToSlide: () => onTriggerGoToSlide(),
    }));

    if (!isVisible) return null;

    const handleClose = () => {
      setIsVisible(false);
      onClose();
    };

    return (
      <div className="fixed top-14 left-0 right-0 bg-gradient-to-r from-[#0083A4] to-[#4C9FBC] text-[#FFFFFF] px-6 py-3 flex items-center gap-6 z-40">
        <p className="text-base flex-1 text-center">
        {bannerText}
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onTriggerGoToSlide()}
            className="bg-[#FFFFFF] text-[#0083A4] py-1 px-4 rounded text-sm"
          >
            Go
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 cursor-pointer fill-[#FFFFFF] inline-block"
            viewBox="0 0 320.591 320.591"
            onClick={handleClose}
          >
            <path
              d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
              data-original="#000000"
            />
            <path
              d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
              data-original="#000000"
            />
          </svg>
        </div>
      </div>
    );
  }
);

export default Banner;
