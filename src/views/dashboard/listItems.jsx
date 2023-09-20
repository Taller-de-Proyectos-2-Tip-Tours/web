import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link } from 'react-router-dom';
import constants from '../../assets/constants';

export const mainListItems = (
  <React.Fragment>
    <Link to={constants.ROUTES.TOUR_LIST} style={{color:"white"}}>
      <ListItemButton>
        <ListItemIcon style={{color:"white"}}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Lista de Paseos" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);