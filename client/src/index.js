import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, createStore, compose} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index.js";
import {AppBar, Container, Typography} from "@mui/material";
import styles from "./styles";
import logo from "./images/reactlogo.svg";
import BasicTabs from "./TabPanel";



const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <Container maxWidth={"lg"} id={"App_Container"}>
            <AppBar style={styles.appBar} position={"static"} color={"inherit"}>
                <Typography style={styles.heading} variant={"h2"} align={"center"}>Dynamic Web Form</Typography>
                <img style={styles.image} src={logo} alt={"ReactLogo"} height={"60"}/>
            </AppBar>
            <BasicTabs/>
        </Container>
    </Provider>,
    document.getElementById("root")
);