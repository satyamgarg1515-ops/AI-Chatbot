import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

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

  useEffect(() => {
    setPasswordChecks({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&#]/.test(password),
    });
  }, [password]);

  const allPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordStrength =
    Object.values(passwordChecks).filter(Boolean).length * 20; // for strength bar

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail) {
      toast.error("Please use a valid email domain.");
      return;
    }

    if (!allPasswordValid) {
      toast.error("Password does not meet all security rules.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/chat"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] text-gray-100 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Elegant animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_70%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.15),transparent_70%)] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-2xl shadow-2xl relative z-10"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_#6366f180] outline-none transition-all"
            required
          />

          {/* Email */}
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

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border transition-all duration-300 ${
                allPasswordValid
                  ? "border-green-400 focus:ring-2 focus:ring-green-400 focus:shadow-[0_0_15px_#22c55e80]"
                  : "border-white/20 focus:ring-2 focus:ring-indigo-500 focus:shadow-[0_0_15px_#6366f180]"
              } bg-white/10 placeholder-gray-400 text-gray-100 outline-none`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {/* Password strength bar */}
            <div className="mt-3 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-1 transition-all duration-300 rounded-full ${
                  passwordStrength < 40
                    ? "bg-red-500 w-1/5"
                    : passwordStrength < 60
                    ? "bg-yellow-400 w-3/5"
                    : "bg-green-400 w-full"
                }`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="mt-2 grid grid-cols-1 gap-1 text-xs">
              {[
                { label: "≥ 8 characters", valid: passwordChecks.length },
                { label: "Uppercase", valid: passwordChecks.upper },
                { label: "Lowercase", valid: passwordChecks.lower },
                { label: "Number", valid: passwordChecks.number },
                { label: "Special symbol", valid: passwordChecks.special },
              ].map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {rule.valid ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-gray-500" />
                  )}
                  <span className={rule.valid ? "text-green-400" : "text-gray-400"}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!allPasswordValid || !isValidEmail}
            className={`w-full py-3 mt-2 rounded-lg font-semibold transition duration-300 ${
              !allPasswordValid || !isValidEmail
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white shadow-[0_0_20px_#6366f180]"
            }`}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
