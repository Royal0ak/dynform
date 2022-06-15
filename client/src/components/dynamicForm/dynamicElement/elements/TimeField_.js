import React from "react";
import {TextField} from "@mui/material";
import styles from "../styles";
import {postData, setPostData} from "../../DynForm";
import {LocalizationProvider, TimePicker} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

const TimeField_ = ({element, style}) => {

    let helperText = postData[element.element_id].msg;

    if (helperText === "" || helperText === undefined) {
        helperText = element.helper_text_id;
    }
    
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
                id={element.element_id}
                minDate={new Date(element.min)}
                maxDate={new Date(element.max)}
                label={element.text_id}
                value={postData[element.element_id].value}
                onChange={(e) => setPostData({...postData, [element.element_id]: {value: e}})}
                renderInput={(params) =>
                    <TextField
                        error={postData[element.element_id].error}
                        {...(helperText !== "" && {helperText: helperText})}
                        style={styles.tf}
                        {...params}
                        sx={style}
                        color={"error"}
                        fullWidth/>}
            />
        </LocalizationProvider>
    );
}

export default TimeField_;