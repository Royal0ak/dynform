import React from "react";
import {Typography} from "@mui/material";
import {addToolTip} from "../DynElement";
import ReactHtmlParser from "react-html-parser";

const Header_ = ({element, style}) => {

    if (element.variant === "") {
        element.variant = "h2";
    }

    let mainElement = <Typography style={style}
                                  variant={element.variant}
                                  margin={element.margin}
                                  id={element.element_id}>{ReactHtmlParser(element.text_id)}</Typography>;

    if (element.tooltip_id !== "") {
        mainElement = addToolTip(mainElement, element.tooltip_id);
    }

    return (
        mainElement
    );
}

export default Header_;