import React from "react";
import {Grid} from "@mui/material";
import {getChildren} from "../../DynForm";
import DynElement from "../DynElement";

const Container_ = ({element, style}) => {


    return (
        <Grid container id={element.element_id} spacing={parseInt(element.margin)} style={style}>
            {
                !getChildren(element.element_id) ? void (0) : (
                    getChildren(element.element_id).map(childElement => {
                            return <DynElement post={childElement}/>
                        }
                    ))
            }
        </Grid>
    );
}

export default Container_;