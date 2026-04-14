import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Home,
  AddCircle,
  MedicalServices,
  Person,
  Menu as MenuIcon,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 260;

const PatientLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuItems = [
    { path: '/patient', label: '首页', icon: <Home /> },
    { path: '/patient/symptom-submit', label: '症状提交', icon: <AddCircle /> },
    { path: '/patient/medical-records', label: '诊疗记录', icon: <MedicalServices /> },
    { path: '/patient/profile', label: '个人中心', icon: <Person /> },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      <Toolbar sx={{ borderBottom: '2px solid #E2E8F0', py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 8, height: 32, background: '#0066FF' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#0A0E27',
              letterSpacing: '0.02em',
            }}
          >
            MediCareAI
          </Typography>
        </Box>
      </Toolbar>

      <Box sx={{ px: 2, py: 3, borderBottom: '2px solid #E2E8F0' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 2,
            background: '#F0F4FF',
            border: '2px solid #E2E8F0',
          }}
        >
          <Avatar sx={{ bgcolor: '#0066FF', color: '#FFFFFF', width: 40, height: 40, fontWeight: 600 }}>
            {user?.full_name?.charAt(0) || '患'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ color: '#0A0E27', fontWeight: 600, mb: 0.25 }}>
              {user?.full_name || '患者'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#718096' }}>
              患者平台
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === '/patient'}
              sx={{
                py: 1.5,
                transition: 'all 0.2s',
                border: '2px solid transparent',
                '&.active': {
                  background: '#F0F4FF',
                  border: '2px solid #0066FF',
                  '& .MuiListItemIcon-root': { color: '#0066FF' },
                  '& .MuiListItemText-primary': { color: '#0066FF', fontWeight: 600 },
                },
                '&:hover': {
                  background: '#F5F7FA',
                  border: '2px solid #CBD5E0',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#4A5568' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  color: '#0A0E27',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#FFFFFF' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: '#FFFFFF',
          borderBottom: '2px solid #E2E8F0',
          boxShadow: 'none',
          color: '#0A0E27',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            患者平台
          </Typography>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#0066FF', color: '#FFFFFF', width: 36, height: 36, fontWeight: 600 }}>
              {user?.full_name?.charAt(0) || '患'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                border: '2px solid #E2E8F0',
                boxShadow: 'none',
              },
            }}
          >
            <MenuItem onClick={() => { navigate('/patient/profile'); handleMenuClose(); }}>
              <Person fontSize="small" sx={{ mr: 1.5, color: '#0066FF' }} />
              个人中心
            </MenuItem>
            <Divider sx={{ borderColor: '#E2E8F0', my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1.5, color: '#FF3366' }} />
              退出登录
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: '#FFFFFF',
              border: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: '#FFFFFF',
              border: 'none',
              borderRight: '2px solid #E2E8F0'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          background: '#F5F7FA',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PatientLayout;
