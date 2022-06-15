import React from "react";
import {addToolTip} from "../DynElement";



const Image_ = ({element, style}) => {

    const mainElement =  <img  id={element.element_id} src={element.value} alt={element.text_id} style={style}/>;

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

export default Image_;