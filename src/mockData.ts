export interface User {
    id: string;
    username: string;
    avatar: string;
    karma: number;
    cakeDay: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    author: User;
    community: string;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    createdAt: string;
    imageUrl?: string;
}

export interface Comment {
    id: string;
    content: string;
    author: User;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    replies?: Comment[];
}

export interface Community {
    id: string;
    name: string;
    description: string;
    members: number;
    icon: string;
    banner: string;
}

export const currentUser: User = {
    id: "1",
    username: "user123",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    karma: 5420,
    cakeDay: "2023-01-15",
};

export const users: User[] = [
    currentUser,
    {
        id: "2",
        username: "tech_guru",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
        karma: 12340,
        cakeDay: "2022-05-10",
    },
    {
        id: "3",
        username: "nature_lover",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        karma: 8765,
        cakeDay: "2021-11-22",
    },
    {
        id: "4",
        username: "code_master",
        avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
        karma: 15678,
        cakeDay: "2020-08-05",
    },
];

export const communities: Community[] = [
    {
        id: "1",
        name: "Technology",
        description: "All things tech - news, discussions, and debates",
        members: 245000,
        icon: "💻",
        banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop",
    },
    {
        id: "2",
        name: "Nature",
        description: "Beautiful landscapes and wildlife photography",
        members: 189000,
        icon: "🌲",
        banner: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=300&fit=crop",
    },
    {
        id: "3",
        name: "Gaming",
        description: "Gaming news, reviews, and discussions",
        members: 567000,
        icon: "🎮",
        banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=300&fit=crop",
    },
    {
        id: "4",
        name: "Cooking",
        description: "Share recipes and cooking tips",
        members: 123000,
        icon: "🍳",
        banner: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=300&fit=crop",
    },
    {
        id: "5",
        name: "Fitness",
        description: "Workout routines, nutrition, and motivation",
        members: 298000,
        icon: "💪",
        banner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=300&fit=crop",
    },
];

export const posts: Post[] = [
    {
        id: "1",
        title: "The Future of AI: What to Expect in 2026",
        content: "Artificial Intelligence is rapidly evolving. Here are my predictions for what we'll see this year in AI development, from improved language models to breakthrough applications in healthcare and robotics.",
        author: users[1],
        community: "Technology",
        upvotes: 2340,
        downvotes: 120,
        commentCount: 456,
        createdAt: "2026-03-25T10:30:00Z",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    },
    {
        id: "2",
        title: "Captured this amazing sunset at Yosemite National Park",
        content: "Spent the whole day hiking and was rewarded with this incredible view. Nature never ceases to amaze me!",
        author: users[2],
        community: "Nature",
        upvotes: 5678,
        downvotes: 45,
        commentCount: 234,
        createdAt: "2026-03-24T18:45:00Z",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    },
    {
        id: "3",
        title: "Just finished building my first mechanical keyboard!",
        content: "After months of research and waiting for parts, I finally completed my custom mechanical keyboard build. Used Gateron Browns and custom keycaps. The sound and feel are incredible!",
        author: users[3],
        community: "Technology",
        upvotes: 1234,
        downvotes: 67,
        commentCount: 189,
        createdAt: "2026-03-24T14:20:00Z",
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=400&fit=crop",
    },
    {
        id: "4",
        title: "My homemade sourdough bread turned out perfect!",
        content: "Been perfecting my sourdough recipe for months. Finally got the perfect crust and crumb structure. Happy to share my recipe if anyone is interested!",
        author: users[0],
        community: "Cooking",
        upvotes: 3456,
        downvotes: 89,
        commentCount: 567,
        createdAt: "2026-03-23T09:15:00Z",
        imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=400&fit=crop",
    },
    {
        id: "5",
        title: "Thoughts on the new open world RPG that just released?",
        content: "I've been playing for about 10 hours now and I'm absolutely hooked. The world design is incredible and the story is really engaging. What do you all think?",
        author: users[3],
        community: "Gaming",
        upvotes: 987,
        downvotes: 234,
        commentCount: 345,
        createdAt: "2026-03-23T20:00:00Z",
    },
    {
        id: "6",
        title: "Hit a new personal record on deadlifts today!",
        content: "Finally broke through my plateau and deadlifted 405lbs! Took months of consistent training and proper nutrition. Keep pushing everyone!",
        author: users[1],
        community: "Fitness",
        upvotes: 2109,
        downvotes: 34,
        commentCount: 156,
        createdAt: "2026-03-22T16:30:00Z",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=400&fit=crop",
    },
];

