"use client";

import { InstagramEmbed } from "react-social-media-embed";

interface InstagramEmbedWrapperProps {
  url: string;
  className?: string;
  igVersion?: string;
}

export function InstagramEmbedWrapper(props: InstagramEmbedWrapperProps) {
  return <InstagramEmbed {...props} />;
}
