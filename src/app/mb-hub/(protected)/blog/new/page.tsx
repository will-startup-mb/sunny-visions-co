import { PostEditor } from '../PostEditor';

export default function NewPostPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-extrabold mb-6" style={{ color: '#1B3A52' }}>New Post</h1>
      <PostEditor />
    </div>
  );
}
