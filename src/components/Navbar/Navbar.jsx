import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export function ButtonAppBar() {
  return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chile3D
          </Typography>
          <Button color="inherit">Inicio</Button>
          <Button color="inherit">Servicios</Button>
          <Button color="inherit">Productos</Button>
          <Button color="inherit">Contacto</Button>
        </Toolbar>
      </AppBar>
  );
}
