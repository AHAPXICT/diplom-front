import {Avatar, Box, Card, Divider, Stack, Tab, Tabs, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {PostCard} from "../components/PostCard.tsx";
import {BackToFeedButton} from "../components/BackToFeedButton.tsx";
import {useState} from "react";
import {styled} from "@mui/material/styles";
import LogOutButton from "../components/LogOutButton.tsx";
import {ChangeProfileButton} from "../components/ChangeProfileButton.tsx";
import type {Post} from "../mockData.ts";

function TextElement({text, label}: { text: string, label: string }) {
    return <Box>
        <Typography variant="h6" fontWeight="bold">
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

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ): void => {
        setTab(newValue);
    };

    const [username, setUsername] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [postsNumber, setPostsNumber] = useState<number>(0);
    const [commentsNumber, setCommentsNumber] = useState<number>(0);

    const [posts, setPosts] = useState<Post[]>([]);
    const [about, setAbout] = useState<string>(t('common:nothingAbout'));

    return (
        <Box>
            <BackToFeedButton/>
            <Card sx={{p: 0, my: 2}}>
                <Box sx={{background: "linear-gradient(90deg, #5f9cff, #7b4dff)", height: 140}}/>
                <Box sx={{position: "relative", m: 2}}>
                    <Box sx={{display: "flex", height: 80}} >
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                border: "4px solid white",
                                position: "relative ",
                                top: -50,
                            }}
                        />
                        <Typography variant="h5" fontWeight="bold" component="div">{username}</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <LogOutButton />
                    </Box>
                    <Box sx={{}}>
                        <Typography variant="body2" color="text.secondary">
                            🎂 {t('common:cakeDay')}: {birthday}
                        </Typography>
                    </Box>

                    <Divider sx={{my: 2}}/>

                    <Stack direction="row" alignItems='center' spacing={4}>
                            <TextElement text={rating.toString()} label={t("common:karma")}></TextElement>
                            <TextElement text={postsNumber.toString()} label={t("common:posts")}></TextElement>
                            <TextElement text={commentsNumber.toString()} label={t("common:comments")}></TextElement>
                        <Box sx={{ flexGrow: 1 }} />
                            <ChangeProfileButton />
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
                        {/*если нету постов то юзать nothingPosts*/}
                        {posts.map((post, index) => (
                            <PostCard />
                        ))}
                        <PostCard/>
                    </TabPanelNoPadding>
                    <TabPanelNoPadding value={tab} index={1}>
                        <Typography>{about}</Typography>
                    </TabPanelNoPadding>
                </Box>
            </Card>
        </Box>
    );
}