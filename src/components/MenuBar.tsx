import {
    AppBar,
    Badge,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText, type SvgIconProps,
    Toolbar,
    useMediaQuery,
    useTheme
} from "@mui/material";
import SiteMark from "./SiteMark.tsx";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {useTranslation} from "react-i18next";
import {useState} from "react";
import type {LinkProps} from "react-router";
import { Link } from 'react-router';

type NavItem = {
    key: string;
    icon: React.ElementType<SvgIconProps>
    onClick: () => void;
    to: string;
};


export function MenuBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const {t} = useTranslation('auth');

    const navItems: NavItem[] = [
        {key: "common:home", icon: HomeIcon, onClick: () => console.log("Navigate to Home"), to: "/"},
        {key: "common:popular", icon: TrendingUpIcon, onClick: () => console.log("Navigate to Popular"), to: "/popular"},
        {key: "common:communities", icon: PeopleIcon, onClick: () => console.log("Navigate to Communities"), to: "/communities"},
        {key: "common:create", icon: AddIcon, onClick: () => console.log("Navigate to Communities"), to: "/create"},
    ];


    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setDrawerOpen(open);
        };

    const drawer = (
        <Box
            sx={{width: 250}}
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.key} disablePadding>
                        <ListItemButton component={Link as React.ElementType<LinkProps>} to={item.to}>
                            <ListItemText sx={{
                                "& .MuiListItemText-primary": {
                                    color: theme.palette.primary.contrastText,
                                },
                            }} primary={t(item.key)}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={toggleDrawer(true)}
                            sx={{mr: 2}}
                        >
                                <MenuIcon/>
                        </IconButton>
                    )}
                    <SiteMark/>
                    {!isMobile && (
                        <Box>
                            {navItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Button
                                        key={item.key}
                                        color="inherit"
                                        component={Link}
                                        to={item.to}
                                        startIcon={<Icon />}
                                    >
                                        {t(item.key)}
                                    </Button>
                                );
                            })}
                        </Box>
                    )}
                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={35} color="error">
                                <MailIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <Badge badgeContent={242} color="error">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            component={Link}
                            to={'/user'}
                            //onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <MoreIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer sx={{
                '& .MuiDrawer-paper': {
                    backgroundColor: theme.palette.primary.main,
                },
            }} anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawer}
            </Drawer>
        </>
    );
}