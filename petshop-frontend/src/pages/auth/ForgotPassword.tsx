import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error("Password reset request failed:", errorData);
      }
    } catch (error) {
      console.error("Password reset request error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02092d]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="max-w-[150px] max-h-[150px] w-auto h-auto"
          />
        </div>

        {isSubmitted ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="mb-6">
              If an account exists with the email you provided, we've sent
              instructions to reset your password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Forgot Password
            </h2>
            <p className="mb-6 text-gray-600 text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                <a href="/login" className="text-blue-500 hover:underline">
                  Back to Login
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
