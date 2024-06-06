import type { FC } from "react";

interface BestBenifitsAbdullahProps {}

const BestBenefits: FC = ({}) => {
  return (
    <>
      <div className="w-full min-h-[250px] h-fit  flex flex-col justify-center gap-y-8  ">
        <h2 className="text-5xl font-bold text-center">أهم المميزات</h2>
        <p className="text-center my-4 text-xl">
          إنشاء وتسويق وبيع الدورات التدريبية عبر الإنترنت، في مكان واحد.
        </p>
      </div>
      <div className="w-full min-h-[250px] h-fit grid grid-cols-1 lg:grid-cols-3 gap-10  ">
        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[50px] h-[50px] ">{icons[0].icons1()}</div>
            <h3 className="text-4xl font-bold  text-start">بيع</h3>
          </div>

          <p className="text-xl text-gray-700 mt-4 text-start">
            {" "}
            نوفر لك مجموعة من الأدوات تمكنك من النمو وبيع خبراتك بسهولة.
          </p>
        </div>

        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[50px] h-[50px] ">{icons[1].icons2()}</div>
            <h3 className="text-4xl font-bold  text-start">إدارة</h3>
          </div>

          <p className="text-xl text-gray-700 mt-4 text-start">
            {" "}
            لوحة تحكم سهلة، بتجربة مذهلة، تتيح إدارة كل دوراتك.
          </p>
        </div>

        <div className="w-full h-full border border-yellow-500 rounded-xl bg-[#F8FAE5] p-8">
          <div className="w-full h-[50px] flex items-center justify-start gap-x-4">
            <div className="w-[50px] h-[50px] ">{icons[2].icons3()}</div>
            <h3 className="text-4xl font-bold  text-start">تحليل</h3>
          </div>

          <p className="text-xl text-gray-700 mt-4 text-start">
            {" "}
            تقارير وإحصاءات متقدمة تساعدك في الارتقاء بعملك.
          </p>
        </div>
      </div>
    </>
  );
};

export default BestBenefits;

