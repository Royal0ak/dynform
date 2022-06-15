import React from "react";
import {Checkbox, FormControlLabel} from "@mui/material";
import {postData, setPostData} from "../../DynForm";
import ReactHtmlParser from "react-html-parser";

const Checkbox_ = ({element, style}) => {

    const handleChangeCheckbox = (event) => {
        let changedData = postData[element.element_id];
        Object.assign(changedData, {value: event.target.checked, error: false, msg: ""})
        setPostData({...postData, [element.element_id]: changedData, [element.parent_id]: {value: "", error: false, msg: ""}})
    };

    if (element.required && element.text_id.charAt(0) !== "*") {
        element.text_id = "*" + element.text_id;
    }

    return (
        <FormControlLabel
            label={ReactHtmlParser(element.text_id)}
            style={{textAlign: "left"}}
            {...(element.variant !== "" && {labelPlacement: element.variant})}
            control={
                <Checkbox
                    id={element.element_id}
                    onChange={(e) => handleChangeCheckbox(e)}
                    checked={postData[element.element_id].value}
                    {...(element.disabled && {disabled: true})}
                    style={style}
                    {...(element.required && {required: true})}
                />}
        />
    );
}

export default Checkbox_;