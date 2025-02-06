import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabaseStorageURL } from "@/db/supabaseClient";
import { useAuthData } from "@/hooks/useAuthData";
import type { UploadResult, UppyFile } from "@uppy/core";

// Import Uppy CSS
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

interface UploadFormProps {
  bucket: string;
  folder?: string;
  onUploadComplete?: (
    files: UppyFile<Record<string, unknown>, Record<string, never>>[]
  ) => void;
}

// TODO: Handle collisions
const generateRandomFilename = (originalName: string) => {
  const extension = originalName.split(".").pop();
  const randomString = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
  return `${randomString}.${extension}`;
};

const PhotoUploadPage = ({
  folder = "",
  onUploadComplete,
}: UploadFormProps) => {
  const { session } = useAuthData();
  const [uppy] = useState(() => new Uppy());
  const STORAGE_BUCKET = "photos";

  useEffect(() => {
    if (!session?.access_token) return;

    // Clean up any existing plugins and event listeners
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

    const handleFileAdded = (file: any) => {
      if (!file.name) throw new Error("File must have a name");
      const randomFilename = generateRandomFilename(file.name);
      console.log(file.name, " -> ", STORAGE_BUCKET, randomFilename);
      const supabaseMetadata = {
        bucketName: STORAGE_BUCKET,
        objectName: folder ? `${folder}/${randomFilename}` : randomFilename,
        contentType: file.type,
      };

      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };
    };

    uppy.on("file-added", handleFileAdded);

    uppy.on(
      "complete",
      (
        result: UploadResult<Record<string, unknown>, Record<string, never>>
      ) => {
        if (onUploadComplete && result.successful) {
          onUploadComplete(result.successful);
        }
      }
    );

    return () => {
      uppy.off("file-added", handleFileAdded);
    };
  }, [session, uppy, STORAGE_BUCKET, folder, onUploadComplete]);

  return (
    <div className="mt-2" id="moment-form-page">
      <Card>
        <CardContent className="">
          <Dashboard uppy={uppy} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoUploadPage;
