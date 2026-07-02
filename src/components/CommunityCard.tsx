import {Card, CardContent, Typography, Button, CardMedia, Chip, Box, } from '@mui/material';
import {useTranslation} from "react-i18next";
import type {Community} from "../types.ts";

interface Props {
    community: Community;

    onJoin?: (communityId: number) => void;
    onLeave?: (communityId: number) => void;
}

export function CommunityCard({ community, onJoin, onLeave }: Props) {
    const {t} = useTranslation();

    return (
        <Card sx={{ p: 0 }}>
            <CardMedia
                component="img"
                image={
                    community.imageUrl
                        ? (community.imageUrl.startsWith('http')
                            ? community.imageUrl
                            : import.meta.env.VITE_API_URL + community.imageUrl)
                        : import.meta.env.VITE_API_URL + "/uploads/communities/community-placeholder.jpg"
                }
                alt={community.name}
                sx={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover"
                }}
            />

            <CardContent>

                <Typography
                    variant="h6"
                    component="div"
                >
                    {community.name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        mb: 2
                    }}
                >
                    {community.description ||
                        t("common:nothingAbout")}
                </Typography>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Chip
                        variant="outlined"
                        label={t("common:members", {
                            count: community.membersCount
                        })}
                    />

                    <Button
                        variant={
                            community.isMember
                                ? "outlined"
                                : "contained"
                        }
                        color={
                            community.isMember
                                ? "error"
                                : "primary"
                        }
                        onClick={() =>
                            community.isMember
                                ? onLeave?.(community.id)
                                : onJoin?.(community.id)
                        }
                    >
                        {community.isMember
                            ? t("common:leaveCommunity")
                            : t("common:joinCommunity")}
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
}