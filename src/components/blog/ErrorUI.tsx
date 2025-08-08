import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorUIProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
  retryLabel?: string;
  backLabel?: string;
  isRetrying?: boolean;
  className?: string;
}

const ErrorUI: React.FC<ErrorUIProps> = ({
  title = "Something went wrong",
  message,
  onRetry,
  onBack,
  retryLabel = "Try Again",
  backLabel = "Go Back",
  isRetrying = false,
  className = "",
}) => {
  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${className}`}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>

          {/* Error Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {retryLabel}
                  </>
                )}
              </Button>
            )}

            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full"
                disabled={isRetrying}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backLabel}
              </Button>
            )}
          </div>

          {/* Additional Help Text */}
          <p className="text-sm text-gray-500 mt-4">
            If the problem persists, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorUI;
