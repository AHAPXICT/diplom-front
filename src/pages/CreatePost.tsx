import {useTranslation} from "react-i18next";
import {Box, Button, Card, CardContent, FormControlLabel, MenuItem, Switch, TextField, Typography} from "@mui/material";
import { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import {BackToFeedButton} from "../components/BackToFeedButton.tsx";

const communities = [
    { value: "react", label: "React" },
    { value: "mui", label: "Material-UI" },
    { value: "javascript", label: "JavaScript" },
];

export function CreatePost() {
    const [community, setCommunity] = useState("");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
        if (e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const postData = {
            community,
            title,
            text,
            image,
        };
        console.log("Posting:", postData);
    };
    const {t} = useTranslation('auth');

    return (
        <Box>
        <BackToFeedButton />
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {t('common:createAPost')}
                </Typography>

                <TextField
                    select
                    fullWidth
                    label={t('common:chooseACommunity')}
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    margin="normal"
                >
                    {communities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    label={t('common:title')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    inputProps={{maxLength: 300}}
                    helperText={`${title.length}/300`}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label={t('common:description')}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    margin="normal"
                />

                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<ImageIcon/>}
                    sx={{mt: 1}}
                >
                    {t('common:addImage')}
                    <input type="file" hidden onChange={handleImageUpload}/>
                </Button>

                <Box sx={{display: "flex", justifyContent: "flex-end", mt: 2, gap: 1}}>
                    <Button variant="outlined" color="primary">
                        {t('common:cancel')}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        {t('common:create')}
                    </Button>
                </Box>
            </CardContent>
        </Card>
        </Box>
    );
}