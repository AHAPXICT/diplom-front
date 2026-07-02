import { Stack, Typography, Button, CircularProgress, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { PostCard } from "../components/PostCard.tsx";
import { useState, useEffect } from "react";
import type {Post} from "../types.ts";
import {api} from "../api.ts";

export function Feed() {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const loadPosts = async (pageNumber: number) => {
        try {
            const { data } = await api.get(`/posts/feed?page=${pageNumber}`);

            if (pageNumber === 1) {
                setPosts(data.posts);
            } else {
                setPosts(prev => [...prev, ...data.posts]);
            }

            setHasMore(data.hasMore);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts(1);
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight="bold">
                {t('common:feed')}
            </Typography>

            {posts.length === 0 ? (
                <Typography color="text.secondary">
                    Подпишитесь на сообщества, чтобы видеть посты
                </Typography>
            ) : (
                <>
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}

                    {hasMore && (
                        <Button
                            onClick={() => {
                                const next = page + 1;
                                setPage(next);
                                loadPosts(next);
                            }}
                        >
                            {t('common:loadMore')}
                        </Button>
                    )}
                </>
            )}
        </Stack>
    );
}