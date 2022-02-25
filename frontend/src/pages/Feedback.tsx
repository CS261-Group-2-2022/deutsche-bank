import Topbar from "../components/Topbar";
import { FormInput } from "../components/FormInput";
import { FormTextArea } from "../components/FormTextarea";
import { useState } from "react";
import { FEEDBACK_ENDPOINT, RegisterBody, RegisterSuccess, setAuthToken, SETTINGS_ENDPOINT, SIGNUP_ENDPOINT } from "../utils/endpoints";
import { useUser } from "../utils/authentication";

export default function Feedback() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPasssword, setRetypedPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  // const [businessArea, setBusinessArea] = useState("");

  const [firstNameError, setFirstNameError] = useState<string | undefined>();
  const [lastNameError, setLastNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [retypedPasswordError, setRetypedPasswordError] = useState<
    string | undefined
  >();
  const [feedbackError, setFeedbackError] = useState<string | undefined>();
  // const [businessAreaError, setBusinessAreaError] = useState<
  //   string | undefined
  // >();

  const { user } = useUser();

  const clearErrors = () => {
    setFeedbackError(undefined)
  };

  const sendFeedbackRequest = async () => {
    // Check password and retyped password are equivalent

    const res = await fetch(FEEDBACK_ENDPOINT, { // TODO feedback endpoint
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        feedback: feedback,
        date: new Date().toISOString()
    })});

    clearErrors();
    if (res.ok) {
        alert("Feedback Submitted");
    };
    
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

          <form className="mt-8 space-y-3" action="#" method="POST" onSubmit={(e) => {
            console.log("Submiting feedback...")
              e.preventDefault();
              sendFeedbackRequest();
            }}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-3">
              <div className="grid grid-cols-1 gap-3">
            <FormTextArea
                id="feedback"
                name="Website Feedback"
                autoComplete="false"
                placeholder="Enter feedback for the website"
                text={feedback}
                onChange={setFeedback}
                error={feedbackError}
            />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Feedback
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
