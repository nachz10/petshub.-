import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  People,
  ShoppingCart,
  Menu,
  Dashboard as DashboardIcon,
  Logout,
  Support,
  Category,
  Pets,
  Medication,
  Schedule,
  FireTruck,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { useAuth } from "../context/authContext";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/users", label: "Users", icon: <People /> },
    { path: "/products", label: "Products", icon: <ShoppingCart /> },
    { path: "/categories", label: "Categories", icon: <Menu /> },
    {
      path: "/support",
      label: "Support Messages",
      icon: <Support />,
    },
    {
      path: "/product-types",
      label: "Product Types",
      icon: <Category />,
    },
    {
      path: "/animal-types",
      label: "Animal Types",
      icon: <Pets />,
    },
    {
      path: "/veterinarians",
      label: "Veterinarians",
      icon: <Medication />,
    },
    {
      path: "/appointments",
      label: "Appointments",
      icon: <Schedule />,
    },
    {
      path: "/orders",
      label: "Orders",
      icon: <FireTruck />,
    },
    {
      label: "Logout",
      icon: <Logout />,
      action: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    },
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          padding: theme.spacing(3),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
          ADMIN PANEL
        </Typography>
      </Box>

      <Box sx={{ padding: theme.spacing(2), flexGrow: 1 }}>
        {navItems.map((item) => (
          <Box
            component={item.path ? Link : "div"}
            to={item.path || undefined}
            onClick={item.action || undefined}
            key={item.label}
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: theme.spacing(1.5, 2),
                marginBottom: theme.spacing(1),
                borderRadius: theme.shape.borderRadius,
                backgroundColor:
                  location.pathname === item.path
                    ? theme.palette.action.selected
                    : "transparent",
                color:
                  location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                transition: "all 0.3s ease",
              }}
            >
              <Box sx={{ marginRight: theme.spacing(2) }}>
                {React.cloneElement(item.icon, {
                  color: location.pathname === item.path ? "primary" : "action",
                })}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: location.pathname === item.path ? "600" : "400",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          padding: theme.spacing(2),
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
