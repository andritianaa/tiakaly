import { redirect } from 'next/navigation';

import { currentUser } from '@/lib/current-user';

export default async function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (user) {
    return redirect("/");
  }
  return <>{children}</>;
}
