import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems.jsx';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

import classes from './Toolbar.css';
import Logo from '../../Logo/Logo.jsx';


const toolbar = props => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked} />
        <div className={classes.Logo}>
            <Logo />

        </div>
        <nav className={classes.DesktopOnly} >
            <NavigationItems /> 
        </nav>
    </header>
);

export default toolbar;