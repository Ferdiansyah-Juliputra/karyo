import DashboardLayout from "@/components/dashboard/dashboard-layout";
import UploadCard from "@/components/dashboard/upload-card";
import RequirementInput from "@/components/dashboard/requirement-input";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Resume Review
          </h1>

          <p className="text-gray-500">
            Upload your resume and paste the job description to begin.
          </p>
        </div>

        <UploadCard />

        <RequirementInput />

      </div>
    </DashboardLayout>
  );
}