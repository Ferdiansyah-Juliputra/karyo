"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

    const response = await api.post(
      "/auth/login",
      form
    );

      console.log(response.data);

      router.push("/home");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(
          err.response?.data?.message ??
          "Invalid email or password."
        );
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

      <div className="space-y-2">
        <h2 className="text-3xl font-bold">
          Welcome back
        </h2>

        <p className="text-gray-500">
          Sign in to continue using Karyo.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <div>
          <label>Email</label>

          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="mt-2 h-12 w-full rounded-xl border px-4"
          />
        </div>

        <div>

          <label>Password</label>

          <div className="relative mt-2">

            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="h-12 w-full rounded-xl border px-4 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New here?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-600"
        >
          Create an account
        </Link>
      </p>

    </div>
  );
}