import React from 'react';

type MainContainerProps = {
  children: React.ReactNode;
};

const MainContainer = ({ children }: MainContainerProps)  => (
  <div className="flex flex-col flex-grow items-center justify-center p-4">
    <div className="bg-card pl-8 pr-8 pt-4 pb-4 max-w-md">
      {children}
    </div>
  </div>
);

export default MainContainer;
