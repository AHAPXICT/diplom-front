import {PostCard} from "../components/PostCard.tsx";
import {Avatar, Box, Button, Divider, Paper, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {CommentPaper} from "../components/CommentPaper.tsx";
import {t} from "i18next";
import {BackToFeedButton} from "../components/BackToFeedButton.tsx";

export function PostComments() {
    const [comment, setComment] = useState("");
    const commentsCount = 28
    return (
        <Box>
            <BackToFeedButton/>
        <Box sx={{gap: 3, display: "flex", flexDirection: "column"}}>
            <PostCard/>
            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "center",
                    alignItems: "start",
                }}
            >
                <Avatar
                    src="https://i.pravatar.cc/100"
                    sx={{width: 48, height: 48}}
                />
                <TextField
                    fullWidth
                    multiline
                    minRows={1}
                    maxRows={3}
                    placeholder="Написать комментарий"
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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
                    variant="contained"
                    disabled={!comment.trim()}
                    sx={{px: 3, py: 1}}
                >
                    Отправить
                </Button>
            </Paper>
            <Box>
                <Typography variant='h6'>{t("comments", { count: commentsCount })}</Typography>
                <Divider sx={{mt: 1}} />
                <CommentPaper />


            </Box>
        </Box>
        </Box>
    );
}