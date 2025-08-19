import React from "react";

interface SpinnerProps {
  className?: string;
  size?: number; // Size in rem units (default: 1.25rem = 20px)
  color?: string; // Color of the spinner bars (default: current text color)
  speed?: number; // Animation duration in seconds (default: 1.2s)
}

const Spinner: React.FC<SpinnerProps> = ({
  className = "",
  size = 1.25,
  color = "currentColor",
  speed = 1.2,
}) => {
  const spans = [...Array(12)].map((_, index) => (
    <span
      key={`spinner-${index}`}
      style={{
        backgroundColor: color,
        position: "absolute",
        top: "-3.9%",
        width: "24%",
        height: "8%",
        left: "-10%",
        borderRadius: "4px",
        animation: `spinner-fade ${speed}s linear infinite`,
        animationDelay: `${-speed + (index * speed) / 12}s`,
        transform: `rotate(${index * 30}deg) translate(146%)`,
      }}
    />
  ));

  return (
    <div
      className={`geist-spinner ${className}`}
      style={{
        display: "inline-block",
        width: `${size}rem`,
        height: `${size}rem`,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          left: "50%",
          top: "50%",
        }}
      >
        {spans}
      </div>
      <style jsx>{`
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

export default Spinner;
