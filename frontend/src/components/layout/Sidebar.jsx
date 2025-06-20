import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Toolbar 
} from '@mui/material';
import { appRoutes } from '../../config/routes';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ open, isMobile, setSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={() => isMobile && setSidebarOpen(false)}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar /> {/* Thêm Toolbar để căn chỉnh */}
      <List>
        {appRoutes.map((route) => (
          <ListItem 
            button 
            key={route.path}
            onClick={() => navigate(route.path)}
          >
            <ListItemIcon>{/* Icon tương ứng */}</ListItemIcon>
            <ListItemText primary={route.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;