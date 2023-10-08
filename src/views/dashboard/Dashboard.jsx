import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import MainListItems from './listItems';
import { Route, Routes } from "react-router-dom";
import { ParallaxProvider } from 'react-scroll-parallax';
import DefaultLayout from '../../containers/DefaultLayout/DefaultLayout';
import Constants from '../../assets/constants';
import { useNavigate } from "react-router-dom";
import constants from '../../assets/constants';
// pages
import Home from '../pages/Home/Home';
import TourList from '../pages/ToursList/ToursList';
import CreateTour from '../pages/CreateTour/CreateTour';
import { Button, Image } from 'react-bootstrap';
import {signInWithGoogle, auth} from '../../services/googleAuth';
import EditTour from '../pages/EditarTour/EditTour';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Desarrollado para la materia Taller de Proyectos II - '}
      <Link color="inherit" href="https://www.fi.uba.ar/">
        Fiuba
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `100%`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      backgroundColor:'#BCBDBD',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const navigate = useNavigate();

  const goToHome = () => {  
    navigate(constants.ROUTES.HOME)
  }
  const onLogin = () =>{
    signInWithGoogle().then(()=>{
      navigate(constants.ROUTES.HOME)
      // window.location.reload(false);
      auth.authStateReady().then(()=>{
        setUser(auth.currentUser)
      })
    })
  }

  const [user,setUser] = useState(null)

  useEffect(()=>{
    auth.authStateReady().then(()=>{
      setUser(auth.currentUser)
    })
  },[])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={true} style={{backgroundColor:'#4E598C'}}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {user!==null&&<IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={goToHome}
              >
                <MenuIcon />
              </IconButton>}
              Tip Tours
            </Typography>
            {user!==null&&<Typography
              component="h1"
              variant="h6"
              color="inherit"
            >
              {user.displayName}
              <IconButton
              aria-label="open drawer"
              style={{marginLeft:8}}
              >
                <Image src={user.photoURL} style={{height:38,borderRadius:100}}></Image>
              </IconButton>
            </Typography>
            }
            {
                user==null&&
                <Typography
                component="h1"
                variant="h6"
                color="inherit"
                >
                  <Button style={{backgroundColor:'transparent',border:'none'}} onClick={onLogin}>
                    Login
                  </Button>
                </Typography>
            }
          </Toolbar>
        </AppBar>
        {user!==null&&<Drawer variant="permanent" open={true}>
          <Divider />
          <List component="nav" style={{backgroundColor:'#BCBDBD',marginTop:54}}>
            <MainListItems/>
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>}
        <Box
          component="main"
          sx={{
            
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container sx={{ mt: 4, mb: 4 }}>

            <ParallaxProvider>
              <DefaultLayout>
                <Routes>
                  <Route path={Constants.ROUTES.HOME} element={<Home />}></Route>
                  <Route path={Constants.ROUTES.TOUR_LIST} element={<TourList />}></Route>
                  <Route path={Constants.ROUTES.EDIT_LIST} element={<EditTour />}></Route>
                  <Route path={Constants.ROUTES.NEW_TOUR} element={<CreateTour />}></Route>
                  <Route path='*' element={<Home />} />
                </Routes>
              </DefaultLayout>
            </ParallaxProvider>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
