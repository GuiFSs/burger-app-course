import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem.jsx';
import classes from "./NavigationItems.css";

const navigationItems = props => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" >Burger Builder</NavigationItem>
        <NavigationItem link="/orders" >Orders</NavigationItem>
    </ul>
); 

export default navigationItems;