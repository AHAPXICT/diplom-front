import {Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {PostCard} from "../components/PostCard.tsx";

export function Popular() {
    const { t } = useTranslation('auth');
    return (
        <>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight="bold" >{t('common:popular')}</Typography>
                <PostCard />
                <PostCard />
            </Stack>
        </>
    );
}