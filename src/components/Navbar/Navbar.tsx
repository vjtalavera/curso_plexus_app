import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(11, 31, 44, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
          Gestor de Tareas ICE
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
