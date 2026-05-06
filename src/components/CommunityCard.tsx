import {Card, CardContent, Typography, Button, CardMedia, Chip, Box} from '@mui/material';
import {useTranslation} from "react-i18next";
import {formatNumber} from "../mainCode.ts";

export function CommunityCard() {
    const {t} = useTranslation('auth');
    return (
        <Card sx={{p: 0, backgroundColor: "background.paper"}} elevation={3}>
            <CardMedia
                component="img"
                height="auto"
                image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.Gt-JCqjl4zNednZzzyxrZAHaEK%3Fpid%3DApi&f=1&ipt=f2eaa939818f60cabed7a08b1548d6ca11df62744b857b0ff8996623f2691ea2&ipo=images"
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