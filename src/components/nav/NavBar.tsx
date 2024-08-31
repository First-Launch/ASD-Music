import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Dashboard, Settings, Person } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const NavBar: React.FC = () => {
  const { isAuthenticated, logout, currentUser } = useAuth(); // Access authentication context
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

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

  // Use navItems to decide which navigation items to show. Then map navItems
  // to create navigation links.
  var navItems = [];

  if (!isDashboardRoute) {
    navItems = [
      { text: "Events", path: "/events" },
      { text: "About", path: "/about" },
    ];

    if (isAuthenticated) {
      navItems.push({ text: "Dashboard", path: "/dashboard" });
    }
  } else {
    navItems = [
      { text: "Music", path: "/dashboard/music" },
      { text: "Instruments", path: "/dashboard/instruments" },
    ];
  }


  return (
    <AppBar position="static">
      <Toolbar>

      </Toolbar>
    </AppBar>





    // <Box>
    //   {!isMobile ? (
    //     // Top Navigation for Large Screens
    //     <AppBar position="static">
    //       <Toolbar>
    // <Typography variant="h6" component={Link} to="/" sx={{ color: "inherit", textDecoration: "none", flexGrow: 1 }}>
    //   ASD Music
    // </Typography>
    // {navItems.map((item, index) => (
    //   <Typography key={index} variant="inherit" color="inherit" component={Link} to={item.path} style={{ textDecoration: "none", marginLeft: "1rem" }}>
    //     {item.text}
    //   </Typography>
    // ))}
    //         {isAuthenticated ? (
    //           <>
    //             <IconButton color="inherit" onClick={handleMenuOpen}>
    //               <Avatar alt={currentUser?.displayName || undefined} src={currentUser?.photoURL || undefined} />
    //             </IconButton>
    //             <Menu
    //               anchorEl={anchorEl}
    //               open={Boolean(anchorEl)}
    //               onClose={handleMenuClose}
    //             >
    //               <MenuItem onClick={() => handleMenuClick('/dashboard/profile')}>Profile</MenuItem>
    //               <MenuItem onClick={() => handleMenuClick('/dashboard/settings')}>Settings</MenuItem>
    //               <MenuItem onClick={handleLogout}>Logout</MenuItem>
    //             </Menu>
    //           </>
    //         ) : (
    // <Typography variant="inherit" color="inherit" component={Link} to="/auth" style={{ textDecoration: "none", marginLeft: "1rem" }}>
    //   Login
    // </Typography>
    //         )}
    //       </Toolbar>
    //     </AppBar>
    //   ) : (
    //     // App Bar and Bottom Navigation for Small Screens in Dashboard
    //     isDashboardRoute && (
    //       <>
    //         <AppBar position="static">
    //           <Toolbar>
    //             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    //               Dashboard
    //             </Typography>
    //             {/* Add other actions like search, settings, etc., as needed */}
    //           </Toolbar>
    //         </AppBar>
    //         <BottomNavigation value={location.pathname} showLabels>
    //           <BottomNavigationAction label="Dashboard" icon={<Dashboard />} component={Link} to="/dashboard" value="/dashboard" />
    //           <BottomNavigationAction label="Profile" icon={<Person />} component={Link} to="/dashboard/profile" value="/dashboard/profile" />
    //           <BottomNavigationAction label="Settings" icon={<Settings />} component={Link} to="/dashboard/settings" value="/dashboard/settings" />
    //         </BottomNavigation>
    //       </>
    //     )
    //   )
    //   }
    // </Box >
  );
};

export default NavBar;
