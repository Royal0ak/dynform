import React from "react";
import {Grid} from "@mui/material";
import {getChildren} from "../../DynForm";
import DynElement from "../DynElement";

const Item_ = ({element, style}) => {


    return (
        <Grid item id={element.element_id} style={style} xs={12} sm={parseInt(element.margin)}>
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

export default Item_;