import type { FC } from "react";
import { Gradian } from "../icons";
interface HeroLightsAbdullahProps {}

const HeroLights: FC = ({}) => {
  return (
    <>
      <div className="absolute top-0 left-0 bottom-0 z-[-20] h-screen w-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1349 2595"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M502.376 2594.2C969.817 2594.2 1348.75 1979.44 1348.75 1221.1C1348.75 462.757 969.817 -152 502.376 -152C34.9356 -152 -344 462.757 -344 1221.1C-344 1979.44 34.9356 2594.2 502.376 2594.2Z"
            fill="url(#paint0_radial_342_924)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_342_924"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(502.376 1221.1) scale(846.376 1373.1)"
            >
              <stop stop-color="#FFB800" stop-opacity="0.204" />
              <stop offset="1" stop-color="#FFB800" stop-opacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      {/* this is the gradian */}
      <div className="absolute -bottom-[0] z-[-5] top-0  w-full h-screen  right-0 ">
        <Gradian width="100%" height="100%" />
      </div>
      <div className="absolute -bottom-[30%] -z-10 w-full right-0  h-screen">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1390 2057"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.3" filter="url(#filter0_f_111_427)">
            <ellipse
              cx="1169"
              cy="1207.48"
              rx="696.081"
              ry="376.805"
              fill="#43766C"
            />
          </g>
          <g opacity="0.3" filter="url(#filter1_f_111_427)">
            <ellipse
              cx="1783.66"
              cy="744.64"
              rx="501.705"
              ry="271.585"
              fill="#43766C"
            />
          </g>
          <g opacity="0.3" filter="url(#filter2_f_111_427)">
            <ellipse
              cx="1336.8"
              cy="1020.15"
              rx="343.715"
              ry="285.112"
              fill="#43766C"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_111_427"
              x="0.492889"
              y="358.246"
              width="2337.02"
              height="1698.46"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="236.214"
                result="effect1_foregroundBlur_111_427"
              />
            </filter>
            <filter
              id="filter1_f_111_427"
              x="809.525"
              y="0.627998"
              width="1948.26"
              height="1488.02"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="236.214"
                result="effect1_foregroundBlur_111_427"
              />
            </filter>
            <filter
              id="filter2_f_111_427"
              x="715.19"
              y="457.142"
              width="1243.23"
              height="1126.02"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="138.949"
                result="effect1_foregroundBlur_111_427"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default HeroLights;
