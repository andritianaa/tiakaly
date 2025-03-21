import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="h-fit py-32 w-full flex items-center justify-center overflow-hidden border-b border-accent">
      <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <div className="max-w-xl">
          <Badge className="rounded-full py-1 border-none">
            Bienvenue les tiakaly
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            Les meilleurs plans bouffe de Madagascar
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
            architecto ipsum harum illum nihil expedita, commodi dignissimos
            dolorum eveniet beatae.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Link href={"/auth/register"}>
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full text-base"
              >
                Allons-y! <ArrowUpRight className="!h-5 !w-5" />
              </Button>
            </Link>
            <Link href={"/auth/register"}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full text-base shadow-none"
              >
                Inscription
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative lg:max-w-lg xl:max-w-xl w-full bg-accent rounded-xl aspect-square">
          <Image
            src="/placeholder.svg"
            fill
            alt=""
            className="object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
