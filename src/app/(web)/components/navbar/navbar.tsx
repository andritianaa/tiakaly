import { House, Map, Medal, Newspaper, Search } from "lucide-react";
import Link from "next/link";

import { UserMenu } from "@/app/(web)/components/navbar/user-menu";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/current-user";

import { NavMenu } from "./nav-menu";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <>
      <header className="fixed top-0 w-full z-40">
        <nav
          className="h-16 bg-background border-b border-accent"
          aria-label="Navigation principale"
        >
          <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex-1">
              <Link href="/" aria-label="Accueil Tiakaly">
                <Logo withName />
              </Link>
            </div>

            <NavMenu className="hidden md:block flex-1" />

            <div className="flex justify-end flex-1 items-center gap-3">
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      aria-label="Se connecter à votre compte"
                    >
                      <Button
                        variant="outline"
                        className="hidden sm:inline-flex hover-lift transition-all"
                      >
                        Connexion
                      </Button>
                    </Link>

                    <Link
                      href="/auth/register"
                      aria-label="Créer un nouveau compte"
                    >
                      <Button className="xs:inline-flex hover-lift transition-all">{`Let's go`}</Button>
                    </Link>
                  </>
                )}
              </>
            </div>
          </div>
        </nav>
      </header>

      <nav
        className="fixed bottom-0 w-full md:hidden h-14 border-t grid grid-cols-5 bg-white z-50 p-2"
        aria-label="Navigation mobile"
      >
        <Link
          href={"/"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md"
          aria-label="Accueil"
          title="Accueil"
        >
          <House size={28} aria-hidden="true" />
          <span className="sr-only">Accueil</span>
        </Link>
        <Link
          href={"/places"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md"
          aria-label="Rechercher des lieux"
          title="Rechercher"
        >
          <Search size={28} aria-hidden="true" />
          <span className="sr-only">Rechercher</span>
        </Link>
        <Link
          href={"/map"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md"
          aria-label="Voir la carte"
          title="Carte"
        >
          <Map size={28} aria-hidden="true" />
          <span className="sr-only">Carte</span>
        </Link>
        <Link
          href={"/tops"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md"
          aria-label="Voir les meilleurs endroits"
          title="Top destinations"
        >
          <Medal size={28} aria-hidden="true" />
          <span className="sr-only">Top destinations</span>
        </Link>
        <Link
          href={"/post-instas"}
          className="w-full flex items-center justify-center hover:bg-muted rounded-md"
          aria-label="Actualités et posts Instagram"
          title="Actualités"
        >
          <Newspaper size={28} aria-hidden="true" />
          <span className="sr-only">Actualités</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
