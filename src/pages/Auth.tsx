import {Button, Card, Checkbox, Container, Divider, FormControlLabel, Link, Stack, TextField, Typography} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"
import SiteMark from "../components/SiteMark.tsx";
import {useTranslation} from "react-i18next";

export default function Auth() {
    const { t } = useTranslation('auth');
    return (
        <Container
            sx={{justifyContent: "center", alignItems: "center", display: "flex", minHeight: "100%", height: "90dvh"}}>
            <Card sx={{maxWidth: "450px", flex: 1, padding: "40px"}}>
                <Stack component='form' sx={{}}>
                    <SiteMark />
                    <Typography sx={{marginTop: "10px"}} component='h1' variant='h4'>{t('signIn')}</Typography>
                    <TextField placeholder="email@mail.ru" variant='outlined' label={t('email')} autoComplete='email'/>
                    <TextField placeholder="**********" variant='outlined' label={t('password')} autoComplete='password' type='password'/>
                    <FormControlLabel
                        control={<Checkbox value="Remember me" color="primary" />}
                        label={t('rememberMe')}
                    />
                    <Button sx={{marginTop: "10px"}} variant='contained'>{t('signIn')}</Button>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>{t('common:or')}</Typography>
                    </Divider>
                    <Button startIcon={<GoogleIcon/>} variant="outlined">{t('signInGoogle')}</Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        {t('dontHaveAccount')}{' '}
                        <Link
                            href="/material-ui/getting-started/templates/sign-in/"
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            {t('signUp')}
                        </Link>
                    </Typography>
                </Stack>
            </Card>
        </Container>
    )
}