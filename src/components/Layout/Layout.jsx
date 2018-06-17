import React, { Fragment } from 'react';
import classes from './Layout.css';

const layout = (props) => (
    <Fragment >
        <div>
            ToolBar, SideDrawer, Backdrop 
            <main className={classes.Content}>
                {props.children}
            </main>
        </div>
    </Fragment >
);

export default layout;