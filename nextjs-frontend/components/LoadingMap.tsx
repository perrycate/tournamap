import { FC } from "react";

const LoadingMap: FC = () => {
  return (
    <div className="z-[1200] flex-1 flex bg-[rgba(0,0,0,0.5)] absolute left-0 right-0 top-0 bottom-0">
      <div className="w-32 h-32 rounded-full border-neutral-100 animate-spin border-t-blue-400 border-[16px] m-auto flex-none"></div>
    </div>
  );
};

export default LoadingMap;
