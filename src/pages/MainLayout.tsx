import {Box, Container} from "@mui/material";
import {MenuBar} from "../components/MenuBar.tsx";
import { Outlet } from "react-router";

export function MainLayout() {
    return (
        <>
            <MenuBar />
            <Container
                sx={{pt: 4, justifyContent: "center", minHeight: "100%", height: "90dvh"}}>
                <Outlet />
            </Container>
        </>
    );
}