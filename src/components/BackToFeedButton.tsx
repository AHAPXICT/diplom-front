import {Button} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {useTranslation} from "react-i18next";
import {Link} from "react-router";

export function BackToFeedButton() {
    const {t} = useTranslation('auth');

    return (
        <Button
            startIcon={<KeyboardBackspaceIcon />}
            component={Link}
            to={'/'}
        >
            {t('common:backToFeed')}
        </Button>
    );
}