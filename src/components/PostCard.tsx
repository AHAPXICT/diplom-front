import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Typography
} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CommentIcon from '@mui/icons-material/Comment';
import ReplyIcon from '@mui/icons-material/Reply';
import GraphIcon from '@mui/icons-material/AccountTree';
import { useTranslation } from "react-i18next";
import { formatNumber } from "../mainCode.ts";
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from "react";
import type { Post } from "../types.ts";
import { api } from "../api.ts";
import PostGraph from "../pages/PostGraph.tsx";

type PostCardProps = {
    post: Post;
};

const API_URL = import.meta.env.VITE_API_URL;

export function PostCard({ post }: PostCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [graphOpen, setGraphOpen] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [userVote, setUserVote] = useState(0);

    useEffect(() => {
        const savedVote = localStorage.getItem(`vote-${post.id}`);
        if (savedVote) {
            setUserVote(Number(savedVote));
        }
    }, [post.id]);

    const handleVote = async (value: number) => {
        try {
            const { data } = await api.post(`/posts/${post.id}/vote`, { value });
            setLikesCount(data.likesCount);

            if (data.voted) {
                setUserVote(value);
                localStorage.setItem(`vote-${post.id}`, String(value));
            } else {
                setUserVote(0);
                localStorage.removeItem(`vote-${post.id}`);
            }
        } catch (err) {
            console.error('Vote error:', err);
        }
    };

    return (
        <Card sx={{ p: 0, display: 'flex', flexDirection: 'row', backgroundColor: 'background.paper' }}>
            <Box sx={{
                m: 0,
                backgroundColor: userVote === 1 ? 'rgba(76, 175, 80, 0.1)' :
                    userVote === -1 ? 'rgba(244, 67, 54, 0.1)' :
                        'secondary.main',
                minWidth: 48,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'background-color 0.3s',
            }}>
                <IconButton
                    size="small"
                    onClick={() => handleVote(1)}
                    sx={{
                        color: userVote === 1 ? '#4caf50' : 'inherit',
                        '&:hover': {
                            color: '#4caf50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        }
                    }}
                >
                    <KeyboardArrowUpIcon />
                </IconButton>

                <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{
                        color: userVote === 1 ? '#4caf50' :
                            userVote === -1 ? '#f44336' :
                                'inherit',
                    }}
                >
                    {formatNumber(likesCount)}
                </Typography>

                <IconButton
                    size="small"
                    onClick={() => handleVote(-1)}
                    sx={{
                        color: userVote === -1 ? '#f44336' : 'inherit',
                        '&:hover': {
                            color: '#f44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        }
                    }}
                >
                    <KeyboardArrowDownIcon />
                </IconButton>
            </Box>

            <Box sx={{ flex: 1 }}>
                <CardContent>
                    {/* Ссылка на родительский пост */}
                    {post.parentPost && (
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            {t('common:replyTo')}{' '}
                            <Link
                                to={`/posts/${post.parentPost.id}`}
                                style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}
                            >
                                {post.parentPost.title || t('common:post')}
                            </Link>
                        </Typography>
                    )}

                    <Box display="flex" flexDirection="row" alignItems='center' gap={1} sx={{ mb: 1 }}>
                        <Avatar
                            src={
                                post.author.profilePicture
                                    ? (post.author.profilePicture.startsWith('http')
                                        ? post.author.profilePicture
                                        : import.meta.env.VITE_API_URL + post.author.profilePicture)
                                    : undefined
                            }
                            sx={{ width: 24, height: 24 }}
                        />
                        <Chip
                            component={Link}
                            to={`/communities`}
                            sx={{
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                    boxShadow: 1,
                                }
                            }}
                            label={post.community.name}
                            size='small'
                        />
                        <Typography
                            variant='subtitle2'
                            color='textSecondary'
                            component={Link}
                            to={`/user/${post.author.username}`}
                            sx={{ cursor: 'pointer' }}
                        >
                            {post.author.username}
                        </Typography>
                        <Typography variant='subtitle2' color='textSecondary'>
                            • {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Typography
                        component='h5'
                        onClick={() => navigate(`/posts/${post.id}`)}
                        variant='subtitle1'
                        sx={{ fontSize: 20, cursor: 'pointer' }}
                        fontWeight='500'
                    >
                        {post.title}
                    </Typography>
                    <Typography variant='subtitle1' color='textSecondary'>
                        {post.description}
                    </Typography>
                </CardContent>

                {post.image && (
                    <CardMedia
                        component='img'
                        sx={{ width: '100%', maxHeight: 500, objectFit: 'cover', cursor: 'pointer' }}
                        src={post.image.startsWith('http') ? post.image : API_URL + post.image}
                        alt='post image'
                        onClick={() => window.open(API_URL + post.image, '_blank')}
                    />
                )}

                <CardActions>
                    <Button
                        onClick={() => navigate(`/posts/${post.id}`)}
                        sx={{ color: 'text.secondary', fontSize: 13, p: 0 }}
                        startIcon={<CommentIcon fontSize='small' />}
                    >
                        {post.commentsCount} {t('common:comments')}
                    </Button>
                    <Button
                        sx={{ color: 'text.secondary', fontSize: 13, p: 0 }}
                        onClick={() => navigate(`/posts/${post.id}/reply`)}
                        startIcon={<ReplyIcon fontSize='small' />}
                    >
                        {t('common:reply')}
                    </Button>
                    <Button
                        sx={{ color: 'text.secondary', fontSize: 13, p: 0 }}
                        onClick={() => setGraphOpen(true)}
                        startIcon={<GraphIcon fontSize='small' />}
                    >
                        {t('common:graph')}
                    </Button>
                </CardActions>
                {post && (
                    <PostGraph
                        open={graphOpen}
                        onClose={() => setGraphOpen(false)}
                        postId={post.id}
                    />
                )}
            </Box>
        </Card>
    );
}