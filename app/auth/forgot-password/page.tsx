"use client";
import { useForm } from "react-hook-form";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      const res = await axios.post("/auth/forget-password", data);
      alert(res.data.message || "OTP sent to email");
      router.push("/auth/verify-otp");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5 border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-300 text-center">
          Enter your email to receive an OTP 📩
        </p>

        <input
          placeholder="Email"
          {...register("email")}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 outline-none placeholder-gray-400"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all"
        >
          Send OTP
        </motion.button>
      </motion.form>
    </div>
  );
}
