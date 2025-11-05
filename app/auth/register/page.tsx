"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const schema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  phoneNumber: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post("/auth/register", {
        fullName: data.fullName,
        email: data.email,
        phoneNumber : data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      console.log("✅ Register success:", res.data);
      alert("Account created successfully! You can now login.");
      router.push("/auth/login");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md text-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-5 border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-sm text-gray-300 text-center">
          Fill in your details to get started 🚀
        </p>

        <div className="space-y-3">
          <div>
            <input
              placeholder="Full name"
              {...register("fullName")}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 outline-none placeholder-gray-400"
            />
            {errors.fullName && (
              <p className="text-sm text-red-400 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Email"
              {...register("email")}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 outline-none placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Phone number"
              {...register("phoneNumber")}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 outline-none placeholder-gray-400"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-400 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 outline-none placeholder-gray-400"
            />
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              placeholder="Confirm password"
              type="password"
              {...register("confirmPassword")}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-cyan-400 outline-none placeholder-gray-400"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </motion.button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/auth/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </motion.form>
    </div>
  );
}
