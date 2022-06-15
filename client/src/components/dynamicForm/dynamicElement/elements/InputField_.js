import React from "react";
import {TextField} from "@mui/material";
import styles from "../styles";
import {postData, setPostData} from "../../DynForm";
import {addToolTip} from "../DynElement";

const InputField_ = ({element, style}) => {

    let helperText = postData[element.element_id].msg;

    if (helperText === "" || helperText === undefined) {
        helperText = element.helper_text_id;
    }

    const mainElement = <TextField style={{...styles.tf, ...style}}
                                   id={element.element_id}
                                   name={element.element_id}
                                   margin={element.margin}
                                   label={element.text_id}
                                   value={postData[element.element_id].value}
                                   type={element.type}
                                   fullWidth
                                   error={postData[element.element_id].error}
                                   onChange={(e) => handleChange(e)}
                                   {...(element.element === "TA" && {multiline: true, rows: 4})}
                                   {...(element.variant !== "" && {variant: element.variant})}
                                   {...(element.required && {required: true})}
                                   {...(element.disabled && {disabled: true})}
                                   {...(element.readonly && {InputProps: {readOnly: true}})}
                                   {...(helperText !== "" && {helperText: helperText})}
    />;


    if (element.tooltip_id === "") {
        return (
            mainElement
        );
    } else {
        return (
            addToolTip(mainElement, element.tooltip_id)
        );
    }

    function handleChange(e) {
        let currentValue = e.target.value;

        if (element.type === "number") {
            currentValue = parseInt(currentValue);
        }

        let changedData = postData[element.element_id];
        // Fehlermeldungen ggf. entfernen
        Object.assign(changedData, {value: currentValue, error: false, msg: ""});
        setPostData({...postData, [element.element_id]: changedData});
    }

}


export default InputField_;