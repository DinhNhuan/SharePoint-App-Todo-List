import { AppBar, Theme, Toolbar } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";

import * as React from 'react';
import { Link } from 'react-router-dom';
import { getSP } from "../../pnpjsConfig";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
            textDecoration: 'none',
            color: "#fff"

        },
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
    }),
);

const NavigationBar: React.FC = () => {
    const classes = useStyles();
    const [user, setUser] = React.useState("")


    React.useEffect(() => {
        const getCurrentUser = async () => {

            try {
                const _sp: SPFI = getSP();
                const user = await _sp.web.currentUser();
                setUser(user.Title);
            } catch (error) {
                console.log(error);
            }
        };
        getCurrentUser();
    }, []);

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Link to="/todo-form" className={classes.menuButton} color="inherit" > Add item </Link>
                    <Link to="/todo-list" className={classes.menuButton} color="inherit" > Todo List </Link>
                    {user}
                </Toolbar>


            </AppBar>

        </div>
    );
}

export default NavigationBar;
