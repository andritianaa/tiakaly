import { redirect } from 'next/navigation';

import { Navbar } from '@/app/(web)/components/navbar';
import { currentUser } from '@/lib/current-user';

export default async function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) return redirect("/auth/login");
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
