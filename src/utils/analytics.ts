type EventNames =
  | "PageView"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Lead"
  | "Purchase"
  | "SubmitApplication"
  | "StartTrial"
  | "Subscribe"
  | string;

interface AnalyticsEvent {
  eventName: EventNames;
  params?: Record<string, any>;
}

export const trackEvent = ({ eventName, params }: AnalyticsEvent) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq("track", eventName, params);
    } catch (error) {
      console.error("Error tracking event:", error);

      // You might want to send this to your error tracking service
      if (process.env.NODE_ENV === "development") {
        console.warn("Facebook Pixel tracking error:", {
          eventName,
          params,
          error,
        });
      }
    }
  }
};

// Predefined event helpers
export const trackPageView = () => trackEvent({ eventName: "PageView" });

export const trackSurveySubmission = (surveyId: string) =>
  trackEvent({
    eventName: "SurveySubmit",
    params: {
      survey_id: surveyId,
      content_type: "survey",
    },
  });

export const trackSurveyCreation = (surveyId: string) =>
  trackEvent({
    eventName: "SurveyCreate",
    params: {
      survey_id: surveyId,
      content_type: "survey",
    },
  });
