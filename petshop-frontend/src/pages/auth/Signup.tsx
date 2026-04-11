import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeClosed, ArrowRight } from "lucide-react";
import Logo from "../../assets/logo.png";
import axios from "axios";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Full name is required" })
      .min(3, { message: "Full name must be at least 3 characters" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    verificationCode: z
      .string()
      .min(1, { message: "Verification code is required" })
      .length(6, { message: "Verification code must be 6 digits" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

function SignupPage() {
  const { signupWithVerification } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSendVerificationCode = async (data: EmailFormData) => {
    try {
      setErrorMessage("");
      setIsCodeSending(true);

      await axios.post("http://localhost:3000/api/auth/send-verification", {
        email: data.email,
      });

      setEmail(data.email);
      setVerificationSent(true);
      setStep(2);

      signupForm.setValue("email", data.email);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to send verification code. Please try again.");
      }
    } finally {
      setIsCodeSending(false);
    }
  };

  const handleCompleteSignup = async (data: SignupFormData) => {
    try {
      setErrorMessage("");

      await signupWithVerification(
        data.fullName,
        data.email,
        data.password,
        data.verificationCode
      );

      navigate("/login", {
        state: { message: "Registration successful! You can now log in." },
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    }
  };

  const handleResendCode = async () => {
    try {
      setErrorMessage("");
      setIsCodeSending(true);

      await axios.post("http://localhost:3000/api/auth/send-verification", {
        email: email,
      });

      setVerificationSent(true);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Failed to resend verification code. Please try again."
        );
      }
    } finally {
      setIsCodeSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={Logo} alt="Pets & Vets Logo" className="h-10 w-auto" />
          </div>
          <div>
            <span className="text-gray-600 mr-2">Already have an account?</span>
            <a
              href="/login"
              className="py-2 px-4 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-150 font-medium"
            >
              Log In
            </a>
          </div>
        </div>
      </header>

      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full lg:w-1/2 max-w-2xl mb-8 lg:mb-0">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
            {step === 1 && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800">
                    Create Your Account
                  </h1>
                  <p className="text-gray-600 mt-2">
                    First, let's verify your email address
                  </p>
                </div>

                <form
                  onSubmit={emailForm.handleSubmit(handleSendVerificationCode)}
                  className="space-y-6"
                >
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <Controller
                      name="email"
                      control={emailForm.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          id="email"
                          autoCapitalize="off"
                          autoComplete="email"
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      )}
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCodeSending}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 font-medium flex items-center justify-center"
                  >
                    {isCodeSending ? (
                      "Sending..."
                    ) : (
                      <>
                        Continue <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-800">
                    Complete Your Registration
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Enter the verification code sent to {email}
                  </p>
                </div>

                <form
                  onSubmit={signupForm.handleSubmit(handleCompleteSignup)}
                  className="space-y-6"
                >
                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="verificationCode"
                    >
                      Verification Code
                    </label>
                    <Controller
                      name="verificationCode"
                      control={signupForm.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          id="verificationCode"
                          placeholder="6-digit code"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      )}
                    />
                    {signupForm.formState.errors.verificationCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.verificationCode.message}
                      </p>
                    )}
                    <div className="mt-1 text-sm text-gray-500 flex justify-between">
                      <span>Check your inbox for the code</span>
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={isCodeSending}
                      >
                        {isCodeSending ? "Sending..." : "Resend code"}
                      </button>
                    </div>
                  </div>

                  <Controller
                    name="email"
                    control={signupForm.control}
                    render={({ field }) => <input type="hidden" {...field} />}
                  />

                  <div>
                    <label
                      className="block text-gray-700 font-medium mb-2"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <Controller
                      name="fullName"
                      control={signupForm.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          id="fullName"
                          placeholder="John Smith"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      )}
                    />
                    {signupForm.formState.errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Controller
                          name="password"
                          control={signupForm.control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              id="password"
                              autoComplete="new-password"
                              placeholder="••••••••"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeClosed size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {signupForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 font-medium mb-2"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Controller
                          name="confirmPassword"
                          control={signupForm.control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              placeholder="••••••••"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                          )}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                          {showConfirmPassword ? (
                            <EyeClosed size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="sm:w-1/3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-150 font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="sm:w-2/3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 font-medium"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 lg:pl-16 flex items-center justify-center">
          <div className="max-w-md text-center lg:text-left">
            <img
              src="https://cdn.britannica.com/37/91837-050-2CC301F9/Children-pet-dog.jpg"
              alt="Pets and veterinarians"
              className="w-full h-auto rounded-lg shadow-lg mb-8"
            />
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Join Our Pet Care Community
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">
                    Connect with Veterinarians
                  </h3>
                  <p className="text-gray-600">
                    Access professional advice and schedule appointments online
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 2.7a1 1 0 00.9 1.5H19m-9 0a1 1 0 11-2 0m10 0a1 1 0 11-2 0"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">
                    Buy Pet Supplies
                  </h3>
                  <p className="text-gray-600">
                    Find toys, food, and everything your furry friend needs
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2a4 4 0 018 0v2m-4 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">
                    Manage Pet Medications
                  </h3>
                  <p className="text-gray-600">
                    Keep track of prescriptions and dosage reminders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
