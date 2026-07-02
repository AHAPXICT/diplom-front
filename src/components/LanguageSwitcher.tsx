import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        handleClose();
    };

    return (
        <>
            <IconButton onClick={handleOpen} color="inherit">
                <LanguageIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => changeLanguage('ru')}
                    selected={i18n.language === 'ru'}
                >
                    Русский
                </MenuItem>
                <MenuItem
                    onClick={() => changeLanguage('en')}
                    selected={i18n.language === 'en'}
                >
                    English
                </MenuItem>
            </Menu>
        </>
    );
}