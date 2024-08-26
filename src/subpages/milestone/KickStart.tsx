import React, { ReactNode } from 'react'

interface MilestoneProps {
  icon: ReactNode;
  onClick?: () => void;
  progress: string;
}

const KickStart: React.FC<MilestoneProps> = ({ icon, onClick, progress }) => {
  return (
    <div className="relative flex flex-col items-center w-20 text-center space-y-2">
    <div className="relative p-1 bg-purple-200 rounded-full">
      <div className="relative p-1 bg-purple-100 rounded-full">
        <div className="relative p-4 bg-tranparent rounded-full"
        onClick={onClick}>
          <div
            className="absolute inset-0 rounded-full animate-spin-slow"
            style={{
              background: `conic-gradient(#5B03B2 0% ${progress}, #e5e5e5 ${progress} 100%)`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 4px), black 0)",
            }}
          />
          <div className="relative flex items-center justify-center w-full h-full">
            {icon}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default KickStart
