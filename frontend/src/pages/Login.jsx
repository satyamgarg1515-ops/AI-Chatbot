import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const navigate = useNavigate();

  const validEmailDomains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];

  useEffect(() => {
    if (!email.includes("@")) {
      setIsValidEmail(true);
      return;
    }
    const domain = email.split("@")[1];
    setIsValidEmail(validEmailDomains.includes(domain));
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidEmail) {
      toast.error("Please use a valid email domain.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      toast.success("Login successful!");
      setTimeout(() => navigate("/chat"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] text-gray-100 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Aurora background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.15),transparent_70%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.15),transparent_70%)] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email (e.g., user@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                isValidEmail
                  ? "border-white/20 focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_#6366f180]"
                  : "border-red-400 focus:ring-2 focus:ring-red-500 focus:shadow-[0_0_15px_#ef444480]"
              } bg-white/10 placeholder-gray-400 text-gray-100 outline-none`}
              required
            />
            {!isValidEmail && (
              <p className="text-red-400 text-xs mt-1">
                ❌ Please use a valid email (gmail/outlook/yahoo).
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_#6366f180] outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValidEmail}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              !isValidEmail
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white shadow-[0_0_20px_#6366f180]"
            }`}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
