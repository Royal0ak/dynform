import React, {useState} from "react";
import DynElement from "./dynamicElement/DynElement.js";
import {useDispatch} from "react-redux";
import {isBase64} from "is-base64";
import styles from "./styles.js";
import {CircularProgress} from "@mui/material";
import SetupFormData from "./SetupFormData";
import {getMainByForm} from "../../actions/mainConfigActions";
import {getTextsByForm} from "../../actions/textConfigActions";
import {getImagesByForm} from "../../actions/imageConfigActions";
import {createForm} from "../../actions/formDataActions";

let stopSubmitting = false;
let parentIdMap = new Map();
let idMap = new Map();
let idArray = [];
let textIdMap = new Map();
let imageIdMap = new Map();
let defaultPostData;
let currentFormName;
let dispatch;

const DynForm = ({formName, stopSubmit}) => {
    let mainConfig = [];
    let textConfig = [];
    let imagesConfig = [];

    dispatch = useDispatch();
    [postData, setPostData] = useState(defaultPostData);

    const startUp = async () => {
        // Variablen zurücksetzen
        currentFormName = formName;
        parentIdMap = new Map();
        idMap = new Map();
        idArray = [];
        textIdMap = new Map();
        imageIdMap = new Map();
        defaultPostData = undefined;
        stopSubmitting = stopSubmit;

        mainConfig = await dispatch(getMainByForm(formName));
        textConfig = await dispatch(getTextsByForm(formName));
        imagesConfig = await dispatch(getImagesByForm(formName));

        // wichtige Variablen vorbereiten
        if (mainConfig !== undefined) {
            [parentIdMap, idMap, idArray, textIdMap, imageIdMap, defaultPostData] = SetupFormData(formName, mainConfig,textConfig,imagesConfig);
            resetForm();
        }
    };

    // Formular initialisieren/aktualisieren
    if (currentFormName !== formName) {
        startUp();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm();
    }

    return (
        !idArray.length ? <CircularProgress/> : (
            <form id={currentFormName} name={currentFormName} style={styles.form} autoComplete={"off"} noValidate
                  onSubmit={handleSubmit}>
                {
                    idArray.map(element => {
                            if (element.parent_id === "main") {
                                return <DynElement post={element}/>
                            }
                        }
                    )
                }
            </form>
        )
    )
}
export let postData, setPostData;
export default DynForm;

export function submitForm() {
    let success = false;
    if (!stopSubmitting && validateFormData()) {
        success = true;
        postData.standardData.submitDate = new Date();
        console.log(postData);

        const checkResponse = async () => {
            success = await dispatch(createForm(postData));
            // Nur wenn die Formulardaten in der Datenbank angelegt wurden, wird das Formular zurückgesetzt
            if (success) resetForm();
        };
        checkResponse();
    }
    return success;
}

function resetForm() {
    // Formulareingabedaten zurücksetzten
    setPostData(JSON.parse(JSON.stringify(defaultPostData)));
}

export function getChildren(elementId) {
    if (parentIdMap.has(elementId)) {
        return parentIdMap.get(elementId);
    } else {
        console.log("No Children Found for id: " + elementId);
        return false;
    }
}

export function getText(text_id) {
    return textIdMap.get(text_id);
}

export function getImage(image_id) {
    return imageIdMap.get(image_id);
}

export function getElementById(element_id) {
    if (idMap.has(element_id)) {
        return idMap.get(element_id);
    }
    return null;
}

