import PostFormData from "../models/postFormData.js";
import MainConfig from "../models/postMainConfig.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {isBase64} from "is-base64";


// Dynamisches Formular absenden
export const createFormData = async (req, res) => {
    let parentIdMap = new Map();
    let idMap = new Map();

    const post = req.body;
    const newPost = new PostFormData(post);
    const {formName} = post.standardData;
    const ajv = new Ajv();
    addFormats(ajv); // ajv-Formats hinzufügen

    try {
        const mainConfig = await MainConfig.find({form_id: formName});

        if (mainConfig.length > 0) {
            // Config vorbereiten
            [parentIdMap, idMap] = prepareMainConfig(mainConfig);
        } else {
            throw new Error("Cant find mainConfig Data for " + formName);
        }

        //JSON-Schema erstellen
        const schema = createJsonSchema(mainConfig, parentIdMap, idMap);
        // JSON-Schema Validierung
        const validate = ajv.compile(schema);

        let valid = validate(post);
        if (!valid) {
            const errMsg = validate.errors[0].message + " " + validate.errors[0].instancePath;
            throw new Error(errMsg);
        } else {
            console.log("Server - JSON-Schema Validation - Success!")
        }

        // Manuelle Validierung
        valid = manualValidation(post, mainConfig, parentIdMap, idMap);
        if (!valid) {
            console.log("Server - manual Validation - Failed!")
            throw new Error("Failed manual Validation");
        } else {
            console.log("Server - manual Validation - Success!")
        }

        await newPost.save();
        console.log("createFormData! - Server");
        res.status(201).json(newPost);
    } catch (error) {
        console.log(error.message);
        res.status(409).json({message: error.message});
    }
}

// Get formData
export const getFormData = async (req, res) => {
    try {
        const formData = await PostFormData.find();
        console.log("getFormData! - Server");
        res.status(200).json(formData);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}


function createJsonSchema(config, parentIdMap, idMap) {
    let requiredProperties = [];
    const oneMinuteAgo = new Date(Date.now() - 1000 * 60).toISOString().split(".")[0];
    const inOneMinute = new Date(Date.now() + 1000 * 60).toISOString().split(".")[0];

    let properties = {
        standardData: {
            type: "object",
            properties: {
                formName: {type: "string"},
                submitDate: {
                    type: "string",
                    format: "date-time",
                    formatMinimum: oneMinuteAgo,
                    formatMaximum: inOneMinute
                }
            },
            required: ["formName", "submitDate"],
            additionalProperties: false
        }
    };

    for (const key in config) {
        const configRow = config[key];
        const valueFields = ["TF", "TA", "DATE", "DATETIME", "TIME", "CHB", "RADIO_GRP", "FILE", "CHB_GRP", "TABLE"];

        if (config.hasOwnProperty(key) && valueFields.includes(configRow.element)) {

            requiredProperties.push(configRow.element_id);

            let propType = "string";
            let property;

            switch (configRow.element) {
                case "TF":
                case "TA":
                    if (configRow.type === "number") {
                        if (configRow.required) {
                            propType = "number";
                        } else {
                            propType = ["number", "null"];
                        }
                    }

                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {value: {type: propType}, error: {type: "boolean", const: false}, msg: {type: "string"}},
                            required: ["value"],
                            additionalProperties: false
                        }
                    };

                    if (configRow.regex !== undefined && configRow.regex !== "" && configRow.type !== "number") {
                        property[configRow.element_id].properties.value.pattern = configRow.regex;
                    }

                    if (configRow.required) {
                        Object.assign(property[configRow.element_id].properties.value, {not: {const: ""}})
                    }

                    if (configRow.type === "number") {
                        if (configRow.max !== undefined && configRow.max !== "") {
                            Object.assign(property[configRow.element_id].properties.value, {maximum: parseInt(configRow.max)})
                        }

                        if (configRow.min !== undefined && configRow.min !== "") {
                            Object.assign(property[configRow.element_id].properties.value, {minimum: parseInt(configRow.min)})
                        }
                    } else {
                        if (configRow.max !== undefined && configRow.max !== "") {
                            Object.assign(property[configRow.element_id].properties.value, {maxLength: parseInt(configRow.max)})
                        }

                        if (configRow.min !== undefined && configRow.min !== "") {
                            Object.assign(property[configRow.element_id].properties.value, {minLength: parseInt(configRow.min)})
                        }
                    }

                    break;
                case "CHB":
                    propType = "boolean";

                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {value: {type: propType}, error: {type: "boolean", const: false}, msg: {type: "string", const: ""}},
                            required: ["value"],
                            additionalProperties: false
                        }
                    };

                    if (configRow.required) {
                        Object.assign(property[configRow.element_id].properties.value, {const: true})
                    }

                    break;
                case "RADIO_GRP":
                    const childElements = parentIdMap.get(configRow.element_id);
                    let possibleRadioButtons = [];
                    let requiredButton = "";

                    for (const key in childElements) {
                        if (childElements[key].required) {
                            requiredButton = childElements[key].element_id;
                        }
                        possibleRadioButtons.push(childElements[key].element_id);
                    }

                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {
                                value: {type: propType, enum: possibleRadioButtons},
                                error: {type: "boolean", const: false},
                                msg: {type: "string", const: ""}
                            },
                            additionalProperties: false
                        }
                    };

                    if (requiredButton !== "") {
                        Object.assign(property[configRow.element_id].properties.value, {const: requiredButton});
                    }
                    break;
                case "DATE":
                case "TIME":
                case "DATETIME":
                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {
                                value: {
                                    type: "string",
                                    format: "date-time"
                                }, error: {type: "boolean", const: false}, msg: {type: "string", const: ""}
                            },
                            additionalProperties: false
                        }
                    };

                    if (configRow.max !== undefined && configRow.max !== "") {
                        Object.assign(property[configRow.element_id].properties.value, {formatMaximum: configRow.max})
                    }

                    if (configRow.min !== undefined && configRow.min !== "") {
                        Object.assign(property[configRow.element_id].properties.value, {formatMinimum: configRow.min})
                    }

                    break;
                case "FILE":
                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {
                                value:
                                    {
                                        type: "object",
                                        properties: {
                                            name: {type: "string"},
                                            type: {type: "string"},
                                            size: {type: "string"},
                                            base64: {type: "string"}
                                        },
                                        additionalProperties: false
                                    },
                                error: {type: "boolean", const: false},
                                msg: {type: "string", const: ""}
                            },
                            additionalProperties: false
                        }
                    };

                    break;
                case "CHB_GRP":
                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {
                                value: {type: "string", const: ""},
                                error: {type: "boolean", const: false},
                                msg: {type: "string", const: ""}
                            },
                            additionalProperties: false
                        }
                    };
                    break;
                case "TABLE":
                    const tableElements = parentIdMap.get(configRow.element_id);
                    let tableColumns = {id: {type: "integer"}};
                    let requiredColumns = [];

                    for (const key in tableElements) {
                        if (tableElements[key].element === "TABLEHEAD" && tableElements[key].action === "") {
                            Object.assign(tableColumns, {[tableElements[key].element_id]: {type: "string"}});
                            if (tableElements[key].required) requiredColumns.push(tableElements[key].element_id);
                        }
                    }


                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {
                                value: {
                                    type: "array",
                                    items: {
                                        type: "object", properties: tableColumns, required: requiredColumns, additionalProperties: false
                                    }
                                }, error: {type: "boolean", const: false}, msg: {type: "string", const: ""}
                            },

                            additionalProperties: false
                        }
                    };

                    if (configRow.max !== undefined && configRow.max !== "") {
                        Object.assign(property[configRow.element_id].properties.value, {minItems: parseInt(configRow.min)})
                    }

                    if (configRow.min !== undefined && configRow.min !== "") {
                        Object.assign(property[configRow.element_id].properties.value, {maxItems: parseInt(configRow.max)})
                    }
                    break;
                default:
                    property = {
                        [configRow.element_id]: {
                            type: "object",
                            properties: {value: {type: propType}, error: {type: "boolean", const: false}, msg: {type: "string", const: ""}},

                            additionalProperties: false
                        }
                    };
                    break;
            }
            Object.assign(properties, property);
        }
    }

    const schema = {
        type: "object",
        properties: properties,
        required: requiredProperties,
        additionalProperties: false
    };

    return schema;
}

