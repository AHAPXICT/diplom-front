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
            styleOverrides: {
                root: {
                    padding: '10px'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        }
    }
});

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <Feed /> },
            // { path: "/popular", element: <PopularPage /> },
            { path: "/communities", element: <Communities /> },
            { path: "/create", element: <CreatePost /> },
            { path: "/user", element: <User /> },
        ],
    },
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <Auth /> },
            // { path: "/register", element: <RegisterPage /> },
        ],
    },
]);

function App() {

    return (
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
    )
}

export default App
