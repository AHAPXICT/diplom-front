import {Avatar, Box, Button, Card, Divider, Skeleton, Stack, Tab, Tabs, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {PostCard} from "../components/PostCard.tsx";
import {BackToFeedButton} from "../components/BackToFeedButton.tsx";
import {useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import LogOutButton from "../components/LogOutButton.tsx";
import {ChangeProfileButton} from "../components/ChangeProfileButton.tsx";
import {useParams} from "react-router";
import {api} from "../api.ts";
import {useSelector} from "react-redux";
import type {Post} from "../types.ts";

function TextElement({text, label}: { text: string, label: string }) {
    return <Box>
        <Typography textAlign='center' variant="h6" fontWeight="bold">
            {text}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
    </Box>
}

const TabPanelNoPadding = styled(TabPanel)(({theme}) => ({
    padding: 0,
    margin: 0,
}));

interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function TabPanel({children, value, index}: TabPanelProps) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{pt: 2}}>{children}</Box>}
        </div>
    );
}

export default function User() {
    const {t} = useTranslation('auth');
    const [tab, setTab] = useState<number>(0);

    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ): void => {
        setTab(newValue);
    };

    const {username} = useParams();

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            const {data} = await api.get(`/user/${username}`);
            setProfile(data);
        };
        fetchProfile();
    }, [username]);

    useEffect(() => {
        if (!username) return;

        setPosts([]);
        setPage(1);
        setHasMore(true);

        const fetchPosts = async () => {
            try {
                setLoadingPosts(true);
                const {data} = await api.get(`/user/${username}/posts?page=1`);
                setPosts(data.posts);
                setHasMore(data.hasMore);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingPosts(false);
            }
        };

        fetchPosts();
    }, [username]);

    const loadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);

        try {
            setLoadingPosts(true);
            const {data} = await api.get(`/user/${username}/posts?page=${nextPage}`);
            setPosts(prev => [...prev, ...data.posts]);
            setHasMore(data.hasMore);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPosts(false);
        }
    };

    const [profile, setProfile] = useState<any>(null);
    const currentUser = useSelector(
        (state: any) => state.user
    );
    const isOwnProfile =
        currentUser.id === profile?.id;

    if (!profile) {
        return (
            <Box>
                <BackToFeedButton/>

                <Card sx={{p: 0, my: 2}}>
                    <Box
                        sx={{
                            background: "linear-gradient(90deg, #5f9cff, #7b4dff)",
                            height: 140
                        }}
                    />

                    <Box sx={{m: 2}}>
                        <Box sx={{display: "flex", height: 80}}>
                            <Skeleton
                                variant="circular"
                                width={100}
                                height={100}
                                sx={{mt: -6}}
                            />

                            <Box sx={{ml: 2, flex: 1}}>
                                <Skeleton width={200} height={40}/>
                                <Skeleton width={150} height={25}/>
                            </Box>
                        </Box>

                        <Divider sx={{my: 2}}/>

                        <Stack direction="row" spacing={4}>
                            <Skeleton width={80} height={50}/>
                            <Skeleton width={80} height={50}/>
                            <Skeleton width={80} height={50}/>
                        </Stack>
                    </Box>
                </Card>

                <Card>
                    <Skeleton height={50}/>
                    <Skeleton height={100}/>
                    <Skeleton height={100}/>
                </Card>
            </Box>
        );
    }

    return (
        <Box>
            <BackToFeedButton/>
            <Card sx={{p: 0, my: 2}}>
                <Box sx={{background: "linear-gradient(90deg, #5f9cff, #7b4dff)", height: 140}}/>
                <Box sx={{position: "relative", m: 2}}>
                    <Box sx={{display: "flex", height: 80}}>
                        <Avatar
                            src={
                                       profile?.profilePicture
                                           ? (profile.profilePicture.startsWith('http')
                                               ? profile.profilePicture
                                               : import.meta.env.VITE_API_URL + profile.profilePicture)
                                           : undefined
                                   }
                            sx={{
                                width: 100,
                                height: 100,
                                border: "4px solid white",
                                position: "relative ",
                                top: -50,
                            }}
                        />
                        <Typography variant="h5" fontWeight="bold" component="div">{profile.username}</Typography>
                        <Box sx={{flexGrow: 1}}/>
                        {isOwnProfile && (<LogOutButton/>)}
                    </Box>
                    <Box sx={{}}>
                        <Typography variant="body2" color="text.secondary">
                            🎂 {t('common:cakeDay')}: {
                            profile.birthday ? new Date(profile.birthday).toLocaleDateString('ru-RU')
                                : '-'}
                        </Typography>
                    </Box>

                    <Divider sx={{my: 2}}/>

                    <Stack direction="row" alignItems='center' spacing={4}>
                        <TextElement text={profile.rating.toString()} label={t("common:karma")}></TextElement>
                        <TextElement text={profile._count.posts.toString()} label={t("common:posts")}></TextElement>
                        <TextElement text={profile._count.comments.toString()}
                                     label={t("common:comments")}></TextElement>
                        <Box sx={{flexGrow: 1}}/>
                        {isOwnProfile && (<ChangeProfileButton
                            profile={profile}
                            onProfileUpdated={setProfile}
                        />)}
                    </Stack>
                </Box>
            </Card>
            <Card sx={{p: 0}}>
                <Tabs
                    value={tab}
                    onChange={handleChange}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                        minHeight: 48,
                        "& .MuiTabs-indicator": {
                            height: 3,
                            borderRadius: 2,
                        },
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: 15,
                            minHeight: 48,
                            px: 2,
                        },
                        borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Tab label={t('common:posts')}/>
                    <Tab label={t('common:about')}/>
                </Tabs>
                <Box sx={{m: 2}}>
                    <TabPanelNoPadding value={tab} index={0}>
                        <Box gap={3} display='flex' flexDirection='column'>
                        {loadingPosts ? (
                            <>
                                <Skeleton height={120}/>
                                <Skeleton height={120}/>
                                <Skeleton height={120}/>
                            </>
                        ) : posts.length === 0 ? (
                            <Typography
                                color="text.secondary"
                                textAlign="center"
                                sx={{py: 4}}
                            >
                                {t('common:nothingPosts')}
                            </Typography>
                        ) : (
                            posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                />
                            ))
                        )}
                        {hasMore && (
                            <Button onClick={loadMore}>
                                {t('common:loadMore')}
                            </Button>
                        )}
                        </Box>
                    </TabPanelNoPadding>
                    <TabPanelNoPadding value={tab} index={1}>
                        <Typography
                            color="text.secondary"
                            textAlign="center"
                            sx={{py: 4}}
                        >{profile.about || t('common:nothingAbout')}</Typography>
                    </TabPanelNoPadding>
                </Box>
            </Card>
        </Box>
    );
}