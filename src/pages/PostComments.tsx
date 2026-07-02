import { PostCard } from "../components/PostCard.tsx";
import { Avatar, Box, Button, Divider, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { CommentPaper } from "../components/CommentPaper.tsx";
import { useTranslation } from "react-i18next";
import { BackToFeedButton } from "../components/BackToFeedButton.tsx";
import { useParams } from "react-router";
import { api } from "../api.ts";
import { useForm } from "react-hook-form";
import type { Post } from "../types.ts";
import { useSelector } from "react-redux";

type CommentForm = {
    text: string;
};

type Comment = {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: number;
        username: string;
        profilePicture: string | null;
    };
    replies: Comment[];
};

const API_URL = import.meta.env.VITE_API_URL;

export function PostComments() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);
    const currentUser = useSelector((state: any) => state.user);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setFocus,
        formState: { errors, isSubmitting }
    } = useForm<CommentForm>();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/posts/${id}`);
                setPost(data);
                setComments(data.Comment || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPost();
    }, [id]);

    const onSubmit = async (form: CommentForm) => {
        try {
            const { data } = await api.post(`/posts/${id}/comments`, {
                content: form.text,
                parentCommentId: replyTo?.id || null,
            });

            if (replyTo) {
                setComments(prev => addReply(prev, replyTo.id, data));
                setReplyTo(null);
            } else {
                setComments(prev => [data, ...prev]);
            }

            setPost(prev => prev ? {
                ...prev,
                commentsCount: prev.commentsCount + 1,
            } : prev);

            reset();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || t('error'));
        }
    };

    const addReply = (comments: Comment[], parentId: number, newReply: Comment): Comment[] => {
        return comments.map(comment => {
            if (comment.id === parentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReply(comment.replies, parentId, newReply)
                };
            }
            return comment;
        });
    };

    const handleReply = (commentId: number, username: string) => {
        setReplyTo({ id: commentId, username });
        setValue('text', '');
        setTimeout(() => setFocus('text'), 100);
    };

    const handleCancelReply = () => {
        setReplyTo(null);
        setValue('text', '');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return (
            <Box>
                <BackToFeedButton />
                <Typography textAlign="center" py={4}>{t('common:postNotFound')}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <BackToFeedButton />
            <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
                <PostCard post={post} />

                <Paper
                    elevation={1}
                    sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {replyTo && (
                        <Typography variant="body2" color="text.secondary">
                            {t('common:replyTo')} <strong>{replyTo.username}</strong>
                            {' '}
                            <Button size="small" onClick={handleCancelReply}>
                                {t('common:cancel')}
                            </Button>
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "flex-start" }}>
                        <Avatar
                            src={currentUser?.profilePicture ? API_URL + currentUser.profilePicture : undefined}
                            sx={{ width: 48, height: 48 }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={4}
                            placeholder={replyTo ? t('common:writeReply') : t('common:writeComment')}
                            variant="outlined"
                            {...register('text', {
                                required: t('common:fieldRequired'),
                                minLength: {
                                    value: 1,
                                    message: t('common:tooShort'),
                                },
                                maxLength: {
                                    value: 1000,
                                    message: t('common:tooLong'),
                                },
                            })}
                            error={!!errors.text}
                            helperText={errors.text?.message}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    alignItems: "flex-start",
                                    borderRadius: 1,
                                },
                                "& textarea": {
                                    resize: "none",
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{ px: 3, py: 1, minWidth: 120 }}
                        >
                            {isSubmitting ? '...' : replyTo ? t('common:reply') : t('common:send')}
                        </Button>
                    </Box>
                </Paper>

                <Box>
                    <Typography variant='h6'>
                        {t('comments', { count: post.commentsCount || comments.length })}
                    </Typography>
                    <Divider sx={{ mt: 1, mb: 2 }} />

                    {comments.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" py={2}>
                            {t('common:noComments')}
                        </Typography>
                    ) : (
                        comments.map(comment => (
                            <CommentPaper
                                key={comment.id}
                                comment={comment}
                                onReply={handleReply}
                            />
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
}