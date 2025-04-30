"use client";
import { House, Map, Medal, Newspaper, Search } from 'lucide-react';
import Link from 'next/link';

import { UserMenu } from '@/app/(web)/components/navbar/user-menu';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/use-user';

import { NavMenu } from './nav-menu';

const Navbar = () => {
  const { user, isLoading } = useUser();

  return (
    <>
      <nav className="h-16 bg-background border-b border-accent fixed top-0 w-full z-40">
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex-1">
            <Logo withName />
          </div>

          <NavMenu className="hidden md:block flex-1" />

          <div className="flex justify-end flex-1 items-center gap-3">
            {/* <ThemeToggle /> */}
            {!isLoading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        className="hidden sm:inline-flex hover-lift transition-all"
                      >
                        Connexion
                      </Button>
                    </Link>

                    <Link href="/auth/register">
                      <Button className="xs:inline-flex hover-lift transition-all">{`Let's go`}</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="fixed bottom-0 w-full md:hidden h-14 border-t grid grid-cols-5 bg-white z-50 p-2">
        <Link
          href={"/"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md "
        >
          <House size={28} />
        </Link>
        <Link
          href={"/places"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md "
        >
          <Search size={28} />
        </Link>
        <Link
          href={"/map"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md "
        >
          <Map size={28} />
        </Link>
        <Link
          href={"/tops"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md "
        >
          <Medal size={28} />
        </Link>
        <Link
          href={"/post-instas"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md "
        >
          <Newspaper size={28} />
        </Link>
      </div>
    </>
  );
};

export default Navbar;
