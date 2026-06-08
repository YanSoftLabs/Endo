import { IntakeWizard } from "@/components/intake/intake-wizard";

export default function CreatePage() {
  return (
    <main className="flex-1 py-12 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Tell us about your business</h1>
        <p className="text-gray-500 mt-2">Complete 4 quick steps to generate your 3D landing page</p>
      </div>
      <IntakeWizard />
    </main>
  );
}
