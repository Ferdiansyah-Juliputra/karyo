import HomeLayout from "@/components/home/home-layout";
import UploadCard from "@/components/home/upload-card";
import RequirementInput from "@/components/home/requirement-input";

export default function HomePage() {
  return (
    <HomeLayout>
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
    </HomeLayout>
  );
}