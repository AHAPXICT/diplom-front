import './App.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Auth from "./pages/Auth.tsx";
import {MainLayout} from "./pages/MainLayout.tsx";
import {createBrowserRouter, RouterProvider} from "react-router";
import User from "./pages/User.tsx";
import { AuthLayout } from "./pages/AuthLayout.tsx";
import { Feed } from "./pages/Feed.tsx";
import { CreatePost } from "./pages/CreatePost.tsx";
import {Communities} from "./pages/Communities.tsx";
import {Popular} from "./pages/Popular.tsx";
import Register from "./pages/Register.tsx";
import {PostComments} from "./pages/PostComments.tsx";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import {GuestRoute} from "./components/GuestRoute.tsx";
import { useDispatch} from "react-redux";
import {useEffect} from "react";
import {setUser} from "./store/userSlice.ts";
import {api} from "./api.ts";

const theme = createTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#3f50b5',
            dark: '#002884',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f3f3f3',
            dark: '#cccccc',
            contrastText: '#000',
        },
    },
    components: {
        MuiStack: {
            styleOverrides: {
                root: {
                    gap: '10px'
                }
            }
        },
        MuiCard: {
            defaultProps: {
                elevation: 2
            },
            styleOverrides: {
                root: {
                    padding: '10px',
                },
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        },
    }
});


const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: "/", element: <Feed /> },
                    { path: "/popular", element: <Popular /> },
                    { path: "/communities", element: <Communities /> },
                    { path: "/create", element: <CreatePost /> },
                    { path: "/user/:username", element: <User /> },
                    { path: "/posts/:id/reply", element: <CreatePost /> },
                    { path: "/posts/:id", element: <PostComments /> }
                ]
            }
        ]
    },
    {
        element: <GuestRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: "/auth", element: <Auth /> },
                    { path: "/register", element: <Register /> }
                ]
            }
        ]
    }
]);

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (!token) return;

            try {
                const { data } = await api.get(
                    "/auth/me"
                );

                dispatch(setUser(data));
            } catch {
                localStorage.removeItem("token");
            }
        };

        fetchMe();
    }, []);

    return (
            <ThemeProvider theme={theme} >
                <CssBaseline />
                    <RouterProvider router={router} />
            </ThemeProvider>
    )
}

export default App
