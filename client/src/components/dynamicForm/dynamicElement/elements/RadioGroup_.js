import React from "react";
import {FormControl, FormHelperText, FormLabel, RadioGroup} from "@mui/material";
import {getChildren, postData, setPostData} from "../../DynForm";
import DynElement from "../DynElement";

const RadioGroup_ = ({element, style}) => {

    const handleChangeRadio = (event) => {
        let changedData = postData[element.element_id];
        Object.assign(changedData, {value: event.target.value, error: false, msg: ""})
        setPostData({...postData, [element.element_id]: changedData})
    };

    let helperText = postData[element.element_id].msg;

    if (helperText === "" || helperText === undefined) {
        helperText = element.helper_text_id;
    }

    return (
        <FormControl sx={{m: 3}} variant={"standard"} style={style} error={postData[element.element_id].error}>
            {(element.text_id !== "" && <FormLabel component="legend">{element.text_id}</FormLabel>)}
            <RadioGroup value={postData[element.element_id].value} id={element.element_id} onChange={handleChangeRadio}>
                {
                    !getChildren(element.element_id) ? void (0) : (
                        getChildren(element.element_id).map(childElement => {
                                return <DynElement post={childElement}/>
                            }
                        ))
                }
            </RadioGroup>
            {(helperText !== "" && <FormHelperText>{helperText}</FormHelperText>)}
        </FormControl>
    );
}

export default RadioGroup_;