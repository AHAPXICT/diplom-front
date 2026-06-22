import {Avatar, Box, Chip, Paper, Typography} from "@mui/material";
import {Link} from "react-router";

export function CommentPaper() {
    return (
        <Paper elevation={0} sx={{p: 2, border: (theme) => `1px solid ${theme.palette.divider}`}}>
            <Box sx={{display: "flex", flexDirection: 'row', alignItems: 'start'}}>
                <Avatar sx={{width: 32, height: 32}}/>
                <Box sx={{mx: 2}}>
                    <Box sx={{display: "flex", flexDirection: 'row', alignItems: 'start'}}>
                        <Typography sx={{mr: 1}} variant='subtitle2' fontWeight='bold' textAlign='center'>Username</Typography>
                        <Typography variant='subtitle2' textAlign='center' color='textSecondary'>• time</Typography>
                    </Box>
                    <Typography variant='subtitle1'>comment</Typography>
                </Box>

            </Box>
        </Paper>
    );
}