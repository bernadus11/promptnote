import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Attempting to sign in with email:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Supabase login error:", error);
        const message =
          error.message === "Email not confirmed"
            ? "Email belum dikonfirmasi. Silakan cek kotak masuk dan klik link verifikasi sebelum login."
            : error.message || "Email atau password salah.";
        setError(message);
      } else {
        console.log("Login successful");
        setError("");
        navigate("/Fituroption");
      }
    } catch (e) {
      console.error("Login exception:", e);
      setError(e.message || "Terjadi kesalahan jaringan. Periksa koneksi internet dan konfigurasi Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2ff] px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-[30px] shadow-xl p-10">

        {/* Title */}
        <div className="justify-between flex items-center">
          <div>
          <h1 className="text-3xl font-semibold text-zinc-900">
            Welcome back 👋
          </h1>
          <p className="text-zinc-400 text-semibold mt-3 text-sm">
            Login to continue your journey
          </p>
          </div>
        <img src="/assets/password.png" alt="image-login" className="w-64" />
        </div>
        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Email
          </label>

          <div className="flex items-center border border-zinc-200 rounded-xl px-4 h-14">
            <span className="material-symbols-outlined text-zinc-400">
              mail
            </span>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full px-3 outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Password
          </label>

          <div className="flex items-center border border-zinc-200 rounded-xl px-4 h-14">
            <span className="material-symbols-outlined text-zinc-400">
              lock
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-full px-3 outline-none"
            />

            <button
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              <span className="material-symbols-outlined text-zinc-400">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center justify-between mb-8">
          <label className="flex items-center gap-2 text-zinc-600">
            <input type="checkbox" />
            Remember me
          </label>

          <button className="text-violet-600">
            Forgot password?
          </button>
        </div>

        {/* Button */}
        <button onClick={handleLogin} disabled={loading} className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold disabled:opacity-60">
          {loading ? "Memproses..." : "Login"}
        </button>
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        <div className="flex items-center gap-4 mt-2">
</div>
{/* Register */}
<p className="text-center text-zinc-500 text-sm mt-4">
  Belum punya akun?{" "}
  <a href="/Register" className="text-violet-600 font-semibold hover:underline">Daftar</a>
  {" · "}
  <a href="/" className="text-zinc-400 hover:text-zinc-600 hover:underline">Home</a>
</p>
      </div>
    </div>
  );
}