const icons = [
  {
    icons1: () => (
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2957_2591)">
          <rect
            x="70.3806"
            y="54"
            width="183.569"
            height="183.569"
            rx="47.4086"
            transform="rotate(0.118781 70.3806 54)"
            fill="white"
          />
        </g>
        <g filter="url(#filter1_b_2957_2591)">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M138.32 115.873V115.863C138.32 106.19 146.161 98.3486 155.834 98.3486H168.571C178.244 98.3486 186.085 106.19 186.085 115.863V115.873C194.982 115.938 199.854 116.394 203.053 119.593C206.784 123.324 206.784 129.329 206.784 141.338V154.075H117.622V141.338C117.622 129.329 117.622 123.324 121.352 119.593C124.552 116.394 129.423 115.938 138.32 115.873ZM147.873 115.863C147.873 111.466 151.437 107.902 155.834 107.902H168.571C172.968 107.902 176.532 111.466 176.532 115.863L147.873 115.863Z"
            fill="url(#paint0_linear_2957_2591)"
          />
        </g>
        <g filter="url(#filter2_b_2957_2591)">
          <mask id="path-3-inside-1_2957_2591" fill="white">
            <path d="M117.621 154.076C117.621 142.067 117.621 136.062 121.352 132.331C121.352 132.331 121.352 132.331 121.352 132.331C125.083 128.601 131.087 128.601 143.096 128.601H181.309C193.318 128.601 199.322 128.601 203.053 132.331C203.053 132.331 203.053 132.331 203.053 132.331C206.784 136.062 206.784 142.067 206.784 154.076C206.784 172.089 206.784 181.096 201.188 186.692V186.692C195.592 192.288 186.585 192.288 168.571 192.288H155.834C137.82 192.288 128.814 192.288 123.217 186.692C123.217 186.692 123.217 186.692 123.217 186.692C117.621 181.096 117.621 172.089 117.621 154.076Z" />
          </mask>
          <path
            d="M117.621 154.076C117.621 142.067 117.621 136.062 121.352 132.331C121.352 132.331 121.352 132.331 121.352 132.331C125.083 128.601 131.087 128.601 143.096 128.601H181.309C193.318 128.601 199.322 128.601 203.053 132.331C203.053 132.331 203.053 132.331 203.053 132.331C206.784 136.062 206.784 142.067 206.784 154.076C206.784 172.089 206.784 181.096 201.188 186.692V186.692C195.592 192.288 186.585 192.288 168.571 192.288H155.834C137.82 192.288 128.814 192.288 123.217 186.692C123.217 186.692 123.217 186.692 123.217 186.692C117.621 181.096 117.621 172.089 117.621 154.076Z"
            fill="#F8B77B"
            fill-opacity="0.6"
          />
          <path
            d="M123.217 186.692L123.65 186.259L123.217 186.692ZM123.217 186.692L123.65 186.259L123.217 186.692ZM201.188 186.692L200.755 186.259L201.188 186.692ZM201.188 186.692L200.755 186.259L201.188 186.692ZM203.053 132.331L203.486 131.899L203.053 132.331ZM203.053 132.331L203.486 131.899L203.053 132.331ZM121.352 132.331L120.919 131.899L121.352 132.331ZM121.352 132.331L120.919 131.899L121.352 132.331ZM143.096 129.212H181.309V127.989H143.096V129.212ZM168.571 191.676H155.834V192.9H168.571V191.676ZM155.834 191.676C146.81 191.676 140.103 191.675 134.951 190.982C129.816 190.292 126.315 188.925 123.65 186.259L122.785 187.125C125.715 190.055 129.517 191.486 134.788 192.195C140.041 192.901 146.844 192.9 155.834 192.9V191.676ZM117.009 154.076C117.009 163.065 117.008 169.869 117.714 175.122C118.423 180.393 119.854 184.194 122.785 187.125L123.65 186.259C120.985 183.594 119.618 180.094 118.927 174.959C118.235 169.806 118.233 163.1 118.233 154.076H117.009ZM123.65 186.259C123.65 186.259 123.65 186.259 123.65 186.259L122.785 187.125C122.785 187.125 122.785 187.125 122.785 187.125L123.65 186.259ZM206.172 154.076C206.172 163.1 206.171 169.806 205.478 174.959C204.787 180.094 203.42 183.594 200.755 186.259L201.62 187.125C204.551 184.194 205.982 180.393 206.691 175.122C207.397 169.869 207.396 163.065 207.396 154.076H206.172ZM168.571 192.9C177.561 192.9 184.364 192.901 189.618 192.195C194.888 191.486 198.69 190.055 201.62 187.125L200.755 186.259C198.09 188.925 194.59 190.292 189.454 190.982C184.302 191.675 177.595 191.676 168.571 191.676V192.9ZM200.755 186.259C200.755 186.259 200.755 186.259 200.755 186.259L201.62 187.125C201.62 187.125 201.62 187.125 201.62 187.125L200.755 186.259ZM181.309 129.212C187.331 129.212 191.785 129.214 195.204 129.673C198.604 130.131 200.888 131.031 202.62 132.764L203.486 131.899C201.488 129.901 198.903 128.936 195.367 128.46C191.848 127.987 187.296 127.989 181.309 127.989V129.212ZM207.396 154.076C207.396 148.088 207.397 143.536 206.924 140.018C206.448 136.481 205.484 133.897 203.486 131.899L202.62 132.764C204.353 134.497 205.254 136.78 205.711 140.181C206.171 143.599 206.172 148.054 206.172 154.076H207.396ZM202.62 132.764C202.62 132.764 202.62 132.764 202.62 132.764L203.486 131.899C203.486 131.899 203.486 131.899 203.486 131.899L202.62 132.764ZM143.096 127.989C137.109 127.989 132.557 127.987 129.038 128.46C125.502 128.936 122.917 129.901 120.919 131.899L121.785 132.764C123.517 131.031 125.801 130.131 129.201 129.673C132.62 129.214 137.074 129.212 143.096 129.212V127.989ZM118.233 154.076C118.233 148.054 118.235 143.599 118.694 140.181C119.151 136.78 120.052 134.497 121.785 132.764L120.919 131.899C118.921 133.897 117.957 136.481 117.481 140.018C117.008 143.536 117.009 148.088 117.009 154.076H118.233ZM120.919 131.899C120.919 131.899 120.919 131.899 120.919 131.899L121.785 132.764C121.785 132.764 121.785 132.764 121.785 132.764L120.919 131.899Z"
            fill="url(#paint1_linear_2957_2591)"
            mask="url(#path-3-inside-1_2957_2591)"
          />
        </g>
        <g filter="url(#filter3_b_2957_2591)">
          <rect
            x="175.246"
            y="140.889"
            width="6.11896"
            height="25.6996"
            rx="3.05948"
            transform="rotate(90 175.246 140.889)"
            fill="url(#paint2_linear_2957_2591)"
            fill-opacity="0.9"
          />
          <rect
            x="175.001"
            y="141.133"
            width="5.62944"
            height="25.2101"
            rx="2.81472"
            transform="rotate(90 175.001 141.133)"
            stroke="url(#paint3_linear_2957_2591)"
            stroke-width="0.489516"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2957_2591"
            x="0.405677"
            y="0.506695"
            width="339.239"
            height="339.239"
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
            <feMorphology
              radius="11.6285"
              operator="erode"
              in="SourceAlpha"
              result="effect1_dropShadow_2957_2591"
            />
            <feOffset dx="8.05051" dy="24.1515" />
            <feGaussianBlur stdDeviation="44.7251" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0846354 0 0 0 0 0.203125 0 0 0 0 0.3125 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2957_2591"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2957_2591"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_b_2957_2591"
            x="104.884"
            y="85.6111"
            width="114.637"
            height="81.2015"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.36874" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2591"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2591"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_b_2957_2591"
            x="104.884"
            y="115.863"
            width="114.637"
            height="89.1625"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.36874" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2591"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2591"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_b_2957_2591"
            x="136.241"
            y="127.583"
            width="52.3102"
            height="32.7297"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.65263" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2591"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2591"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_2957_2591"
            x1="143.342"
            y1="110.539"
            x2="202.067"
            y2="142.851"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FBA47F" />
            <stop offset="1" stop-color="#DF6B00" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2957_2591"
            x1="111.253"
            y1="134.39"
            x2="216.067"
            y2="210.156"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2957_2591"
            x1="185.952"
            y1="137.855"
            x2="181.993"
            y2="162.901"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="0.979167" stop-color="white" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_2957_2591"
            x1="178.306"
            y1="140.889"
            x2="178.306"
            y2="166.588"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="1" stop-color="white" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    icons2: () => (
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2957_2584)">
          <rect
            x="70.3806"
            y="54"
            width="183.569"
            height="183.569"
            rx="47.4086"
            transform="rotate(0.118781 70.3806 54)"
            fill="white"
          />
        </g>
        <g filter="url(#filter1_b_2957_2584)">
          <path
            d="M186.063 109.043C188.685 113.586 188.685 119.685 188.685 131.883C188.685 144.081 188.685 150.179 186.063 154.722C184.344 157.698 181.873 160.17 178.897 161.888C174.354 164.511 168.255 164.511 156.057 164.511H143.006C139.33 164.511 136.208 164.511 133.515 164.439L120.195 172.345C118.822 173.16 117.103 172.077 117.246 170.487L118.139 160.542C116.061 158.969 114.312 156.993 113.001 154.722C110.378 150.179 110.378 144.081 110.378 131.883C110.378 119.685 110.378 113.586 113.001 109.043C114.719 106.067 117.191 103.596 120.167 101.878C124.71 99.2549 130.808 99.2549 143.006 99.2549L156.057 99.2549C168.255 99.2549 174.354 99.2549 178.897 101.878C181.873 103.596 184.344 106.067 186.063 109.043Z"
            fill="url(#paint0_linear_2957_2584)"
          />
        </g>
        <g filter="url(#filter2_b_2957_2584)">
          <path
            d="M139.104 128.619C136.481 133.162 136.481 139.261 136.481 151.459C136.481 163.657 136.481 169.756 139.103 174.298C140.822 177.274 143.293 179.746 146.269 181.464C150.812 184.087 156.911 184.087 169.109 184.087H182.16C185.998 184.087 189.232 184.087 192.004 184.005L204.95 191.865C206.323 192.698 208.059 191.615 207.916 190.016L207.028 180.118C209.105 178.545 210.854 176.569 212.165 174.298C214.788 169.756 214.788 163.657 214.788 151.459C214.788 139.261 214.788 133.162 212.165 128.619C210.447 125.643 207.975 123.172 204.999 121.454C200.456 118.831 194.358 118.831 182.16 118.831L169.109 118.831C156.911 118.831 150.812 118.831 146.269 121.454C143.293 123.172 140.822 125.643 139.104 128.619Z"
            fill="#6AE092"
            fill-opacity="0.6"
          />
        </g>
        <g filter="url(#filter3_b_2957_2584)">
          <rect
            x="195.962"
            y="138.441"
            width="6.65263"
            height="39.9158"
            rx="3.32632"
            transform="rotate(90 195.962 138.441)"
            fill="url(#paint1_linear_2957_2584)"
            fill-opacity="0.9"
          />
          <rect
            x="195.717"
            y="138.686"
            width="6.16312"
            height="39.4263"
            rx="3.08156"
            transform="rotate(90 195.717 138.686)"
            stroke="url(#paint2_linear_2957_2584)"
            stroke-width="0.489516"
          />
        </g>
        <g filter="url(#filter4_b_2957_2584)">
          <rect
            x="186.641"
            y="158.022"
            width="7.34275"
            height="30.5948"
            rx="3.67137"
            transform="rotate(90 186.641 158.022)"
            fill="url(#paint3_linear_2957_2584)"
            fill-opacity="0.9"
          />
          <rect
            x="186.396"
            y="158.267"
            width="6.85323"
            height="30.1053"
            rx="3.42661"
            transform="rotate(90 186.396 158.267)"
            stroke="url(#paint4_linear_2957_2584)"
            stroke-width="0.489516"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2957_2584"
            x="0.405677"
            y="0.506695"
            width="339.239"
            height="339.238"
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
            <feMorphology
              radius="11.6285"
              operator="erode"
              in="SourceAlpha"
              result="effect1_dropShadow_2957_2584"
            />
            <feOffset dx="8.05051" dy="24.1515" />
            <feGaussianBlur stdDeviation="44.7251" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0846354 0 0 0 0 0.203125 0 0 0 0 0.3125 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2957_2584"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2957_2584"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_b_2957_2584"
            x="97.3273"
            y="86.2037"
            width="104.409"
            height="99.4709"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.52557" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2584"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2584"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_b_2957_2584"
            x="123.43"
            y="105.78"
            width="104.409"
            height="99.4241"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.52557" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2584"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2584"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_b_2957_2584"
            x="142.741"
            y="125.136"
            width="66.5263"
            height="33.2634"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.65263" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2584"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2584"
              result="shape"
            />
          </filter>
          <filter
            id="filter4_b_2957_2584"
            x="142.741"
            y="144.717"
            width="57.2053"
            height="33.9533"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.65263" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2584"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2584"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_2957_2584"
            x1="93.0207"
            y1="99.2799"
            x2="124.281"
            y2="212.054"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#E5E5E5" />
            <stop offset="1" stop-color="#349256" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2957_2584"
            x1="207.602"
            y1="133.73"
            x2="199.035"
            y2="171.667"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="0.979167" stop-color="white" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2957_2584"
            x1="199.288"
            y1="138.441"
            x2="199.288"
            y2="178.357"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="1" stop-color="white" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_2957_2584"
            x1="196.37"
            y1="157.694"
            x2="193.052"
            y2="182.541"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="0.979167" stop-color="white" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_2957_2584"
            x1="190.312"
            y1="158.022"
            x2="190.312"
            y2="188.617"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="1" stop-color="white" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    icons3: () => (
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_2957_2575)">
          <rect
            x="70.3806"
            y="54"
            width="183.569"
            height="183.569"
            rx="47.4086"
            transform="rotate(0.118781 70.3806 54)"
            fill="white"
          />
        </g>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M131.814 104.665C134.363 104.665 136.429 106.731 136.429 109.28L136.429 183.126C136.429 185.675 134.363 187.741 131.814 187.741C129.265 187.741 127.198 185.675 127.198 183.126L127.198 109.28C127.198 106.731 129.265 104.665 131.814 104.665Z"
          fill="url(#paint0_linear_2957_2575)"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M162.583 104.665C165.132 104.665 167.198 106.731 167.198 109.28L167.198 183.126C167.198 185.675 165.132 187.741 162.583 187.741C160.034 187.741 157.968 185.675 157.968 183.126L157.968 109.28C157.968 106.731 160.034 104.665 162.583 104.665Z"
          fill="url(#paint1_linear_2957_2575)"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M193.352 104.665C195.901 104.665 197.967 106.731 197.967 109.28L197.967 183.126C197.967 185.675 195.901 187.741 193.352 187.741C190.803 187.741 188.737 185.675 188.737 183.126L188.737 109.28C188.737 106.731 190.803 104.665 193.352 104.665Z"
          fill="url(#paint2_linear_2957_2575)"
        />
        <g filter="url(#filter1_b_2957_2575)">
          <circle
            cx="131.814"
            cy="164.664"
            r="12.3076"
            transform="rotate(90 131.814 164.664)"
            fill="#BFB5FF"
            fill-opacity="0.6"
          />
          <circle
            cx="131.814"
            cy="164.664"
            r="11.9999"
            transform="rotate(90 131.814 164.664)"
            stroke="url(#paint3_linear_2957_2575)"
            stroke-width="0.615382"
          />
        </g>
        <g filter="url(#filter2_b_2957_2575)">
          <circle
            cx="162.583"
            cy="127.741"
            r="12.3076"
            transform="rotate(90 162.583 127.741)"
            fill="#BFB5FF"
            fill-opacity="0.6"
          />
          <circle
            cx="162.583"
            cy="127.741"
            r="11.9999"
            transform="rotate(90 162.583 127.741)"
            stroke="url(#paint4_linear_2957_2575)"
            stroke-width="0.615382"
          />
        </g>
        <g filter="url(#filter3_b_2957_2575)">
          <circle
            cx="193.352"
            cy="164.664"
            r="12.3076"
            transform="rotate(90 193.352 164.664)"
            fill="#BFB5FF"
            fill-opacity="0.6"
          />
          <circle
            cx="193.352"
            cy="164.664"
            r="11.9999"
            transform="rotate(90 193.352 164.664)"
            stroke="url(#paint5_linear_2957_2575)"
            stroke-width="0.615382"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_2957_2575"
            x="0.405677"
            y="0.506695"
            width="339.239"
            height="339.238"
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
            <feMorphology
              radius="11.6285"
              operator="erode"
              in="SourceAlpha"
              result="effect1_dropShadow_2957_2575"
            />
            <feOffset dx="8.05051" dy="24.1515" />
            <feGaussianBlur stdDeviation="44.7251" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.0846354 0 0 0 0 0.203125 0 0 0 0 0.3125 0 0 0 0.1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_2957_2575"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_2957_2575"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_b_2957_2575"
            x="107.199"
            y="140.049"
            width="49.2305"
            height="49.2305"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.15382" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2575"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2575"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_b_2957_2575"
            x="137.968"
            y="103.126"
            width="49.2305"
            height="49.2305"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.15382" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2575"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2575"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_b_2957_2575"
            x="168.737"
            y="140.049"
            width="49.2305"
            height="49.2305"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="6.15382" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_2957_2575"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_2957_2575"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_2957_2575"
            x1="134.41"
            y1="128.629"
            x2="113.556"
            y2="135.367"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#917FFB" />
            <stop offset="1" stop-color="#3F2DAF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2957_2575"
            x1="165.179"
            y1="128.629"
            x2="144.325"
            y2="135.367"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#917FFB" />
            <stop offset="1" stop-color="#3F2DAF" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2957_2575"
            x1="195.948"
            y1="128.629"
            x2="175.094"
            y2="135.367"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#917FFB" />
            <stop offset="1" stop-color="#3F2DAF" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_2957_2575"
            x1="116.429"
            y1="183.126"
            x2="141.045"
            y2="155.433"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_2957_2575"
            x1="147.199"
            y1="146.203"
            x2="171.814"
            y2="118.511"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_2957_2575"
            x1="177.967"
            y1="183.126"
            x2="202.583"
            y2="155.433"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];
