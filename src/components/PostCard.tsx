    import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Typography
} from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import ReplyIcon from '@mui/icons-material/Reply';
import {useTranslation} from "react-i18next";
    import {formatNumber} from "../mainCode.ts";

export function PostCard() {
    const { t } = useTranslation('auth');

    return (
        <Card elevation={3} sx={{p: 0, display: 'flex', flexDirection: 'row', backgroundColor: 'background.paper'}}>
            <Box sx={{m: 0, backgroundColor: 'secondary.main', minWidth: 48, display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',}}>
                <IconButton size="small">
                    <KeyboardArrowUpIcon />
                </IconButton>

                <Typography variant="body2" fontWeight="bold">
                    {formatNumber(420412)}
                </Typography>

                <IconButton size="small">
                    <KeyboardArrowDownIcon />
                </IconButton>
            </Box>
            <Box>
                <CardContent>
                    <Box display="flex" flexDirection="row" alignItems='center' textAlign='center' gap={1} sx={{mb: 1}}>
                        <Avatar sx={{width: 24, height: 24}} />
                        <Chip sx={{ fontWeight: 'bold'}} label='fa;lsdkfjsadf' size='small' />
                        <Typography variant='subtitle2' textAlign='center' color='textSecondary'>Username</Typography>
                        <Typography variant='subtitle2' textAlign='center' color='textSecondary'>• time</Typography>
                    </Box>
                    <Typography component='h5' variant='subtitle1' sx={{fontSize: 20}} fontWeight='500'>Lorem ipsum</Typography>
                    <Typography variant='subtitle1' color='textSecondary'>Lorem ipsum so te soli ahtung sloivenia sasdfasdfalsjfajsd aksdjfas idjhfaskdjh askdjfh</Typography>
                </CardContent>

                <CardMedia component='img'
                           sx={{width: '100%', maxHeight: 'auto', objectFit: 'cover'}}
                           src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.ojRIuYHVLQkftd9PYHWqTAHaHa%3Fpid%3DApi&f=1&ipt=47e4356ed75010cfcd4582277a942674e1d15109df9525562befe9f9a5e744d7&ipo=images'
                           alt='photo not loaded' />
                <CardActions>
                    <Button sx={{color: 'text.secondary',  fontSize: 13, p: 0}} startIcon={<CommentIcon fontSize='small' sx={{color: 'text.secondary', width: 16, height: 16}} />}>412 {t('common:comments')}</Button>
                    <Button sx={{color: 'text.secondary',  fontSize: 13, p: 0}} startIcon={<ShareIcon fontSize='small' sx={{color: 'text.secondary', width: 16, height: 16}} />}>{t('common:share')}</Button>
                    <Button sx={{color: 'text.secondary',  fontSize: 13, p: 0}} startIcon={<ReplyIcon fontSize='small' sx={{color: 'text.secondary', width: 16, height: 16}} />}>{t('common:reply')}</Button>
                </CardActions>
            </Box>

        </Card>
    );
}