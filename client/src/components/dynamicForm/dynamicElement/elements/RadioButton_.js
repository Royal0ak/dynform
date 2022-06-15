import React from "react";
import {FormControlLabel, Radio} from "@mui/material";
import ReactHtmlParser from "react-html-parser";

const RadioButton_ = ({element, style}) => {


    return (
        <FormControlLabel
            label={ ReactHtmlParser (element.text_id)}
            {...(element.variant !== "" && {labelPlacement: element.variant})}
            control={
                <Radio
                    id={element.element_id}
                    value={element.element_id}
                    // onChange={(e) => setPostData({...postData, [element.element_id]: {value: e.target.checked}})}
                    {...(element.disabled && {disabled: true})}
                    style={style}
                />}
        />
    );
}

export default RadioButton_;