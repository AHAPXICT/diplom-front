import {Button, Card, Checkbox, Container, Divider, FormControlLabel, Link, Stack, TextField, Typography} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"
import SiteMark from "../components/SiteMark.tsx";
import {useTranslation} from "react-i18next";
import { Link as RouterLink, useNavigate } from 'react-router';
import {api} from "../api.ts";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setUser} from "../store/userSlice.ts";

export default function Register() {
    const { t } = useTranslation('auth');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rememberMe, setRememberMe] = useState(false);


    type RegisterFormValues = {
        username: string;
        email: string;
        password: string;
        repeatPassword: string;
    };

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormValues>();



    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', {
                username,
                email,
                password
            });

            if (rememberMe) {
                localStorage.setItem('token', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
            }

            dispatch(setUser(data.user));
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container
            sx={{justifyContent: "center", alignItems: "center", display: "flex", minHeight: "100%", height: "90dvh"}}>
            <Card sx={{maxWidth: "450px", flex: 1, padding: "40px"}}>
                <Stack component='form' onSubmit={register} sx={{}}>
                    <SiteMark />
                    <Typography sx={{mt: 2, mb: 1}} component='h3' variant='h4'>{t('signUp')}</Typography>
                    <TextField value={username} onChange={(e) => setUsername(e.target.value)} variant='outlined' label={t('common:username')}/>
                    <TextField placeholder="email@mail.ru" value={email} onChange={(e) => setEmail(e.target.value)} variant='outlined' label={t('email')} autoComplete='email'/>
                    <TextField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="**********" variant='outlined' label={t('password')} autoComplete='password' type='password'/>
                    <FormControlLabel
                        control={<Checkbox value="Remember me"  checked={rememberMe}
                                           onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                        label={t('rememberMe')}
                    />
                    <Button sx={{marginTop: "10px"}} type='submit' variant='contained'>{t('signUp')}</Button>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>{t('common:or')}</Typography>
                    </Divider>
                    <Button startIcon={<GoogleIcon/>} variant="outlined">{t('signInGoogle')}</Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        {t('alreadyHaveAnAccount')}{' '}
                        <Link
                            component={RouterLink}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                            to={'/auth'}
                        >
                            {t('signIn')}
                        </Link>
                    </Typography>
                </Stack>
            </Card>
        </Container>
    )
}