import { redirect } from 'next/navigation';

export default function AdminRoot() {
  redirect('/mb-hub/companies');
}
