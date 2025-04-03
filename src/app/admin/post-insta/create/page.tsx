import { CreatePostInstaForm } from '@/components/post-insta/create-post-insta-form';

export default function CreatePostInstaPage() {
  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-8">Ajouter un post instagram</h1>
      <div className="max-w-2xl">
        <CreatePostInstaForm />
      </div>
    </div>
  );
}
