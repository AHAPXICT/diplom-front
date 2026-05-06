import {Box, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {PostCard} from "../components/PostCard.tsx";

export function Feed() {
    const { t } = useTranslation('auth');
    return (
        <>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight="bold" >{t('common:feed')}</Typography>
                <PostCard />
                <PostCard />
            </Stack>
        </>
    );
}