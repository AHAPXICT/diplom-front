import {
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    Divider,
    FormControlLabel,
    Link,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"
import SiteMark from "../components/SiteMark.tsx";
import {useTranslation} from "react-i18next";
import { Link as RouterLink, useNavigate } from 'react-router';
import {api} from "../api.ts";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setUser} from "../store/userSlice.ts";
import {useForm} from "react-hook-form";
import {YandexIcon} from "./Auth.tsx";
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx";

export default function Register() {
    const { t } = useTranslation('auth');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rememberMe, setRememberMe] = useState(false);


    type RegisterFormValues = {
        username: string;
        email: string;
        password: string;
    };

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<RegisterFormValues>();

    const onSubmit = async (formData: RegisterFormValues) => {
        try {
            const { data } = await api.post('/auth/register', formData);

            if (rememberMe) {
                localStorage.setItem('token', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
            }

            dispatch(setUser(data.user));

            navigate('/');
        } catch (err: any) {
            console.log(err.response);
            const message = err.response?.data?.message;

            if (message?.includes('email')) {
                setError('email', {
                    type: 'server',
                    message
                });
            }
            else if (message?.includes('username')) {
                setError('username', {
                    type: 'server',
                    message
                });
            }
            else {
                setError('root', {
                    type: 'server',
                    message: message || 'Ошибка регистрации'
                });
            }
        }
    };

    return (
        <Container
            sx={{justifyContent: "center", alignItems: "center", display: "flex", minHeight: "100%", height: "90dvh"}}>
            <Card sx={{maxWidth: "450px", flex: 1, padding: "40px"}}>
                <Stack autoComplete='on' component='form' onSubmit={handleSubmit(onSubmit)} sx={{}}>
                    <SiteMark />
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography sx={{marginTop: "10px"}} component='h1' variant='h4'>{t('signUp')}</Typography>
                        <LanguageSwitcher />
                    </Box>
                    <TextField
                        {...register('username', {
                            required: t('common:enterUsername'),
                            minLength: {
                                value: 3,
                                message: t('common:minSymbols', {count: 3})
                            },
                            maxLength: {
                                value: 32,
                                message: t('common:maxSymbols', {count: 32})
                            }
                        })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        variant='outlined'
                        label={t('common:username')}/>
                    <TextField placeholder="email@mail.ru"
                               error={!!errors.email}
                               helperText={errors.email?.message}
                               {...register('email', {
                                   required: t('common:enterEmail'),
                                   pattern: {
                                       value: /\S+@\S+\.\S+/,
                                       message: t('common:incorrectEmail')
                                   }
                               })}
                               variant='outlined' label={t('email')}   autoComplete="username" />
                    <TextField
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password', {
                            required: t('common:enterPassword'),
                            minLength: {
                                value: 8,
                                message: t("common:minSymbols", { count: 8 })
                            },
                            maxLength: {
                                value: 64,
                                message: t("common:maxSymbols", { count: 64 })
                            }
                        })}
                        placeholder="**********" variant='outlined' label={t('password')} autoComplete='password' type='password'/>
                    <FormControlLabel
                        control={<Checkbox value="Remember me"  checked={rememberMe}
                                           onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                        label={t('rememberMe')}
                    />
                    {errors.root && (
                        <Typography color="error">
                            {errors.root.message}
                        </Typography>
                    )}
                    <Button sx={{marginTop: "10px"}} type='submit' variant='contained'>{t('signUp')}</Button>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>{t('common:or')}</Typography>
                    </Divider>
                    {/*<Button startIcon={<YandexIcon />} variant="outlined">*/}
                    {/*    {t('signInYandex')}*/}
                    {/*</Button>*/}
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