import {CommunityCard} from "../components/CommunityCard.tsx";
import {Box, Button, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import {useState} from "react";
import {CreateCommunityModal} from "./CreateCommunityModal.tsx";

export function Communities() {
    const {t} = useTranslation('auth');

    const [open, setOpen] = useState<boolean>(false);

    const handleCreate = (data: {
        name: string;
        description: string;
        image: File | null;
    }) => {
        console.log("Created:", data);
    };
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
            <CommunityCard/>
        </Stack>
    )
}