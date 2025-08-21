import React from "react";

interface SpinnerProps {
  className?: string;
  size?: number;
  color?: string;
}

export const CravveloSpinner: React.FC<SpinnerProps> = ({
  className = "",
  size = 20,
  color = "#666",
}) => {
  const spans = [...new Array(12)].map((_, index) => (
    <span
      key={`spinner-${index}`}
      className="spinner-bar"
      style={{
        backgroundColor: color,
        transform: `rotate(${index * 30}deg) translate(146%)`,
        animationDelay: `${-1.2 + index * 0.1}s`,
      }}
    />
  ));

  return (
    <div
      className={`spinner ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="spinner-container">{spans}</div>
      <style>{`
        .spinner {
          display: inline-block;
          box-sizing: border-box;
        }
        
        .spinner-container {
          width: 100%;
          height: 100%;
          position: relative;
          left: 50%;
          top: 50%;
        }
        
        .spinner-bar {
          position: absolute;
          top: -3.9%;
          width: 24%;
          height: 8%;
          left: -10%;
          border-radius: 2px;
          animation: spinner-fade 1.2s linear infinite;
        }
        
        @keyframes spinner-fade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
};
