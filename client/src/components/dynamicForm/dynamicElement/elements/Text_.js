import React from "react";
import {Typography} from "@mui/material";
import {addToolTip} from "../DynElement";
import ReactHtmlParser from "react-html-parser";



const Text_ = ({element, style}) => {

    const mainElement = <Typography id={element.element_id} margin={element.margin} variant={element.variant} style={style}>{ ReactHtmlParser (element.text_id)}</Typography>;

    if (element.tooltip_id === "") {
        return (
            mainElement
        );
    } else {
        return (
            addToolTip(mainElement, element.tooltip_id)
        );
    }
}

export default Text_;