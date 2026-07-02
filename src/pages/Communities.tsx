import {CommunityCard} from "../components/CommunityCard.tsx";
import {Box, Button, Card, CardContent, Skeleton, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import {useEffect, useState} from "react";
import {CreateCommunityModal} from "./CreateCommunityModal.tsx";
import type {Community} from "../types.ts";
import {api} from "../api.ts";

export function Communities() {
    const {t} = useTranslation('auth');

    const [open, setOpen] = useState<boolean>(false);
    const [communities, setCommunities] = useState<Community[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchCommunities = async () => {
            try {

                const { data } =
                    await api.get('/communities');

                setCommunities(data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunities();

    }, []);

    const handleJoin = async (
        communityId: number
    ) => {

        try {

            await api.post(
                `/communities/${communityId}/join`
            );

            setCommunities(prev =>
                prev.map(c =>
                    c.id === communityId
                        ? {
                            ...c,
                            isMember: true,
                            membersCount:
                                c.membersCount + 1
                        }
                        : c
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    const handleLeave = async (
        communityId: number
    ) => {

        try {

            await api.delete(
                `/communities/${communityId}/join`
            );

            setCommunities(prev =>
                prev.map(c =>
                    c.id === communityId
                        ? {
                            ...c,
                            isMember: false,
                            membersCount:
                                Math.max(
                                    0,
                                    c.membersCount - 1
                                )
                        }
                        : c
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = (
        community: Community
    ) => {

        setCommunities(prev => [
            community,
            ...prev
        ]);
    };
    if (loading) {
        return (
            <>
                <CommunityCardSkeleton />
                <CommunityCardSkeleton />
                <CommunityCardSkeleton />
            </>
        );
    }
    return (
        <Stack spacing={2}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', m: 2}}>
                <Typography variant="h4" fontWeight='bold'>
                    {t('common:communities')}
                </Typography>
                <Button variant="contained" onClick={() => setOpen(true)} color="primary" startIcon={<AddIcon/>}>
                    {t('common:create')}
                </Button>

                <CreateCommunityModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onCreate={handleCreate}
                />
            </Box>
            {!loading &&
                communities.length === 0 && (
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                    >
                        {t('common:nothingCommunities')}
                    </Typography>
                )}
            {communities.map(community => (
                <CommunityCard
                    key={community.id}
                    community={community}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                />
            ))}
        </Stack>
    )
}

function CommunityCardSkeleton() {
    return (
        <Card sx={{ p: 0 }}>

            <Skeleton
                variant="rectangular"
                height={120}
            />

            <CardContent>

                <Skeleton
                    width="60%"
                    height={35}
                />

                <Skeleton width="100%" />
                <Skeleton width="80%" />

                <Box
                    mt={2}
                    display="flex"
                    justifyContent="space-between"
                >
                    <Skeleton
                        width={90}
                        height={35}
                    />

                    <Skeleton
                        width={100}
                        height={40}
                    />
                </Box>

            </CardContent>

        </Card>
    );
}