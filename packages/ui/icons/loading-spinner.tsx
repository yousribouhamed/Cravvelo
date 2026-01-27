import { cn } from "@ui/lib/utils";

export function LoadingSpinner({
  height = 25,
  width = 25,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
    >
      <radialGradient
        id="a12"
        cx=".66"
        fx=".66"
        cy=".3125"
        fy=".3125"
        gradientTransform="scale(1.5)"
      >
        <stop offset="0" stopColor="#FFFFFF"></stop>
        <stop offset=".3" stopColor="#FFFFFF" stopOpacity=".9"></stop>
        <stop offset=".6" stopColor="#FFFFFF" stopOpacity=".6"></stop>
        <stop offset=".8" stopColor="#FFFFFF" stopOpacity=".3"></stop>
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
      </radialGradient>
      <circle
        transformOrigin="center"
        fill="none"
        stroke="url(#a12)"
        strokeWidth="22"
        strokeLinecap="round"
        strokeDasharray="200 1000"
        strokeDashoffset="0"
        cx="100"
        cy="100"
        r="70"
      >
        <animateTransform
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="2"
          values="360;0"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
      <circle
        transformOrigin="center"
        fill="none"
        opacity=".2"
        stroke="#FFFFFF"
        strokeWidth="22"
        strokeLinecap="round"
        cx="100"
        cy="100"
        r="70"
      ></circle>
    </svg>
  );
}

export function OrangeLoadingSpinner({
  height = 25,
  width = 25,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200"
    >
      <radialGradient
        id="a12"
        cx=".66"
        fx=".66"
        cy=".3125"
        fy=".3125"
        gradientTransform="scale(1.5)"
      >
        <stop offset="0" stopColor="#FC6B00"></stop>
        <stop offset=".3" stopColor="#FC6B00" stopOpacity=".9"></stop>
        <stop offset=".6" stopColor="#FC6B00" stopOpacity=".6"></stop>
        <stop offset=".8" stopColor="#FC6B00" stopOpacity=".3"></stop>
        <stop offset="1" stopColor="#FC6B00" stopOpacity="0"></stop>
      </radialGradient>
      <circle
        transformOrigin="center"
        fill="none"
        stroke="url(#a12)"
        strokeWidth="22"
        strokeLinecap="round"
        strokeDasharray="200 1000"
        strokeDashoffset="0"
        cx="100"
        cy="100"
        r="70"
      >
        <animateTransform
          type="rotate"
          attributeName="transform"
          calcMode="spline"
          dur="2"
          values="360;0"
          keyTimes="0;1"
          keySplines="0 0 1 1"
          repeatCount="indefinite"
        ></animateTransform>
      </circle>
      <circle
        transformOrigin="center"
        fill="none"
        opacity=".2"
        stroke="#FC6B00"
        strokeWidth="22"
        strokeLinecap="round"
        cx="100"
        cy="100"
        r="70"
      ></circle>
    </svg>
  );
}
