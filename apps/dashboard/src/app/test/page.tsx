"use client";

import { useState, type FC } from "react";
import { trpc } from "../_trpc/client";

interface pageAbdullahProps {}

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const page: FC = ({}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const mutation = trpc.getSignedUrl.useMutation({
    onSuccess: async ({ success }) => {
      console.log("we have created the sign url ");
      console.log(success);
      await fetch(success.url, {
        method: "put",
        body: selectedFile,
        headers: {
          "content-type": selectedFile.type,
        },
      });
      setUploading(false);
    },
    onError: () => {
      console.log("there is an error");
    },
  });

  const handleUpload2 = async () => {
    if (!selectedFile) {
      return;
    }

    setUploading(true);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-y-4 p-4">
        <h2>Upload Video</h2>
        <input type="file" onChange={handleFileChange} />
        {/* <button
        className="bg-blue-500 p-4 rounded-xl text-white font-bold max-w-[200px]"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? "the video is uploading..." : "Upload"}
      </button> */}

        <button
          className="bg-green-500 p-4 rounded-xl text-white font-bold max-w-[400px]"
          onClick={async () => {
            setUploading(true);
            const checksum = await computeSHA256(selectedFile);
            mutation.mutate({
              fileSize: selectedFile.size,
              fileType: selectedFile.type,
              checksum,
            });
          }}
        >
          {uploading ? "uploading..." : "  start uploading using s3"}
        </button>

        {uploadSuccess && <p>File uploaded successfully!</p>}
        {uploadError && <p>{uploadError}</p>}
      </div>
    </div>
  );
};

export default page;
