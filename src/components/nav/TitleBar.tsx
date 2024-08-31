import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    useMediaQuery,
    useTheme,
    CssBaseline,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Drawer,
    Divider,
} from "@mui/material";
import { ArrowBack, LibraryMusic, Piano } from "@mui/icons-material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import MenuIcon from '@mui/icons-material/Menu';
import { Event, Info, Dashboard, Login } from '@mui/icons-material';

// Actions are an array of React nodes
interface TitleBarProps {
    showBack: boolean;
    title: string;
    actions?: React.ReactNode;
    showDrawer?: boolean;
}

// Use props for showBack, title, actions
const TitleBar: React.FC<TitleBarProps> = ({ showBack, title, actions, showDrawer }) => {
    const { isAuthenticated, logout, currentUser } = useAuth(); // Access authentication context
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const location = useLocation();
    const navigate = useNavigate();
    var navItems: { text: string; path: string; icon: React.ReactNode }[] = [];
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerState, setDrawerState] = useState(false);


    const handleLogout = () => {
        logout();
        navigate("/"); // Redirect to home page after logout
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (path: string) => {
        handleMenuClose();
        navigate(path);
    };

    if (location.pathname == "/") {
        navItems = [
            { text: "Events", path: "/events", icon: <Event /> },
            { text: "About", path: "/about", icon: <Info /> },
        ];

        if (isAuthenticated) {
            navItems.push({ text: "Dashboard", path: "/dashboard", icon: <Dashboard /> });
        } else {
            if (isMobile) {
                navItems.push({ text: "Student Login", path: "/auth", icon: <Login /> });
            }
        }

        actions = (
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => { setDrawerState(true) }}
                edge="end"
            >
                <MenuIcon />
            </IconButton>
        );

        showDrawer = true;
    } else if (location.pathname.startsWith("/dashboard")) {
        navItems = [
            { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
            { text: "Music", path: "/dashboard/music", icon: <LibraryMusic /> },
            { text: "Instruments", path: "/dashboard/instruments", icon: <Piano /> },
        ];
    }

    return (
        <>
            <CssBaseline /> {/* Normalize CSS and set consistent baseline styles */}
            <AppBar position="fixed"> {/* Set AppBar to fixed position */}
                <Toolbar>
                    {isMobile ? (
                        <>
                            {showBack && (
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="back"
                                    onClick={() => navigate(-1)} // Navigate back to the previous page
                                >
                                    <ArrowBack />
                                </IconButton>
                            )}
                            <Typography variant="h6" style={{ flexGrow: 1 }}>
                                {title}
                            </Typography>
                            {/* Render actions for mobile */}
                            {actions}
                        </>
                    ) : (
                        // Layout for desktop
                        <>
                            {showBack && (
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="back"
                                    onClick={() => navigate(-1)} // Navigate back to the previous page
                                >
                                    <ArrowBack />
                                </IconButton>
                            )}
                            <Typography variant="h6" component={Link} to="/" sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}>
                                ASD Music
                            </Typography>
                            {navItems?.map((item, index) => (
                                <Typography key={index} variant="inherit" color="inherit" component={Link} to={item.path} style={{ textDecoration: "none", marginLeft: "1rem" }}>
                                    {item.text}
                                </Typography>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <IconButton color="inherit" onClick={handleMenuOpen} sx={{ ml: 1 }}>
                                        <Avatar alt={currentUser?.displayName || undefined} src={currentUser?.photoURL || undefined} />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => handleMenuClick('/dashboard/profile')}>Profile</MenuItem>
                                        <MenuItem onClick={() => handleMenuClick('/dashboard/settings')}>Settings</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Typography variant="inherit" color="inherit" component={Link} to="/auth" style={{ textDecoration: "none", marginLeft: "1rem" }}>
                                    Login
                                </Typography>
                            )}
                        </>
                    )}
                </Toolbar>
            </AppBar >
            {/* Spacer div to push content below AppBar */}
            < Box component="div" sx={theme.mixins.toolbar} />
            <Drawer anchor="right" open={drawerState} onClose={() => { setDrawerState(false) }}>
                <Box sx={{ width: 250 }} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Avatar alt={currentUser?.displayName || "Warrior Logo"} src={currentUser?.photoURL || "/assets/warrior_head_logo.png"} sx={{ mt: 4, width: 125, height: 125 }} />
                    <Typography variant="h6" sx={{ mt: 2 }}>{currentUser?.displayName || "Guest"}</Typography>
                    <Divider sx={{ width: "100%", mt: 2 }} />

                    {navItems.map((item, index) => (
                        <Box
                            key={index}
                            component={Link}
                            to={item.path}
                            style={{ textDecoration: "none" }}
                            display={"flex"}
                            gap={1}
                            flexDirection={"row"}
                            alignItems={"center"}
                            justifyContent={"flex-start"}
                            fontSize={"1.6rem"}
                            width={"100%"}
                            mt={1}
                            ml={4}
                        >
                            {item.icon}
                            {item.text}
                        </Box>
                    ))}
                </Box>
            </Drawer>
        </>
    );
};

export default TitleBar;
