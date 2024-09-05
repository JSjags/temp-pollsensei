import React from "react";

interface SpinnerProps {
  size?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  title?: string;
}

export default function Loading({
  size = 40,
  className = "",
  primaryColor = "#8B5CF6",
  secondaryColor = "#C4B5FD",
  title = "Loading",
}: SpinnerProps) {
  const strokeWidth = size * 0.1;
  const circleSize = size - strokeWidth;
  const center = size / 2;
  const radius = circleSize / 2;

  return (
    <div
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={title}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <title>{title}</title>
        <defs>
          <linearGradient
            id="spinner-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#spinner-gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="animate-[smooth-spin_1.5s_linear_infinite,smooth-dash_1.5s_ease-in-out_infinite]"
          style={{
            strokeDasharray: `${circleSize * Math.PI * 0.75} ${
              circleSize * Math.PI * 0.25
            }`,
          }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="1.5s"
            repeatCount="indefinite"
            from={`0 ${center} ${center}`}
            to={`360 ${center} ${center}`}
          />
        </circle>
      </svg>
    </div>
  );
}
