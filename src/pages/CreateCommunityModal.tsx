import {type ChangeEvent, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {api} from "../api.ts";

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

type CommunityForm = {
    name: string;
    description: string;
};

export function CreateCommunityModal({ open, onClose, onCreate,}: Props) {
    const {t} = useTranslation('auth');

    const [image, setImage] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<CommunityForm>();

    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert(t('common:imageMaxSize', {count: 10}));
            return;
        }

        setImage(file);
    };

    const handleCreate = async (
        data: CommunityForm
    ) => {
        try {

            const formData = new FormData();

            formData.append("name", data.name);
            formData.append(
                "description",
                data.description || ""
            );

            if (image) {
                formData.append(
                    "communityImage",
                    image
                );
            }

            const response = await api.post(
                "/communities",
                formData
            );

            onCreate(response.data);

            reset();
            setImage(null);

            onClose();

        } catch (err: any) {

            const message = err.response?.data?.message;

                console.log(err)
                console.log(message)
            setError("root", {
                type: "server",
                message:
                    message || t('common:communityCreateError')
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('common:createACommunity')}</DialogTitle>

            <DialogContent>
                <TextField
                    label={t('common:name')}
                    fullWidth
                    margin="normal"

                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register("name", {
                        required: t('common:enterName'),
                        minLength: {
                            value: 3,
                            message: t('common:minSymbols', { count: 3 })
                        },
                        maxLength: {
                            value: 50,
                            message: t('common:maxSymbols', { count: 50 })
                        }
                    })}
                />

                <TextField
                    label={t('common:description')}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"

                    error={!!errors.description}
                    helperText={errors.description?.message}

                    {...register("description", {
                        maxLength: {
                            value: 500,
                            message: t('common:maxSymbols', {count: 500})
                        }
                    })}
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
            {errors.root && (
                <Typography color="error">
                    {errors.root.message}
                </Typography>
            )}
            <DialogActions>
                <Button onClick={onClose}>{t('common:cancel')}</Button>
                <Button variant="contained"  onClick={handleSubmit(handleCreate)}
                        disabled={isSubmitting}>
                    {t('common:create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}