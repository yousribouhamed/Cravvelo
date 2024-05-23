"use client";

import type { FC } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface StudentProgressProps {
  totalVideos: number;
  currentVideo: number;
  color: string;
}

function calculateProgress(episode: number, videos: number): number {
  if (episode < 0 || videos < 1 || episode > videos) {
    throw new Error(
      "Invalid input: Current video or total videos cannot be less than 1, and current video cannot be greater than total videos."
    );
  }

  const progressPercentage = (episode / videos) * 100;
  return parseFloat(progressPercentage.toFixed(0));
}

const studentProgress: FC<StudentProgressProps> = ({
  currentVideo,
  totalVideos,
  color,
}) => {
  const percentage = calculateProgress(currentVideo, totalVideos);
  return (
    <div className="w-full h-[100px] border-b flex items-center justify-center gap-x-4">
      <div className="w-[75px] h-[75px] relative flex items-center justify-center">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#000000",
            pathColor: color,
            trailColor: "#EBEBEB",
            textSize: "25px",
          })}
        />
        <div className="absolute -bottom-4 -right-2">
          <svg
            width="50"
            height="49"
            viewBox="0 0 40 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_2001_5992)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20 8C14.7534 8 10.5 12.2534 10.5 17.5C10.5 22.7466 14.7534 27 20 27C25.2466 27 29.5 22.7466 29.5 17.5C29.5 12.2534 25.2466 8 20 8ZM24.1178 15.8936C24.1936 15.807 24.2514 15.706 24.2876 15.5967C24.3238 15.4874 24.3378 15.3719 24.3288 15.2571C24.3197 15.1423 24.2878 15.0305 24.2349 14.9282C24.182 14.8259 24.1092 14.7352 24.0207 14.6615C23.9322 14.5878 23.8299 14.5325 23.7198 14.4989C23.6096 14.4653 23.4939 14.4541 23.3793 14.4659C23.2648 14.4777 23.1537 14.5123 23.0527 14.5676C22.9517 14.623 22.8629 14.698 22.7913 14.7882L19.0776 19.2437L17.156 17.3212C16.9932 17.1639 16.775 17.0769 16.5486 17.0788C16.3221 17.0808 16.1055 17.1716 15.9454 17.3317C15.7853 17.4919 15.6944 17.7085 15.6925 17.9349C15.6905 18.1614 15.7775 18.3795 15.9349 18.5424L18.5258 21.1333C18.6106 21.2181 18.7122 21.2843 18.8241 21.3277C18.9359 21.3711 19.0556 21.3906 19.1755 21.3852C19.2953 21.3798 19.4127 21.3494 19.5202 21.2961C19.6276 21.2427 19.7228 21.1676 19.7996 21.0755L24.1178 15.8936Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_2001_5992"
                x="0.5"
                y="0"
                width="39"
                height="39"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2001_5992"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2001_5992"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="w-[200px] h-[80px] flex flex-col justify-center gap-y-2">
        <span className="text-xl font-bold text-black">حالة التطوير </span>
        <span className="text-black text-lg ">
          {currentVideo}/{totalVideos} اكتمل
        </span>
      </div>
    </div>
  );
};

export default studentProgress;
