import {useTranslation} from "react-i18next";
import {type ChangeEvent, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

export function ChangeProfileButton() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        setOpen(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
    };
    return (
        <>
            <Button sx={{alignSelf: "center"}} variant='outlined' onClick={handleLogout}>
                {t('common:changeAccount')}
            </Button>
            <ChangeProfileModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={logout}
            />
        </>
    )
}

type LogoutModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};
function ChangeProfileModal({
                         open,
                         onClose,
                         onConfirm,
                     }: LogoutModalProps) {
    const {t} = useTranslation('auth');

    const [birthday, setBirthday] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
    };

    const handleCreate = () => {
        onCreate({name: birthday, description, image});
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('common:changeAccount')}</DialogTitle>

            <DialogContent>
                <TextField
                    label={t('common:cakeDay')}
                    fullWidth
                    margin="normal"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />

                <TextField
                    label={t('common:about')}
                    fullWidth
                    multiline
                    rows={2}
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
                        {t('common:avatar')}
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
                    {t('common:saveChanges')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}