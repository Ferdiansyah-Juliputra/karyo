import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const features = [
  "ATS Analysis",
  "AI Resume Feedback",
  "Resume History",
  "Secure Storage",
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left */}
        <section className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-emerald-600 to-teal-700 px-16 text-white">
          <div className="max-w-md space-y-8">
            <h1 className="text-5xl font-bold">
              Karyo
            </h1>

            <p className="text-lg text-emerald-100">
              AI Resume Reviewer that helps you optimize your CV,
              improve ATS compatibility,
              and increase your chances of getting interviews.
            </p>

            <div className="space-y-4">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right */}
        <section className="flex items-center justify-center p-8">
          {children}
        </section>

      </div>
    </main>
  );
}