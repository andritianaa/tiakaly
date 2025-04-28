// import {
//   DribbbleIcon,
//   GithubIcon,
//   TwitchIcon,
//   TwitterIcon,
// } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Produit",
    links: [
      {
        title: "Vue d'ensemble",
        href: "#",
      },
      {
        title: "Fonctionnalités",
        href: "#",
      },
      {
        title: "Solutions",
        href: "#",
      },
      {
        title: "Tarification",
        href: "#",
      },
      {
        title: "Nouveautés",
        href: "#",
      },
    ],
  },
  {
    title: "Tiakaly",
    links: [
      {
        title: "À propos",
        href: "#",
      },
      {
        title: "Histoire",
        href: "#",
      },
      {
        title: "Nouvelles",
        href: "#",
      },
      {
        title: "Contacts",
        href: "#",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "Blog",
        href: "#",
      },
      {
        title: "Newsletter",
        href: "#",
      },
      {
        title: "Événements",
        href: "#",
      },
      {
        title: "Aide",
        href: "#",
      },
      {
        title: "Support",
        href: "#",
      },
    ],
  },
  {
    title: "Social",
    links: [
      {
        title: "Facebook",
        href: "#",
      },
      {
        title: "Instagram",
        href: "#",
      },
      {
        title: "Tiktok",
        href: "#",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        title: "Termes",
        href: "#",
      },
      {
        title: "Confidentialité",
        href: "#",
      },
      {
        title: "Contact",
        href: "#",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="mt-12 xs:mt-20 dark bg-background border-t">
      <div className="max-w-screen-xl mx-auto py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6">
        <div className="col-span-full xl:col-span-2">
          <Logo withName />

          <p className="mt-4 text-muted-foreground">
            Les meilleurs plans bouffe de Madagascar
          </p>
        </div>

        {/* {footerSections.map(({ title, links }) => (
          <div key={title} className="xl:justify-self-end">
            <h6 className="font-semibold text-foreground">{title}</h6>
            <ul className="mt-6 space-y-4">
              {links.map(({ title, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))} */}
      </div>
      <Separator />
      <div className="max-w-screen-xl mx-auto py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6">
        {/* Copyright */}
        <span className="text-muted-foreground text-center xs:text-start">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="https://shadcnui-blocks.com" target="_blank">
            Tiakaly
          </Link>
          . Tous droits réservés.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
