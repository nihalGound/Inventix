import React from "react";

type Props = {
  stats: number;
  title: string;
  icon: React.JSX.Element;
};

function StatsCard({ stats, title, icon }: Props) {
  return (
    <div className="rounded-md w-full p-6 bg-[#262626]">
      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col justify-between items-start">
            <span className="text-[#a3a3a3] text-lg capitalize font-light">{title}</span>
            <h2 className="text-2xl text-white font-bold">{stats}</h2>
          </div>
          <div className="grid grid-cols-1 grid-rows-1 place-items-center">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
