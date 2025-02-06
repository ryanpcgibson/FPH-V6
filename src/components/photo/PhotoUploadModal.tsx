import { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import Tus from "@uppy/tus";
import { supabaseStorageURL } from "@/db/supabaseClient";
import { useAuthData } from "@/hooks/useAuthData";
import type { UploadResult, UppyFile } from "@uppy/core";
import { useFamilyDataContext } from "@/context/FamilyDataContext";
// Import Uppy CSS
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  momentId: number;
  onUploadComplete?: (
    files: UppyFile<Record<string, unknown>, Record<string, never>>[]
  ) => void;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  momentId,
  onUploadComplete,
}) => {
  const { session } = useAuthData();
  const [uppy] = useState(() => new Uppy());
  const STORAGE_BUCKET = "photos";
  const { selectedFamilyId } = useFamilyDataContext();
  const storagePath = `${selectedFamilyId}/${momentId}`;

  useEffect(() => {
    if (!session?.access_token) return;

    const tusPlugin = uppy.getPlugin("Tus");
    if (tusPlugin) {
      uppy.removePlugin(tusPlugin);
    }

    uppy.use(Tus, {
      endpoint: `${supabaseStorageURL}/object/${STORAGE_BUCKET}`,
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
      const objectName = `${storagePath}/${randomFilename}`;

      const supabaseMetadata = {
        bucketName: STORAGE_BUCKET,
        objectName,
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
          onClose();
        }
      }
    );

    return () => {
      uppy.off("file-added", handleFileAdded);
    };
  }, [session, uppy, STORAGE_BUCKET, storagePath, onUploadComplete, onClose]);

  return (
    <DashboardModal
      uppy={uppy}
      open={isOpen}
      onRequestClose={onClose}
      proudlyDisplayPoweredByUppy={false}
    />
  );
};

const generateRandomFilename = (originalName: string) => {
  const extension = originalName.split(".").pop();
  const randomString = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
  return `${randomString}.${extension}`;
};

export default PhotoUploadModal;
