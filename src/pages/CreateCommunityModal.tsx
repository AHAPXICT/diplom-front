import {type ChangeEvent, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {useTranslation} from "react-i18next";

type CreateCommunityData = {
    name: string;
    description: string;
    image: File | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onCreate: (data: CreateCommunityData) => void;
};

export function CreateCommunityModal({ open, onClose, onCreate,}: Props) {
    const {t} = useTranslation('auth');

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
    };

    const handleCreate = () => {
        onCreate({name, description, image});
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('common:createACommunity')}</DialogTitle>

            <DialogContent>
                <TextField
                    label={t('common:name')}
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <TextField
                    label={t('common:description')}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Box mt={2}>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<ImageIcon/>}
                    >
                        {t('common:addImage')}
                        <input type="file" hidden onChange={handleImageChange}/>
                    </Button>

                    {image && (
                        <Typography variant="body2" mt={1}>
                            Selected: {image.name}
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>{t('common:cancel')}</Button>
                <Button variant="contained" onClick={handleCreate}>
                    {t('common:create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}