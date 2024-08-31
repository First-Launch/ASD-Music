import React, { useEffect, useRef, useState } from "react";
import {
    useMediaQuery,
    useTheme,
    BottomNavigation,
    BottomNavigationAction,
    CssBaseline,
    Box,
    Paper,
    CircularProgress,
    Fade,
} from "@mui/material";
import { Dashboard, Settings, LibraryMusic, Piano } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import TitleBar from "../nav/TitleBar";

// PageLayout Component
interface PageLayoutProps {
    title: string;
    showTitleBar?: boolean; // Optional, default to true
    refreshable?: boolean; // Optional, determines if the page is refreshable
    refreshHandler?: () => void; // Optional, function to handle refresh
    isLoading?: boolean; // Optional, determines if the page is loading
    actions?: React.ReactNode; // Optional, additional actions to render in the Title
    children: React.ReactNode; // The main content of the page
}

const PageLayout: React.FC<PageLayoutProps> = ({
    title,
    showTitleBar = true,
    refreshable = false,
    refreshHandler,
    isLoading = false, // Default to false if not provided
    actions,
    children,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const contentRef = useRef<HTMLDivElement>(null);
    const [pullStart, setPullStart] = useState<number | null>(null);
    const [hasRefreshed, setHasRefreshed] = useState(false); // State to track if refresh has been called
    let location = useLocation();
    const [navValue, setNavValue] = useState<number | null>(null);

    useEffect(() => {
        // Set the browser document title
        document.title = title;

        if (location.pathname.startsWith("/dashboard/music"))
            setNavValue(1);
        else if (location.pathname.startsWith("/dashboard/instruments"))
            setNavValue(2);
        else if (location.pathname.startsWith("/dashboard/settings"))
            setNavValue(3);
        else
            setNavValue(0);
    }, [title, location.pathname]);

    // Handle pull-to-refresh logic
    const handleTouchStart = (event: TouchEvent) => {
        if (window.scrollY === 0) {
            setPullStart(event.touches[0].clientY);
            setHasRefreshed(false); // Reset refresh state on new touch
        }
    };

    const handleTouchMove = (event: TouchEvent) => {
        if (!refreshable || hasRefreshed || !pullStart) return;

        const currentY = event.touches[0].clientY;
        if (currentY > pullStart + 20) { // Trigger refresh with a small pull
            setHasRefreshed(true); // Prevent multiple refreshes
            if (refreshHandler) {
                refreshHandler();
            }
        }
    };

    const handleTouchEnd = () => {
        setPullStart(null);
    };

    // Add event listeners for touch events
    useEffect(() => {
        if (refreshable && contentRef.current) {
            const ref = contentRef.current;
            ref.addEventListener("touchstart", handleTouchStart);
            ref.addEventListener("touchmove", handleTouchMove);
            ref.addEventListener("touchend", handleTouchEnd);

            return () => {
                ref.removeEventListener("touchstart", handleTouchStart);
                ref.removeEventListener("touchmove", handleTouchMove);
                ref.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [refreshable, pullStart, hasRefreshed]); // Include hasRefreshed as a dependency

    return (
        <>
            <CssBaseline /> {/* Normalize CSS and set consistent baseline styles */}
            {/* Conditionally render the TitleBar */}
            {showTitleBar && (
                <TitleBar
                    showBack={false} // Customize as needed
                    title={title}
                    actions={actions}
                />
            )}

            {/* Main content area with loading indicator */}
            <Box ref={contentRef}
                sx={{
                    overflow: "hidden",
                    pb: isMobile ? 'calc(56px + env(safe-area-inset-bottom))' : 0 // Add padding to account for bottom nav height and safe area
                }}>

                {isLoading && ( // Use isLoading prop to show the spinner
                    <Box sx={{ display: "absolute", top: 0, left: 0, right: 0, zIndex: 9999 }}>
                        <Fade in={isLoading} easing={"ease-in-out"}>
                            <Box padding={0.5} borderRadius={5} display="flex" justifyContent="center" alignItems="center" sx={{ backgroundColor: "White" }}>
                                <CircularProgress size={24} /> {/* Spinner */}
                            </Box>
                        </Fade>
                    </Box>

                )}
                {children}
                {/* Add spacing for bottom nav bar */}
                {isMobile && (
                    <Box sx={{ height: 56 }} />
                )}
            </Box>

            {/* Bottom navigation for mobile devices */}
            {isMobile && location.pathname.startsWith("/dashboard") && (
                <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, pb: 2.5 }} elevation={3} >
                    <BottomNavigation showLabels value={navValue} onChange={(event, newValue) => { setNavValue(newValue); }}>
                        <BottomNavigationAction
                            label="Dashboard"
                            icon={<Dashboard />}
                            component={Link}
                            to="/dashboard"
                        />
                        <BottomNavigationAction
                            label="Music"
                            icon={<LibraryMusic />}
                            component={Link}
                            to="/dashboard/music"
                        />
                        <BottomNavigationAction
                            label="Instruments"
                            icon={<Piano />}
                            component={Link}
                            to="/dashboard/instruments"
                        />
                        <BottomNavigationAction
                            label="Settings"
                            icon={<Settings />}
                            component={Link}
                            to="/dashboard/settings"
                        />
                    </BottomNavigation>
                </Paper>
            )}
        </>
    );
};

export default PageLayout;