export const comments: Record<string, Comment[]> = {
    "1": [
        {
            id: "c1",
            content: "Great post! I'm particularly excited about AI applications in healthcare. The potential to save lives is enormous.",
            author: users[2],
            upvotes: 234,
            downvotes: 12,
            createdAt: "2026-03-25T11:15:00Z",
            replies: [
                {
                    id: "c1-1",
                    content: "Absolutely! AI-assisted diagnosis is already showing promising results in detecting diseases early.",
                    author: users[3],
                    upvotes: 89,
                    downvotes: 3,
                    createdAt: "2026-03-25T12:00:00Z",
                },
            ],
        },
        {
            id: "c2",
            content: "I'm more concerned about the ethical implications. We need strong regulations before this technology becomes too widespread.",
            author: users[0],
            upvotes: 567,
            downvotes: 234,
            createdAt: "2026-03-25T13:30:00Z",
            replies: [
                {
                    id: "c2-1",
                    content: "Valid point. Ethics should definitely be at the forefront of AI development.",
                    author: users[1],
                    upvotes: 123,
                    downvotes: 8,
                    createdAt: "2026-03-25T14:00:00Z",
                },
            ],
        },
        {
            id: "c3",
            content: "What about job displacement? AI is going to affect millions of workers.",
            author: users[3],
            upvotes: 445,
            downvotes: 67,
            createdAt: "2026-03-25T15:45:00Z",
        },
    ],
    "2": [
        {
            id: "c4",
            content: "Absolutely stunning! Yosemite is on my bucket list. What trail did you take?",
            author: users[1],
            upvotes: 456,
            downvotes: 5,
            createdAt: "2026-03-24T19:20:00Z",
        },
        {
            id: "c5",
            content: "The colors are incredible! Did you use any filters or is this straight from camera?",
            author: users[3],
            upvotes: 234,
            downvotes: 8,
            createdAt: "2026-03-24T20:15:00Z",
            replies: [
                {
                    id: "c5-1",
                    content: "Looks natural to me. Yosemite sunsets really are this beautiful!",
                    author: users[0],
                    upvotes: 67,
                    downvotes: 2,
                    createdAt: "2026-03-24T21:00:00Z",
                },
            ],
        },
        {
            id: "c6",
            content: "I was there last summer! The hiking is amazing. Great shot!",
            author: users[0],
            upvotes: 189,
            downvotes: 3,
            createdAt: "2026-03-24T22:30:00Z",
        },
    ],
    "3": [
        {
            id: "c7",
            content: "Nice build! Gateron Browns are a solid choice. What keycaps did you go with?",
            author: users[0],
            upvotes: 145,
            downvotes: 4,
            createdAt: "2026-03-24T15:00:00Z",
        },
        {
            id: "c8",
            content: "Looks great! I've been thinking about building one myself. Any tips for a beginner?",
            author: users[2],
            upvotes: 98,
            downvotes: 2,
            createdAt: "2026-03-24T16:30:00Z",
            replies: [
                {
                    id: "c8-1",
                    content: "Start with a hot-swap board! Makes it way easier to experiment with different switches.",
                    author: users[3],
                    upvotes: 45,
                    downvotes: 1,
                    createdAt: "2026-03-24T17:00:00Z",
                },
            ],
        },
        {
            id: "c9",
            content: "The waiting for parts is the worst! But so worth it in the end. Congrats!",
            author: users[1],
            upvotes: 234,
            downvotes: 6,
            createdAt: "2026-03-24T18:00:00Z",
        },
    ],
    "4": [
        {
            id: "c10",
            content: "This looks amazing! Please share the recipe! I've been trying to get my sourdough right for weeks.",
            author: users[1],
            upvotes: 678,
            downvotes: 12,
            createdAt: "2026-03-23T10:30:00Z",
        },
        {
            id: "c11",
            content: "Beautiful crust! What temperature do you bake at?",
            author: users[2],
            upvotes: 234,
            downvotes: 5,
            createdAt: "2026-03-23T11:45:00Z",
            replies: [
                {
                    id: "c11-1",
                    content: "I usually start at 450°F for the first 20 minutes, then drop to 400°F. Dutch oven is key!",
                    author: users[0],
                    upvotes: 156,
                    downvotes: 3,
                    createdAt: "2026-03-23T12:15:00Z",
                },
            ],
        },
        {
            id: "c12",
            content: "That crumb structure is perfect! You nailed it!",
            author: users[3],
            upvotes: 445,
            downvotes: 8,
            createdAt: "2026-03-23T13:00:00Z",
        },
    ],
    "5": [
        {
            id: "c13",
            content: "I'm about 5 hours in and loving it! The combat system is so smooth.",
            author: users[0],
            upvotes: 234,
            downvotes: 23,
            createdAt: "2026-03-23T21:00:00Z",
        },
        {
            id: "c14",
            content: "Is it worth the $70 price tag? Been on the fence about buying it.",
            author: users[1],
            upvotes: 156,
            downvotes: 12,
            createdAt: "2026-03-23T22:30:00Z",
            replies: [
                {
                    id: "c14-1",
                    content: "Absolutely worth it if you like RPGs. Easily 100+ hours of content.",
                    author: users[3],
                    upvotes: 89,
                    downvotes: 5,
                    createdAt: "2026-03-23T23:00:00Z",
                },
            ],
        },
        {
            id: "c15",
            content: "The graphics are stunning! Playing on PC with max settings is incredible.",
            author: users[2],
            upvotes: 345,
            downvotes: 34,
            createdAt: "2026-03-24T00:15:00Z",
        },
    ],
    "6": [
        {
            id: "c16",
            content: "Congrats! 405 is huge! What program are you running?",
            author: users[2],
            upvotes: 123,
            downvotes: 4,
            createdAt: "2026-03-22T17:00:00Z",
        },
        {
            id: "c17",
            content: "Beast mode! That's my goal for this year. Any nutrition tips?",
            author: users[0],
            upvotes: 89,
            downvotes: 2,
            createdAt: "2026-03-22T18:15:00Z",
            replies: [
                {
                    id: "c17-1",
                    content: "Make sure you're eating enough protein! I aim for 1g per pound of body weight.",
                    author: users[1],
                    upvotes: 56,
                    downvotes: 3,
                    createdAt: "2026-03-22T19:00:00Z",
                },
            ],
        },
        {
            id: "c18",
            content: "Awesome work! Breaking plateaus is the best feeling. Keep it up!",
            author: users[3],
            upvotes: 167,
            downvotes: 5,
            createdAt: "2026-03-22T20:00:00Z",
        },
    ],
};
