import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box, Button, useMediaQuery, CardMedia } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { People, LocalHospital, FormatListBulleted, AttachMoney, ReceiptLong, Logout } from "@mui/icons-material";
import logo from "../assets/images/icon.png";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleLogout = () => {
localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: isSmallScreen ? 60 : 240,
          backgroundColor: "#000000", // Black
          color: "#ffffff", // White text
          position: "fixed",
          height: "100vh",
          zIndex: 1300,
          boxShadow: "none",
          opacity: 1,
          backdropFilter: "none",
          transition: "width 0.3s",
        },
      }}
    >
      <Box>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Link to="/">
            {isSmallScreen ? null : <CardMedia component="img" src={logo} sx={{ width: 100,borderRadius:20,padding:4 }} />}
          </Link>
        </Toolbar>
        <Divider sx={{ backgroundColor: "#ffffff" }} />
        <List sx={{ mt: 2, pl: isSmallScreen ? 0 : 4 }}>
          {[  
            { text: "Patients", icon: <People />, route: "/users" },
            { text: "Doctors", icon: <LocalHospital />, route: "/agents" },
            { text: "Appoiments", icon: <FormatListBulleted />, route: "/listings" },
            { text: "Sales", icon: <AttachMoney />, route: "/sold-properties" },
            { text: "Requests", icon: <ReceiptLong />, route: "/requests" },
          ].map((item, index) => (
            <ListItem key={index} disablePadding>
              <Link to={item.route} style={{ textDecoration: 'none', width: "100%" }}>
                <ListItemButton
                  sx={{
                    justifyContent: isSmallScreen ? "center" : "flex-start",
                    borderRadius: 2,
                    backgroundColor: location.pathname === item.route ? "#3CBDED" : "transparent",
                    color: location.pathname === item.route ? "#000000" : "#ffffff",
                    "&:hover": {
                      backgroundColor: location.pathname === item.route ? "#3CBDED" : "transparent",
                      color: location.pathname === item.route ? "#000000" : "#ffffff",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.route ? "#000000" : "#ffffff" }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isSmallScreen && <ListItemText primary={item.text} sx={{ color: location.pathname === item.route ? "#000000" : "#ffffff" }} />}
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <Box sx={{ padding: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            fullWidth={!isSmallScreen}
            onClick={handleLogout}
            sx={{
              backgroundColor: "#3CBDED", // Light Blue
              color: "#000000", // Black text
              width: isSmallScreen ? "50px" : "100%",
              padding: isSmallScreen ? "5px" : "10px",
            }}
            startIcon={!isSmallScreen && <Logout />}
          >
            {isSmallScreen ? <Logout /> : "Logout"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
