import type { Contact, ContactType, Media, Menu, Status } from "@prisma/client";

export type ContactInput = {
  id?: string;
  type: ContactType;
  value: string;
};

export type MediaInput = {
  id: string;
  url: string;
  type: string;
};

export type MenuInput = {
  id: string;
  name: string;
};

export type PlaceInput = {
  id?: string;
  title: string;
  localisation: string;
  isOpenSunday: boolean;
  bio: string;
  content: string;
  longitude: number;
  priceInDollars?: number;
  gmapLink?: string;
  gmapEmbed?: string;
  instagramUrl?: string;
  latitude: number;
  keywords: string[];
  rating: number;
  priceMin: number;
  priceMax: number;
  type: string;
  menu: string[];
  status: Status;
  mainMediaId: string;
  contacts: ContactInput[];
  mediaIds: string[];
};

export type PlaceWithRelations = {
  id: string;
  title: string;
  isOpenSunday: boolean;
  localisation: string;
  content: string;
  priceInDollars?: number;
  gmapLink?: string;
  gmapEmbed?: string;
  instagramUrl?: string;
  longitude: number;
  bio: string;
  latitude: number;
  keywords: string[];
  rating: number;
  priceMin: number;
  priceMax: number;
  type: string;
  menu: string[];
  status: Status;
  mainMediaId: string;
  mainMedia: Media;
  MediaPlace: {
    id: string;
    media: Media;
  }[];
  Contact: {
    id: string;
    type: ContactType;
    value: string;
  }[];
  MenuPlace: {
    id: string;
    menu: Menu;
  }[];
};

export type PlaceSummary = {
  id: string;
  isOpenSunday: boolean;

  bio?: string | null;
  title: string;
  localisation: string;
  longitude: number;
  latitude: number;
  priceMin: number;
  priceMax: number;
  rating: number;
  priceInDollars?: number | null;
  gmapLink?: string | null;
  Contact: Contact[];
  mainMedia?: {
    url: string;
  };
  MenuPlace: {
    id: string;
    menuId: string;
  }[] | any[];
  keywords: string[];
  type: string;
  content: string;
};
