import Link from 'next/link';

import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList
} from '@/components/ui/navigation-menu';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';

export const NavMenu = (props: NavigationMenuProps) => (
  <NavigationMenu {...props}>
    <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link className="hover-lift transition-all" href="/">
            Accueil
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link className="hover-lift transition-all" href="/places">
            Endroits
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link className="hover-lift transition-all" href="/map">
            Carte
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link className="hover-lift transition-all" href="/tops">
            Tops
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link className="hover-lift transition-all" href="/post-instas">
            Nouveautés
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);
