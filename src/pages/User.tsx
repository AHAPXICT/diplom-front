import {Avatar, Box, Button, ButtonGroup, Card, Divider, Stack, Tab, Tabs, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {PostCard} from "../components/PostCard.tsx";
import {BackToFeedButton} from "../components/BackToFeedButton.tsx";
import {useState} from "react";

function TextElement({text, label}: {text: string, label: string}) {
    return <Box>
        <Typography variant="h6" fontWeight="bold">
            {text}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
    </Box>
}


interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </div>
    );
}

export default function User() {
    const { t } = useTranslation('auth');
    const [tab, setTab] = useState<number>(0);

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ): void => {
        setTab(newValue);
    };


    return (
        <Box>
            <BackToFeedButton />
            <Card sx={{p: 0, my: 2}}>
                <Box sx={{ background: "linear-gradient(90deg, #5f9cff, #7b4dff)",  height: 140 }}/>
                <Box sx={{position: "relative", m: 2 }}>
                    <Box sx={{ display: "flex"}}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                border: "4px solid white",
                                position: "relative ",
                                top: -50,
                            }}
                        />
                        <Typography variant="h5" fontWeight="bold" component="div">Username</Typography>
                    </Box>
                    <Box sx={{  }}>
                        <Typography variant="body2" color="text.secondary">
                            🎂 Cake day: 1/15/2023 • Joined over 3 years ago
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={4}>
                            <TextElement text="5, 420" label={t("common:karma")}></TextElement>
                            <TextElement text="898" label={t("common:posts")}></TextElement>
                            <TextElement text="5, 420" label={t("common:comments")}></TextElement>
                    </Stack>
                </Box>
            </Card>
            <Card>
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
                            color: "#6b7280",
                        },
                        "& .Mui-selected": {
                            color: "#1976d2",
                        },
                    }}
                >
                    <Tab label="Posts" />
                    <Tab label="Comments" />
                    <Tab label="About" />
                </Tabs>
                <TabPanel value={tab} index={0}>
                    <PostCard />
                </TabPanel>
                    <TabPanel value={tab} index={1}>
                        <Typography>About content</Typography>
                    </TabPanel>
                <Divider />
            </Card>
        </Box>
    );
}