function manualValidation(post, config, parentIdMap, idMap) {

    for (const key in config) {
        const currentRowConfig = config[key];
        const currentRowPost = post[currentRowConfig.element_id];

        if (currentRowConfig.action === "compare" && post[currentRowConfig.element_id].value !== post[currentRowConfig.action_value].value) {
            console.log("Comparison Failed");
            throw new Error("Comparison Failed");
        }

        if (currentRowConfig.element === "FILE") {
            console.log("Start file valid");
            if (currentRowPost.value.hasOwnProperty("base64")) {
                const fullMimeType = currentRowPost.value.base64.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
                const fileSizeInBytes = ((currentRowPost.value.base64.length - fullMimeType.length) * (3 / 4)) - 1;

                try {
                    if (!isBase64(currentRowPost.value.base64, {
                        mimeRequired: true,
                        allowEmpty: false
                    })) {
                        console.log("Failed Base64 Validation");
                        throw new Error("Failed Base64 Validation");
                    }
                } catch (e) {
                    console.log("Error in Base64 Validation");
                    throw new Error("Error in Base64 Validation");
                }


                if (currentRowConfig.type !== "") {
                    const allowedTypes = currentRowConfig.type.replace(/ +/g, "").split(",");

                    if (!allowedTypes.includes(fullMimeType)) {
                        console.log("Failed MimeType Validation");
                        throw new Error("Failed MimeType Validation");
                    }
                }

                if (currentRowConfig.max !== "" && fileSizeInBytes > parseInt(currentRowConfig.max)) {
                    console.log("File Size is too big");
                    throw new Error("File Size is too big");
                }

                if (currentRowConfig.min !== "" && fileSizeInBytes < parseInt(currentRowConfig.min)) {
                    console.log("File Size is too small");
                    throw new Error("File Size is too small");
                }
            } else { //no file uploaded
                if (currentRowConfig.required) {
                    console.log("File required");
                    throw new Error("File required");
                }
            }
        }
    }

    return true;
}

function prepareMainConfig(config) {
    let parentIdMap = new Map();
    let idMap = new Map();

    // idMap und parentIdMap vorbereiten
    for (const key in config) {
        idMap.set(key, config[key]);

        let parentId = config[key].parent_id;

        if (parentId !== "") {
            if (!parentIdMap.has(parentId)) {
                let parentElements = new Array(config[key]);
                parentIdMap.set(parentId, parentElements);
            } else {
                parentIdMap.get(parentId).push(config[key]);
            }
        }
    }

    return [parentIdMap, idMap];
}