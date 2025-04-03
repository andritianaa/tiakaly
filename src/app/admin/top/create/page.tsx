import { CreateTopForm } from "@/components/top/create-top-form";

export default function CreateTopPage() {
  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Create Top List</h1>
      <div className="max-w-3xl">
        <CreateTopForm />
      </div>
    </div>
  );
}
