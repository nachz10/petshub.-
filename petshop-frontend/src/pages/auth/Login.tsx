import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError("password", {
        type: "custom",
        message: "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <div className="mb-6">
              <img src={Logo} alt="Pets & Vets Logo" className="h-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Log in to access your account</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            autoCapitalize="off"
            autoComplete="off"
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
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    id="email"
                    autoCapitalize="none"
                    autoComplete="new-email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label
                  className="block text-gray-700 font-medium"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoCapitalize="none"
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
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 font-medium"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-blue-50">
        <div className="h-full w-full relative overflow-hidden">
          <img
            src="https://cdn.britannica.com/37/91837-050-2CC301F9/Children-pet-dog.jpg"
            alt="Happy pets with their owners"
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex flex-col justify-end p-8">
            <div className="text-white mb-8 max-w-md">
              <h2 className="text-2xl font-bold mb-2">
                Quality care for your furry family members
              </h2>
              <p className="text-blue-50">
                Connect with top veterinarians and pet care experts all in one
                place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
