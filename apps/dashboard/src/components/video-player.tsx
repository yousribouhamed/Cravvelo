"use client";

export const EmbeddedVideo: React.FC<{ videoId: string }> = ({ videoId }) => {
  return (
    <div className="w-full h-[500px]  relative ">
      <iframe
        src={`https://iframe.mediadelivery.net/embed/212306/${videoId}?autoplay=true`}
        loading="lazy"
        style={{
          border: "none",
          position: "absolute",

          height: "100%",
          width: "100%",
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};
