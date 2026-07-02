import { useTranslation } from "react-i18next";
import { Box, Button, Card, CardContent, MenuItem, TextField, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { BackToFeedButton } from "../components/BackToFeedButton.tsx";
import { PostCard } from "../components/PostCard.tsx";
import { api } from "../api.ts";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { Post } from "../types.ts";

type Community = {
    id: number;
    name: string;
};

type CreatePostForm = {
    communityId: string;
    title: string;
    description: string;
};

export function CreatePost() {
    const { t } = useTranslation();
    const { id: parentPostId } = useParams(); // если есть — это реплай
    const navigate = useNavigate();

    const [communities, setCommunities] = useState<Community[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [parentPost, setParentPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(!!parentPostId);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<CreatePostForm>();

    const isReply = !!parentPostId;

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const { data } = await api.get('/communities/list');
                setCommunities(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCommunities();
    }, []);

    useEffect(() => {
        if (parentPostId) {
            const fetchParentPost = async () => {
                try {
                    const { data } = await api.get(`/posts/${parentPostId}`);
                    setParentPost(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchParentPost();
        }
    }, [parentPostId]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            setError('root', {
                type: 'manual',
                message: t('imageMaxSize', { count: 10 })
            });
            return;
        }
        setImage(file);
    };

    const onSubmit = async (form: CreatePostForm) => {
        try {
            const formData = new FormData();
            formData.append('communityId', form.communityId);
            formData.append('title', form.title);
            formData.append('description', form.description);

            if (parentPostId) {
                formData.append('parentPostId', parentPostId);
            }

            if (image) {
                formData.append('postImage', image);
            }

            const response = await api.post('/posts', formData);
            navigate(`/posts/${response.data.id}`);

        } catch (err: any) {
            setError('root', {
                type: 'server',
                message: err.response?.data?.message || t('error')
            });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <BackToFeedButton />

            {isReply && parentPost && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {t('replyToPost')}:
                    </Typography>
                    <PostCard post={parentPost} />
                </Box>
            )}

            <Card component="form" onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {isReply ? t('reply') : t('createAPost')}
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label={t('chooseACommunity')}
                        margin="normal"
                        error={!!errors.communityId}
                        helperText={errors.communityId?.message}
                        defaultValue=""
                        {...register('communityId', {
                            required: t('chooseACommunity')
                        })}
                    >
                        {communities.map((community) => (
                            <MenuItem key={community.id} value={community.id}>
                                {community.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label={t('title')}
                        margin="normal"
                        inputProps={{ maxLength: 300 }}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        {...register('title', {
                            required: t('enterTitle'),
                            maxLength: {
                                value: 300,
                                message: t('maxSymbols', { count: 300 })
                            }
                        })}
                    />

                    <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label={t('description')}
                        {...register('description')}
                        margin="normal"
                    />

                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<ImageIcon />}
                        sx={{ mt: 1 }}
                    >
                        {t('addImage')}
                        <input type="file" hidden onChange={handleImageUpload} />
                    </Button>

                    {image && (
                        <Typography sx={{ mt: 1 }}>{image.name}</Typography>
                    )}

                    {errors.root && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {errors.root.message}
                        </Typography>
                    )}

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                        {isReply && (
                            <Button variant="outlined" onClick={() => navigate(-1)}>
                                {t('cancel')}
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '...' : isReply ? t('reply') : t('create')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}