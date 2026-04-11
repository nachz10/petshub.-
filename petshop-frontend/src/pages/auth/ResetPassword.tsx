import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../assets/logo.png";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: data.password,
          }),
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Password reset error:", error);
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

        {isSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Password Reset Successful!
            </h2>
            <p className="mb-6">
              Your password has been successfully reset. You will be redirected
              to the login page shortly.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Reset Password
            </h2>
            <p className="mb-6 text-gray-600 text-center">
              Enter your new password below.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  New Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      id="password"
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset Password
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

export default ResetPassword;
