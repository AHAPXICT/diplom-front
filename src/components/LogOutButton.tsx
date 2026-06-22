import { useNavigate } from "react-router";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LogOutButton() {

    const navigate = useNavigate();

    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        setOpen(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/auth");
    };
    return (
        <>
            <Button sx={{alignSelf: "center"}} variant='outlined' onClick={handleLogout}>
                {t('common:exitAccount')}
            </Button>
            <LogoutModal
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
function LogoutModal({
                                        open,
                                        onClose,
                                        onConfirm,
                                    }: LogoutModalProps) {
    const { t } = useTranslation();
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LogoutIcon />
                {t('common:exitAccount')}
            </DialogTitle>

            <DialogContent>
                <Typography>
                    {t('common:sureExitAccount')}
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    {t('common:cancel')}
                </Button>

                <Button onClick={onConfirm} color="error" variant="contained">
                    {t('common:yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}