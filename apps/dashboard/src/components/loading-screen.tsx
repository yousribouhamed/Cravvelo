interface LoadingScreenProps {
  mode?: "loading" | "signin" | "signup" | "restriction";
}

export function LoadingScreen({ mode = "loading" }: LoadingScreenProps) {
  const getDisplayText = () => {
    switch (mode) {
      case "signin":
        return {
          title: "مرحبًا بعودتك ...",
          subtitle: "العلم خير من المال، العلم يحرسك وأنت تحرس المال",
        };
      case "signup":
        return {
          title: "مرحبًا بك ...",
          subtitle: "اطلبوا العلم من المهد إلى اللحد",
        };
      case "restriction":
        return {
          title: "جاري التحقق ...",
          subtitle: "من طلب العلا سهر الليالي",
        };
      default:
        return {
          title: "جاري التحميل ...",
          subtitle:
            "أول العلم الصمت والثاني حسن الإستماع والثالث حفظه والرابع العمل به والخامس نشره",
        };
    }
  };

  const { title, subtitle } = getDisplayText();

  return (
    <div
      aria-label="Loading"
      aria-describedby="loading-description"
      className="w-full h-screen flex flex-col items-center justify-center gap-y-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width="150"
        height="150"
      >
        <radialGradient
          id="a9"
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
          fill="none"
          stroke="url(#a9)"
          strokeWidth="27"
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
            dur="1.3"
            values="360;0"
            keyTimes="0;1"
            keySplines="0 0 1 1"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
        <circle
          fill="none"
          opacity=".2"
          stroke="#FC6B00"
          strokeWidth="27"
          strokeLinecap="round"
          cx="100"
          cy="100"
          r="70"
        ></circle>
      </svg>
      <span className="text-xl font-bold">{title}</span>
      <span className="text-sm text-gray-500">{subtitle}</span>
    </div>
  );
}
