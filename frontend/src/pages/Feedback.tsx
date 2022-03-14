import Topbar from "../components/Topbar";
import { FormTextArea } from "../components/FormTextarea";
import { useState } from "react";
import {FEEDBACK_ENDPOINT, getAuthToken} from "../utils/endpoints";
import { LoadingButton } from "../components/LoadingButton";

export default function Feedback() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState<string | undefined>();

  const sendFeedbackRequest = async () => {
    setIsLoading(true);
    setFeedbackError(undefined);

    const res = await fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Token ${getAuthToken()}`,
        // TODO(Arpad): ^ This doesn't actually seem to fix the auth error.
        // If I don't set the ViewSet to AllowAll permissions, this fails no matter what.
      },
      body: JSON.stringify({
        feedback: feedback,
        date: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      alert("Feedback Submitted");
    } else {
      const body = await res.json();
      setFeedbackError(
        body.feedback?.join(" ") ??
          body.error ??
          "An error occurred when submitting your website feedback. Please try again."
      );
    }

    setIsLoading(false);
  };

  return (
    <>
      <Topbar />
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Feedback
            </h2>
          </div>

          <form
            className="mt-8 space-y-3"
            action="#"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              sendFeedbackRequest();
            }}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <FormTextArea
                  id="feedback"
                  name="Website Feedback"
                  autoComplete="false"
                  placeholder="Enter any feedback you have about the website and the mentoring system"
                  text={feedback}
                  onChange={setFeedback}
                  error={feedbackError}
                />
              </div>

              <div>
                <LoadingButton
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  isLoading={isLoading}
                >
                  Submit Feedback
                </LoadingButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
