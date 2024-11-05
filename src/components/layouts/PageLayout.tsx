import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PageLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
  centerContent?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  isLoading,
  error,
  className = "",
  centerContent = true,
}) => {
  const baseClassName = "min-h-screen";
  const contentClassName = centerContent
    ? "flex justify-center items-center"
    : "";
  const combinedClassName =
    `${baseClassName} ${contentClassName} ${className}`.trim();

  if (isLoading) {
    return <div className={combinedClassName}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={combinedClassName}>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  //   return <div className={combinedClassName}>{children}</div>;
  return <>{children}</>;
};

export default PageLayout;
