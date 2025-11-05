"use client";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<{ email: string; newPassword: string }>();

  const onSubmit = async (data: { email: string; newPassword: string }) => {
    try {
      const res = await axios.post("/auth/change-password", data);
      alert(res.data.message || "Password changed successfully!");
      router.push("/auth/login");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Something went wrong!");
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
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Change Password
        </h2>

        <input
          placeholder="Email"
          {...register("email")}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-pink-400 outline-none placeholder-gray-400"
        />
        <input
          placeholder="New Password"
          type="password"
          {...register("newPassword")}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-pink-400 outline-none placeholder-gray-400"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold shadow-lg hover:shadow-pink-500/30 transition-all"
        >
          Change Password
        </motion.button>
      </motion.form>
    </div>
  );
}
