import React from "react";
import {Button} from "@mui/material";
import styles from "../styles";
import {addToolTip} from "../DynElement";
import html2pdf from "html2pdf.js/src";

const customActions = ["PDF"]

const Button_ = ({element, style}) => {

    if (element.variant === "") element.variant = "contained";

    const mainElement = <Button style={{...styles.buttonSubmit, ...style}}
                                id={element.element_id}
                                variant={element.variant}
                                color="primary"
                                onClick={() => {handleClick()}}
                                size="large"
                                margin={element.margin}
                                {...(!customActions.includes(element.action) && {type: element.action})}
                                fullWidth>{element.text_id}
    </Button>;

    if (element.tooltip_id === "") {
        return (
            mainElement
        );
    } else {
        return (
            addToolTip(mainElement, element.tooltip_id)
        );
    }


    function handleClick() {
        switch (element.action) {
            case "PDF":
                PDF();
                break;
            default:
                break;
        }
    }

    function PDF() {
        const elementId = element.action_value;
        var elementToPrint = document.getElementById(elementId);
        var opt = {
            margin: 1,
            filename: 'myfile.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().from(elementToPrint).set(opt).save();
    }


}

export default Button_;