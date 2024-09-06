import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16 }}>
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        onClick={handleClick}
        edge="start"
        sx={[
          {
            marginRight: 0,
          },
        ]}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick('/profile')}>Profile</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/family')}>Family</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/timeline')}>Timeline</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/uitest')}>UI Test</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('/logout')}>Logout</MenuItem>
      </Menu>
    </div>
  );
}