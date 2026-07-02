import {useTranslation} from "react-i18next";
import {type ChangeEvent, useEffect, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {api} from "../api.ts";

export function ChangeProfileButton({
                                        profile,
                                        onProfileUpdated
                                    }: {
    profile: any;
    onProfileUpdated: (profile: any) => void;
}) {
    {
        const {t} = useTranslation();
        const [open, setOpen] = useState(false);

        const handleLogout = () => {
            setOpen(true);
        };
        return (
            <>
                <Button sx={{alignSelf: "center"}} variant='outlined' onClick={handleLogout}>
                    {t('common:changeAccount')}
                </Button>
                <ChangeProfileModal
                    open={open}
                    onClose={() => setOpen(false)}
                    profile={profile}
                    onProfileUpdated={onProfileUpdated}
                />
            </>
        )
    }

    type ChangeProfileModalProps = {
        open: boolean;
        onClose: () => void;
        profile: any;
        onProfileUpdated: (profile: any) => void;
    };

    function ChangeProfileModal({
                                    open,
                                    onClose,
                                    profile,
                                    onProfileUpdated
                                }: ChangeProfileModalProps) {
        const {t} = useTranslation('auth');

        const [birthday, setBirthday] = useState<string>("");
        const [description, setDescription] = useState<string>("");
        const [image, setImage] = useState<File | null>(null);

        useEffect(() => {
            if (!profile) return;

            setBirthday(
                profile.birthday
                    ? profile.birthday.slice(0, 10)
                    : ""
            );

            setDescription(profile.about || "");
        }, [profile, open]);

        const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;

            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                alert(t('common:imageMaxSize', {count: 10} ));
                return;
            }

            setImage(file);
        };

        const handleSave = async () => {
            try {
                const formData = new FormData();

                formData.append("birthday", birthday);
                formData.append("about", description);

                if (image) {
                    formData.append("avatar", image);
                }
                console.log(formData);
                const {data} = await api.patch(
                    "/user/me",
                    formData
                );
                onProfileUpdated(data);

                onClose();
            } catch (err) {
                console.error(err);
            }
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
                        type="date"
                        InputLabelProps={{
                            shrink: true
                        }}
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
                    <Button variant="contained" onClick={handleSave}>
                        {t('common:saveChanges')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}