function validateFormData() {
    let valid = true;
    let validationSuccess = true;

    for (const [key, value] of Object.entries(postData)) {
        const element = getElementById(key);
        let keyToChange = key;
        let newMSG = undefined;
        valid = true;

        if (element !== null) {

            switch (element.element) {
                case "TF":
                case "TA":
                    if (element.required && value.value === "") {
                        valid = false;
                        newMSG = {error: true, msg: "required"};
                    } else if (element.regex !== "") {
                        const regex = new RegExp(element.regex);
                        if (!regex.test(value.value)) {
                            valid = false;
                            newMSG = {error: true, msg: "failed Validation"};
                        }
                    }

                    if (valid && element.action === "compare" && value.value !== postData[element.action_value].value) {
                        valid = false;
                        newMSG = {error: true, msg: "Compare failed"};
                    }

                    if (valid && element.min !== undefined && element.min !== "") {
                        const minNum = parseInt(element.min);

                        if (element.type === "number") {
                            if (value.value < minNum) {
                                valid = false;
                                newMSG = {error: true, msg: "Number too low"};
                            }
                        } else {
                            if (value.value.length < minNum) {
                                valid = false;
                                newMSG = {error: true, msg: "not enough character"};
                            }
                        }
                    }

                    if (valid && element.max !== undefined && element.max !== "") {
                        const maxNum = parseInt(element.max);

                        if (element.type === "number") {
                            if (value.value > maxNum) {
                                valid = false;
                                newMSG = {error: true, msg: "Number too high"};
                            }
                        } else {
                            if (value.value.length > maxNum) {
                                valid = false;
                                newMSG = {error: true, msg: "too many character"};
                            }
                        }
                    }
                    break;
                case "CHB":
                    if (element.required && !value.value) {
                        let parentElement = getElementById(element.parent_id);

                        if (parentElement.element === "CHB_GRP") {
                            keyToChange = parentElement.element_id;
                        }
                        valid = false;
                        newMSG = {error: true, msg: "required"};
                    }
                    break;
                case "RADIO_GRP":
                    const radioButtons = getChildren(key);

                    if (radioButtons !== false) {
                        radioButtons.forEach(item => {
                                if (item.required && item.element_id !== value.value) {
                                    valid = false;
                                    newMSG = {error: true, msg: "required"};
                                }
                            }
                        );
                    }
                    break;
                case "DATE":
                case "DATETIME":
                case "TIME":
                    if (valid && element.min !== undefined && element.min !== "") {
                        const minDate = new Date(element.min);

                        if (minDate > value.value) {
                            valid = false;
                            newMSG = {error: true, msg: "Date too low"};
                        }
                    }

                    if (valid && element.max !== undefined && element.max !== "") {
                        const maxDate = new Date(element.max);

                        if (maxDate < value.value) {
                            valid = false;
                            newMSG = {error: true, msg: "Date too low"};
                        }
                    }
                    break;
                case "FILE":
                    if (value.value.hasOwnProperty("base64")) {
                        const fullMimeType = value.value.base64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
                        const fileSizeInBytes = ((value.value.base64.length - fullMimeType.length) * (3 / 4)) - 1;

                        try {
                            if (!isBase64(value.value.base64, {
                                mimeRequired: true,
                                allowEmpty: false
                            })) {
                                valid = false;
                                newMSG = {error: true, msg: "Failed Base64 Validation"};
                            }
                        } catch (e) {
                            valid = false;
                            newMSG = {error: true, msg: "Error in Base64 Validation"};
                        }


                        if (valid && element.type !== "") {
                            const allowedTypes = element.type.replace(/ +/g, "").split(",");

                            if (!allowedTypes.includes(fullMimeType)) {
                                valid = false;
                                newMSG = {error: true, msg: "Failed MimeType Validation"};
                            }
                        }

                        if (valid && element.max !== "" && fileSizeInBytes > parseInt(element.max)) {
                            valid = false;
                            newMSG = {error: true, msg: "File Size is too big"};
                        }

                        if (valid && element.min !== "" && fileSizeInBytes < parseInt(element.min)) {
                            valid = false;
                            newMSG = {error: true, msg: "File Size is too small"};
                        }
                    } else { //no file uploaded
                        if (element.required) {
                            valid = false;
                            newMSG = {error: true, msg: "File required"};
                        }
                    }


                    break;
                case "TABLE":
                    if (element.required && value.value === "") {
                        valid = false;
                        newMSG = {error: true, msg: "required"};
                    }
                    break;
                default:
                    break;
            }
        }
        // WUrde ein Fehler gefunden? Wenn ja, in den Formulardaten den Fehler speichern!
        if (!valid) {
            validationSuccess = false;
            let tmpPostData = postData[keyToChange];
            Object.assign(tmpPostData, newMSG)
            setPostData({...postData, [keyToChange]: tmpPostData});
        }
    }

    return validationSuccess;
}