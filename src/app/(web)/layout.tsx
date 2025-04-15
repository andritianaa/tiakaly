import Footer from '@/app/(web)/components/footer';
import { Navbar } from '@/app/(web)/components/navbar';

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden">
        <Navbar />
        <div className="fixed inset-0 -z-10 w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-yellow-400 opacity-20 blur-[100px]"></div>
        </div>
        <div className="relative">{children}</div>
      </div>
      <Footer />
    </>
  );
}
