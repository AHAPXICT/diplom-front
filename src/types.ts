export interface Community {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    membersCount: number;
    isMember: boolean;
}

export type Post = {
    id: number;
    title: string | null;
    description: string | null;
    image: string | null;
    viewsCount: number;
    likesCount: number;
    createdAt: string;
    commentsCount: number;
    author: {
        id: number;
        username: string;
        profilePicture: string | null;
    };
    community: {
        id: number;
        name: string;
        imageUrl: string | null;
    };
    parentPost?: {
        id: number;
        title: string | null;
        description: string | null;
    } | null;
};