"use client";
import {
  BookCheck,
  ChartPie,
  FolderSync,
  Goal,
  MapPin,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetcher } from "@/lib/utils";
import { PlaceSummary } from "@/types/place";

const features = [
  {
    icon: Goal,
    title: "Identify Opportunities",
    description:
      "Easily uncover untapped areas to explore and expand your reach effortlessly.",
  },
  {
    icon: BookCheck,
    title: "Build Authority",
    description:
      "Create valuable content that resonates, inspires trust, and positions you as an expert.",
  },
  {
    icon: ChartPie,
    title: "Instant Insights",
    description:
      "Gain immediate, actionable insights with a quick glance, enabling fast decision-making.",
  },
  {
    icon: Users,
    title: "Engage with Your Audience",
    description:
      "Boost audience engagement with interactive features like polls, quizzes, and forms.",
  },
  {
    icon: FolderSync,
    title: "Automate Your Workflow",
    description:
      "Streamline your processes by automating repetitive tasks, saving time and reducing effort.",
  },
  {
    icon: Zap,
    title: "Accelerate Growth",
    description:
      "Supercharge your growth by implementing strategies that drive results quickly and efficiently.",
  },
];

const Features = () => {
  const { data } = useSWR<PlaceSummary[]>("/api/places/recent", fetcher);
  if (data) {
    return (
      <div
        id="features"
        className="max-w-screen-xl mx-auto w-full py-12 xs:py-20 px-6"
      >
        <h2 className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl sm:text-center sm:mx-auto">
          Les plans du moments
        </h2>
        <div className="mt-8 xs:mt-14 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {data.map((place) => (
            <Link href={`/place/${place.id}`} key={place.title}>
              <Card className="flex flex-col border rounded-xl overflow-hidden shadow-none transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1">
                <CardHeader>
                  <h4 className="!mt-3 text-xl font-bold tracking-tight">
                    {place.title}
                  </h4>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="size-4 mr-1" />
                    <span>{place.localisation}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm xs:text-[17px]">
                    {place.bio} {place.bio}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto px-0 pb-0">
                  <div className="bg-muted h-52 ml-6 rounded-tl-xl overflow-hidden">
                    <Image
                      src={place.mainMedia!.url}
                      width={500}
                      height={500}
                      alt=""
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div
        id="features"
        className="max-w-screen-xl mx-auto w-full py-12 xs:py-20 px-6"
      >
        <h2 className="text-3xl xs:text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl sm:text-center sm:mx-auto">
          Les plans du moments
        </h2>
        <div className="mt-8 xs:mt-14 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          <div className="flex flex-col border rounded-xl overflow-hidden shadow-none transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 h-[370px] bg-muted" />
          <div className="flex flex-col border rounded-xl overflow-hidden shadow-none transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 h-[370px] bg-muted" />
          <div className="flex flex-col border rounded-xl overflow-hidden shadow-none transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 h-[370px] bg-muted" />
          <div className="flex flex-col border rounded-xl overflow-hidden shadow-none transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 h-[370px] bg-muted" />
          <div className="flex flex-col border rounded-xl overflow-hidden shadow-none transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 h-[370px] bg-muted" />
          <div className="flex flex-col border rounded-xl overflow-hidden shadow-none transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 h-[370px] bg-muted" />
        </div>
      </div>
    );
  }
};

export default Features;
