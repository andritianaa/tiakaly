import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';

import Bounce from '@/components/bounce';
import { Logo } from '@/components/logo';

// Composant TikTok personnalisé (car non disponible dans Lucide)
const TikTok = ({ className }: { className?: string }) => (
  <svg
    fill="#ffffff"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#ffffff"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <title>tiktok</title>{" "}
      <path d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"></path>{" "}
    </g>
  </svg>
);

const Footer = () => {
  return (
    <div className="p-4 w-full flex items-center justify-center container  mx-auto">
      <Bounce className="mt-12 xs:mt-20 bg-gradient-to-r  w-full from-[#47556c] to-[#2e3746] text-white border-t border-slate-400 p-8 rounded-xl shadow-md ">
        <div className="  px-4 max-lg:px-4 max-lg:pb-12 my-4">
          <div className="flex justify-between items-center mb-4">
            <Logo icon />

            <div className="flex gap-4 items-center">
              <Link
                href="https://www.facebook.com/tiakalymg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} className="text-white" />
              </Link>
              <Link
                href="https://www.instagram.com/tiakaly/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-white" />
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-center max-lg:flex-col max-lg:justify-center ">
            <p className=" text-slate-200">
              Les meilleurs plans bouffe de Madagascar
            </p>
            <span className="text-slate-200 text-center xs:text-start">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" className="hover:text-white transition-colors">
                Tiakaly
              </Link>
              . Tous droits réservés.
            </span>
          </div>
        </div>
      </Bounce>
    </div>
  );
};

export default Footer;
