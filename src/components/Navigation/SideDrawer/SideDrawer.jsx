import React from 'react'
import Logo from '../../Logo/Logo.jsx';
import NavigationItems from '../NavigationItems/NavigationItems.jsx';
import Backdrop from '../../UI/Backdrop/Backdrop';

import classes from "./SideDrawer.css";

const sideDrawer = props => {
    const attachedClasses = [classes.SideDrawer];
    if (props.open) {
        attachedClasses.push(classes.Open);
    }else {
        attachedClasses.push(classes.Close);
    }
    return (
        <React.Fragment >
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachedClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </React.Fragment>
    );
}; 

export default sideDrawer;