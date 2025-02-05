import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { supabaseClient, supabaseStorageURL } from "@/db/supabaseClient";
import { useAuthData } from "@/hooks/useAuthData";

// Import Uppy CSS
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const UploadTest = () => {
  const { session } = useAuthData();
  const [uppy] = useState(() => new Uppy());

  useEffect(() => {
    if (!session?.access_token) return;

    const tusPlugin = uppy.getPlugin("Tus");
    if (tusPlugin) {
      uppy.removePlugin(tusPlugin);
    }

    uppy.use(Tus, {
      endpoint: supabaseStorageURL,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_APP_SUPABASE_ANON_KEY,
      },
      uploadDataDuringCreation: true,
      chunkSize: 6 * 1024 * 1024,
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],
      onError: function (error) {
        console.log("Failed because: " + error);
      },
    });

    const STORAGE_BUCKET = "photos";
    const folder = "";

    uppy.on("file-added", (file) => {
      const supabaseMetadata = {
        bucketName: STORAGE_BUCKET,
        objectName: folder ? `${folder}/${file.name}` : file.name,
        contentType: file.type,
      };

      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };

      console.log("file added", file);
    });

    uppy.on("complete", (result) => {
      console.log(
        "Upload complete! We've uploaded these files:",
        result.successful
      );
    });
  }, [session, uppy]);

  if (!session) {
    return <div>Please log in to upload files</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-primary to-secondary p-4">
      <img
        src="/supabase-logo-wordmark--dark.png"
        alt="Supabase Logo"
        className="max-w-[150px] mb-10"
      />
      <div className="w-full max-w-2xl">
        <Dashboard uppy={uppy} />
      </div>
      <a
        href="https://supabase.com/docs/guides/storage/uploads/resumable-uploads"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-foreground hover:underline"
      >
        Read the docs.
      </a>
    </div>
  );
};

export default UploadTest;
