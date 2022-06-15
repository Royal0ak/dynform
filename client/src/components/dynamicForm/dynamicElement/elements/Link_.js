import React from "react";
import {Link} from "@mui/material";
import {addToolTip} from "../DynElement";
import ReactHtmlParser from 'react-html-parser';

const Link_ = ({element, style}) => {

    const mainElement = <Link id={element.element_id}
                              href={element.action_value}
                              fullWidth
                              {...(element.variant !== "" && {variant: element.variant})}
                              style={style}
    >{ ReactHtmlParser (element.text_id)}</Link>;

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

export default Link_;