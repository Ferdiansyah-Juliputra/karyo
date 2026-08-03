"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password doesn't match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      alert("Account created!");

      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message ?? "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <p className="text-gray-500">
          Create your Karyo account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <div>
          <label>Name</label>

          <input
            required
            className="mt-2 h-12 w-full rounded-xl border px-4"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            required
            className="mt-2 h-12 w-full rounded-xl border px-4"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            required
            className="mt-2 h-12 w-full rounded-xl border px-4"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Confirm Password</label>

          <input
            type="password"
            required
            className="mt-2 h-12 w-full rounded-xl border px-4"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <button
          disabled={loading}
          className="h-12 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/"
          className="font-medium text-emerald-600"
        >
          Sign In
        </Link>
      </p>

    </div>
  );
}