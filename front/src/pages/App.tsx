/* eslint-disable react/jsx-key */

import { Link, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

function App(): JSX.Element {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SSW 人事管理システム
            </Typography>
            <Button color="inherit" component={Link} to={`/`}>
              名簿
            </Button>
            <Button color="inherit" component={Link} to={`/organisations`}>
              組織図
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}

export default App;
