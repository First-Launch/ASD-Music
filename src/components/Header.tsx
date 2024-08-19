import React from "react";
import { Box, Typography } from "@mui/material";

interface PageHeadProps {
    backgroundImage: string;
    title: string;
}

const PageHead: React.FC<PageHeadProps> = ({ backgroundImage, title }) => {
    return (
        <Box
            sx={{
                width: "100%",
                height: "300px", // Adjust the height as needed
                backgroundImage: `linear-gradient(to right, #0542bfB3, #FFFFFFB3, #0542bfB3), url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h2" color="white" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '10px 20px', borderRadius: '8px' }}>
                {title}
            </Typography>
        </Box>
    );
};

export default PageHead;
