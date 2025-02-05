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

const UploadForm = ({
  bucket,
  folder = "",
  onUploadComplete,
}: UploadFormProps) => {
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

    uppy.on("file-added", (file) => {
      const supabaseMetadata = {
        bucketName: bucket,
        objectName: folder ? `${folder}/${file.name}` : file.name,
        contentType: file.type,
      };

      file.meta = {
        ...file.meta,
        ...supabaseMetadata,
      };
    });

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
  }, [session, uppy, bucket, folder, onUploadComplete]);

  return (
    <Card>
      <CardContent className="pt-6">
        <Dashboard uppy={uppy} />
      </CardContent>
    </Card>
  );
};

export default UploadForm;
