import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Lengkapi semua kolom.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      console.log("Attempting to sign up with:", { email, fullName });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        console.error("Supabase signup error:", error);
        setError(error.message || "Gagal mendaftar. Silakan coba lagi.");
      } else {
        console.log("Signup successful:", data);
        setError("Pendaftaran berhasil! Silakan periksa email untuk konfirmasi sebelum login.");
        navigate("/Login");
      }
    } catch (e) {
      console.error("Register exception:", e);
      setError(e.message || "Terjadi kesalahan jaringan. Periksa koneksi internet dan konfigurasi Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f0ff] px-4 py-10">
      <div className="w-full max-w-2xl bg-[#f7f4ff] rounded-[32px] shadow-xl p-12 border border-white/70">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
          <span
  className="material-symbols-outlined text-violet-600 ml-2"
  style={{
    fontSize: "50px",
    fontVariationSettings: "'wght'  100",
  }}
>
  person_add
</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-zinc-900">
            Create your account
          </h1>

          <p className="text-zinc-500 mt-3 text-lg">
            Join us and explore more
          </p>
        </div>

        {/* Full Name */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-zinc-800">
            Full Name
          </label>

          <div className="flex items-center border border-zinc-200 rounded-xl px-4 h-14 bg-white">
            <span className="material-symbols-outlined">person_add</span>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-full px-3 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-zinc-800">
            Email
          </label>

          <div className="flex items-center border border-zinc-200 rounded-xl px-4 h-14 bg-white">
            <span className="material-symbols-outlined text-zinc-400">
              mail
            </span>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full px-3 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-zinc-800">
            Password
          </label>

          <div className="flex items-center border border-zinc-200 rounded-xl px-4 h-14 bg-white">
            <span className="material-symbols-outlined text-zinc-400">
              lock
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-full px-3 outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-zinc-400">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="block mb-2 font-medium text-zinc-800">
            Confirm Password
          </label>

          <div className="flex items-center border border-zinc-200 rounded-xl px-4 h-14 bg-white">
            <span className="material-symbols-outlined text-zinc-400">
              lock
            </span>

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-full px-3 outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              <span className="material-symbols-outlined text-zinc-400">
                {showConfirm ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 text-zinc-600 mb-8">
          <input type="checkbox" className="accent-violet-600 mt-1" />

          <span>
            I agree to the{" "}
            <span className="text-violet-600 font-medium cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-violet-600 font-medium cursor-pointer">
              Privacy Policy
            </span>
          </span>
        </label>

        {/* Register Button */}
        <button onClick={handleRegister} disabled={loading} className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold text-lg shadow-lg hover:opacity-90 transition disabled:opacity-60">
          {loading ? "Mendaftarkan..." : "Register"}
        </button>
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      <div className="flex item-center mx-auto justify-center mt-3">
      <p className=""> already have an account?</p>
      <a href="/Login" className="text-violet-700 font-semibold ml-1 cursor-pointer hover:underline">Login</a>
      </div>
      </div>
    </div>
  );
}