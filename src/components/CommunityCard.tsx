import {Card, CardContent, Typography, Button, CardMedia, Chip, Box} from '@mui/material';
import {useTranslation} from "react-i18next";
import {formatNumber} from "../mainCode.ts";

export function CommunityCard() {
    const {t} = useTranslation('auth');
    return (
        <Card sx={{p: 0}}>
            <CardMedia
                component="img"
                height="auto"
                image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fai-machine-learning-hands-robot-human-touching-big-data-network-connection-background-science-artificial-intelligence-technology-innovation-futuristic_999327-86059.jpg%3Fw%3D2000&f=1&nofb=1&ipt=82bbc0bd8fcc718c24749d9184c64d005357c989e6ba31e53afe988acf1256bf"
                alt="CardImage"
                sx={{
                    width: '100%',
                    objectFit: 'cover',
                    height: 120,
                }}
            />
            <CardContent sx={{pb: 0}}>
                <Typography variant="h6" component="div">
                    r/Technology
                </Typography>
                <Typography variant="body2" sx={{mt: 1, mb: 2}} color="text.secondary">
                    All things tech - news, discussions, and debates
                </Typography>
                <Box display='flex' alignItems='center' flexDirection='row' justifyContent='space-between'>
                    <Chip variant="outlined" sx={{color: 'primary.main', borderColor: 'primary.main'}} label={formatNumber(421234) + ' ' + t('common:members')} />
                    <Button
                        variant="contained"
                        sx={{
                            width: '30%',
                        }}
                    >
                        {t('common:joinCommunity')}
                    </Button>
                </Box>

            </CardContent>
        </Card>
    );
}