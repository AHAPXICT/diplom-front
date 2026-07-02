import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router";
import ReplyIcon from '@mui/icons-material/Reply';
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

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

type CommentPaperProps = {
    comment: Comment;
    onReply: (commentId: number, username: string) => void;
    depth?: number;
};

export function CommentPaper({ comment, onReply, depth = 0 }: CommentPaperProps) {
    const { t } = useTranslation();

    return (
        <Box sx={{
            ml: depth > 0 ? 4 : 0,
            borderLeft: depth > 0 ? '2px solid' : 'none',
            borderColor: 'divider',
            pl: depth > 0 ? 2 : 0
        }}>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 1,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    backgroundColor: depth % 2 === 0 ? 'background.paper' : 'action.hover',
                }}
            >
                <Box sx={{ display: "flex", flexDirection: 'row', alignItems: 'start' }}>
                    <Avatar
                        src={
                            comment.author.profilePicture
                                ? (comment.author.profilePicture.startsWith('http')
                                    ? comment.author.profilePicture
                                    : API_URL + comment.author.profilePicture)
                                : undefined
                        }
                        sx={{ width: 32, height: 32 }}
                    />
                    <Box sx={{ mx: 2, flex: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <Typography
                                sx={{ cursor: 'pointer' }}
                                variant='subtitle2'
                                fontWeight='bold'
                                component={Link}
                                to={`/user/${comment.author.username}`}
                            >
                                {comment.author.username}
                            </Typography>
                            <Typography variant='subtitle2' color='textSecondary'>
                                • {new Date(comment.createdAt).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Typography variant='body2' sx={{ mt: 0.5 }}>
                            {comment.content}
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<ReplyIcon fontSize="small" />}
                            onClick={() => onReply(comment.id, comment.author.username)}
                            sx={{ color: 'text.secondary', fontSize: 12, p: 0, mt: 0.5 }}
                        >
                            {t('common:reply')}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Рекурсия */}
            {comment.replies?.map(reply => (
                <CommentPaper
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    depth={depth + 1}
                />
            ))}
        </Box>
    );
}