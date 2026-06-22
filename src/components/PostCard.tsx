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
import ShareIcon from '@mui/icons-material/Share';
import ReplyIcon from '@mui/icons-material/Reply';
import GraphIcon from '@mui/icons-material/AccountTree';
import {useTranslation} from "react-i18next";
import {formatNumber} from "../mainCode.ts";
import {Link} from 'react-router'
import { useState } from "react";
import {comments, posts} from "../mockData.ts";
import PostGraph from "../pages/PostGraph.tsx";



function openPost() {

}

export function PostCard() {
    const {t} = useTranslation('auth');
    const [graphOpen, setGraphOpen] = useState(false);
    const post = posts.find((p) => p.id === "1");

    return (
        <Card sx={{p: 0, display: 'flex', flexDirection: 'row', backgroundColor: 'background.paper'}}>
            <Box sx={{
                m: 0, backgroundColor: 'secondary.main', minWidth: 48, display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <IconButton size="small">
                    <KeyboardArrowUpIcon/>
                </IconButton>

                <Typography variant="body2" fontWeight="bold">
                    {formatNumber(420412)}
                </Typography>

                <IconButton size="small">
                    <KeyboardArrowDownIcon/>
                </IconButton>
            </Box>
            <Box>
                <CardContent>
                    <Box display="flex" flexDirection="row" alignItems='center' textAlign='center' gap={1} sx={{mb: 1}}>
                        <Avatar sx={{width: 24, height: 24}}/>
                        <Chip onClick={() => {}} component={Link} to={'/communities'} sx={{fontWeight: 'bold'}} label='community'
                              size='small'/>
                        <Typography variant='subtitle2' textAlign='center' color='textSecondary'>Username</Typography>
                        <Typography variant='subtitle2' textAlign='center' color='textSecondary'>• time</Typography>
                    </Box>
                    <Typography component='h5' onClick={openPost} variant='subtitle1' sx={{fontSize: 20}}
                                fontWeight='500'>Title</Typography>
                    <Typography variant='subtitle1' color='textSecondary'>Publication description</Typography>
                </CardContent>

                <CardMedia component='img'
                           sx={{width: '100%', maxHeight: 'auto', objectFit: 'cover'}}
                           src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffikiwiki.com%2Fuploads%2Fposts%2F2022-02%2F1645054865_1-fikiwiki-com-p-krasivie-kartinki-okeana-1.jpg&f=1&nofb=1&ipt=ccc276ad4112bdaae2847d2814f4817d1f144db45740e501de81b063181ec78a'
                           alt='photo not loaded'/>
                <CardActions>
                    <Button onClick={openPost} sx={{color: 'text.secondary', fontSize: 13, p: 0}}
                            startIcon={<CommentIcon fontSize='small' sx={{
                                color: 'text.secondary',
                                width: 16,
                                height: 16
                            }}/>}>412 {t('common:comments')}</Button>
                    <Button
                        sx={{color: 'text.secondary', fontSize: 13, p: 0}}
                        startIcon={<ShareIcon fontSize='small'
                                              sx={{
                                                  color: 'text.secondary',
                                                  width: 16,
                                                  height: 16
                                              }}/>}>{t('common:share')}
                    </Button>
                    <Button
                        sx={{color: 'text.secondary', fontSize: 13, p: 0}}
                        onClick={() => setGraphOpen(true)}
                        startIcon={<GraphIcon fontSize='small'
                                              sx={{
                                                  color: 'text.secondary',
                                                  width: 16,
                                                  height: 16
                                              }}/>}

                    >{t('common:graph')}
                    </Button>
                    <Button
                        sx={{color: 'text.secondary', fontSize: 13, p: 0}}
                        startIcon={<ReplyIcon fontSize='small'
                                              sx={{
                                                  color: 'text.secondary',
                                                  width: 16,
                                                  height: 16
                                              }}/>}>{t('common:reply')}
                    </Button>
                    {post && <PostGraph open={graphOpen} onClose={() => setGraphOpen(false)} post={post} allComments={comments} />}
                </CardActions>
            </Box>

        </Card>
    );
}