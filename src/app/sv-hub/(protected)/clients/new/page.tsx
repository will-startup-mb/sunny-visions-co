import { ClientForm } from '../../ClientForm';

export default function NewClientPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-extrabold mb-6" style={{ color: '#3D2B1F' }}>Add Client</h1>
      <ClientForm />
    </div>
  );
}
