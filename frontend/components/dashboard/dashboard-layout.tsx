import { ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <main className="flex min-h-screen bg-slate-50">

      <aside className="w-64 border-r bg-white p-6">

        <h2 className="text-2xl font-bold text-emerald-600">
          Karyo
        </h2>

        <nav className="mt-10 space-y-2">

          <Link
            href="/dashboard"
            className="block rounded-xl bg-emerald-50 px-4 py-3"
          >
            Dashboard
          </Link>

          <Link
            href="/history"
            className="block rounded-xl px-4 py-3 hover:bg-gray-100"
          >
            History
          </Link>

          <Link
            href="/profile"
            className="block rounded-xl px-4 py-3 hover:bg-gray-100"
          >
            Profile
          </Link>

        </nav>

      </aside>

      <section className="flex-1 p-10">
        {children}
      </section>

    </main>
  );
}