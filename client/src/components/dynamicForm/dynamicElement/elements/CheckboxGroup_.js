import React from "react";
import {FormControl, FormGroup, FormHelperText, FormLabel} from "@mui/material";
import {getChildren, postData} from "../../DynForm";
import DynElement, {addToolTip} from "../DynElement";
import ReactHtmlParser from "react-html-parser";

const CheckboxGroup_ = ({element, style}) => {

    let helperText = postData[element.element_id].msg;

    if (helperText === "" || helperText === undefined) {
        helperText = element.helper_text_id;
    }

    const mainElement = <FormControl sx={{m: 3}} component="fieldset" variant="standard"
                                     error={postData[element.element_id].error}>
        {(element.text_id !== "" && <FormLabel component="legend">{ReactHtmlParser(element.text_id)}</FormLabel>)}
        <FormGroup id={element.element_id} sx={style}>
            {
                !getChildren(element.element_id) ? void (0) : (
                    getChildren(element.element_id).map(childElement => {
                            return <DynElement post={childElement}/>
                        }
                    ))
            }
        </FormGroup>
        {(helperText !== "" && <FormHelperText>{helperText}</FormHelperText>)}
    </FormControl>;

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

export default CheckboxGroup_;