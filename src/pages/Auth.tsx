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
import {Link as RouterLink, useNavigate} from 'react-router';
import {api} from "../api.ts";
import {useState} from "react";
import {setUser} from "../store/userSlice.ts";
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";
import {LanguageSwitcher} from "../components/LanguageSwitcher.tsx";

export function YandexIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#FC3F1D"/>
            <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">Я</text>
        </svg>
    );
}

export default function Auth() {
    const {t} = useTranslation('auth');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rememberMe, setRememberMe] = useState(false);

    type LoginForm = {
        email: string;
        password: string;
    }

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<LoginForm>();


    const onSubmit = async (formData: LoginForm) => {
        try {
            const { data } = await api.post('/auth/login', formData);

            if (rememberMe) {
                localStorage.setItem('token', data.token);
            } else {
                sessionStorage.setItem('token', data.token);
            }
            console.log(data)
            dispatch(setUser(data.user));

            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError('root.serverError', {
                type: 'server',
                message:
                    err.response?.data?.message ??
                    'Ошибка авторизации'
            });
        }
    };

    return (
        <Container
            sx={{justifyContent: "center", alignItems: "center", display: "flex", minHeight: "100%", height: "90dvh"}}>
            <Card sx={{maxWidth: "450px", flex: 1, padding: "40px"}}>
                <Stack component='form' autoComplete='on' sx={{}} onSubmit={handleSubmit(onSubmit)}>
                    <SiteMark/>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                        <Typography sx={{marginTop: "10px"}} component='h1' variant='h4'>{t('signIn')}</Typography>
                        <LanguageSwitcher />
                    </Box>

                    <TextField placeholder="email@mail.ru" variant='outlined'
                               error={!!errors.email}
                               helperText={errors.email?.message}
                               {...register('email', {
                                   required: t('common:enterEmail'),
                                   pattern: {
                                       value: /\S+@\S+\.\S+/,
                                       message: t('common:incorrectEmail')
                                   }
                               })}
                               label={t('email')}     autoComplete="username"/>
                    <TextField placeholder="**********" variant='outlined'
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
                              label={t('password')}
                               autoComplete='password' type='password'/>
                    <FormControlLabel
                        control={<Checkbox value="Remember me"  checked={rememberMe}
                                           onChange={(e) => setRememberMe(e.target.checked)} color="primary" />}
                        label={t('rememberMe')}
                    />
                    {errors.root?.serverError && (
                        <Typography color="error">
                            {errors.root.serverError.message}
                        </Typography>
                    )}
                    <Button sx={{marginTop: "10px"}} type='submit' variant='contained'>{t('signIn')}</Button>
                    <Divider>
                        <Typography sx={{color: 'text.secondary'}}>{t('common:or')}</Typography>
                    </Divider>
                    {/*<Button startIcon={<YandexIcon />} variant="outlined">*/}
                    {/*    {t('signInYandex')}*/}
                    {/*</Button>*/}
                    <Typography sx={{textAlign: 'center'}}>
                        {t('dontHaveAccount')}{' '}
                        <Link
                            component={RouterLink}
                            variant="body2"
                            sx={{alignSelf: 'center'}}
                            to={'/register'}
                        >
                            {t('signUp')}
                        </Link>
                    </Typography>
                </Stack>
            </Card>
        </Container>
    )
}