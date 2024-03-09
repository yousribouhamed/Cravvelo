import LoadingCard from "../../_components/loading";

const Loading = async () => {
  return (
    <div className="  w-full h-fit min-h-screen flex flex-col gap-4 items-start py-4">
      <LoadingCard />
    </div>
  );
};

export default Loading;
