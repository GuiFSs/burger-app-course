import React, { Component, Fragment } from 'react';
import Toolbar from '../Navigation/Toolbar/Toolbar.jsx';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer.jsx';

import classes from './Layout.css';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    sideDrawerToggleHandler = () => {
        this.setState(prevState => ({showSideDrawer: !prevState.showSideDrawer}))
    }

    render() {
        return (
            <Fragment >
                <div>
                    <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                    <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} />
                    <main className={classes.Content}>
                        {this.props.children}
                    </main>
                </div>
            </Fragment >
        );
    }
   
}
export default Layout;