"use client";

import { FacebookEmbed, InstagramEmbed } from 'react-social-media-embed';

interface InstagramEmbedWrapperProps {
  url: string;
  className?: string;
  igVersion?: string;
}
interface FacebookEmbedWrapperProps {
  url: string;
  className?: string;
}

export function InstagramEmbedWrapper(props: InstagramEmbedWrapperProps) {
  return <InstagramEmbed {...props} />;
}
export function FacebookEmbedWrapper(props: FacebookEmbedWrapperProps) {
  return <FacebookEmbed {...props} />;
}
