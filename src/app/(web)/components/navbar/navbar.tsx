"use client";
import Link from "next/link";

import { UserMenu } from "@/app/(web)/components/navbar/user-menu";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";

import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="h-16 bg-background border-b border-accent fixed top-0 w-full z-40">
      <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex-1">
          <Logo withName />
        </div>

        <NavMenu className="hidden md:block flex-1" />

        <div className="flex justify-end flex-1 items-center gap-3">
          {/* <ThemeToggle /> */}
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>

              <Link href="/auth/register">
                <Button className="xs:inline-flex">Get Started</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
