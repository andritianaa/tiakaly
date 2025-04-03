
// Types pour les tops
export interface Media {
    id: string
    url: string
    type?: string
}

export interface PostInstaBasic {
    id: string
    title: string
    url: string
    mainMedia?: Media
}

export interface Top {
    id: string
    title: string
    description: string
    createdAt: string
    top1Id: string
    top1Reason: string
    top2Id?: string | null
    top2Reason: string
    top3Id?: string | null
    top3Reason: string
    mainMediaId: string
    mainMedia: Media
    top1: PostInstaBasic
    top2?: PostInstaBasic | null
    top3?: PostInstaBasic | null
}


export type TopWithMain = {
    id: string;
    createdAt: Date;
    title: string;
    description: string;
    top1Id: string;
    top1Reason: string;
    top2Id: string | null;
    top2Reason: string;
    top3Id: string | null;
    top3Reason: string;
    mainMediaId: string;
    mainMedia: {
        id: string;
        url: string;
        type: string;
        createdAt: Date;
    };
};

export type PostInstaWithMain = {
    id: string
    date: Date
    url: string
    title: string
    placeId: string | null
    mainMediaId: string
    createdAt: Date
    updatedAt: Date
    mainMedia: {
        id: string
        url: string
        type: string
        createdAt: Date
    }
    place?: {
        id: string
        title: string
        localisation: string
    } | null
}