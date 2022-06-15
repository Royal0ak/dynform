const valueFields = ["TF", "TA", "DATE", "DATETIME", "TIME", "CHB", "RADIO_GRP", "FILE", "CHB_GRP", "TABLEROW"];
const browserLangu = navigator.language;


const SetupFormData = (formName, mainConfig, textConfig, imagesConfig) => {
    let parentIdMap = new Map();
    let idMap = new Map();
    let idArray = [];
    let textIdMap = new Map();
    let imageIdMap = new Map();
    let defaultPostData;

    if (mainConfig.length > 0) {
        [parentIdMap, idMap, idArray, defaultPostData] = prepareMainConfig(formName, mainConfig);
    }

    if (textConfig.length > 0) {
        textIdMap = prepareTextConfig(formName, textConfig);
    }

    if (imagesConfig.length > 0) {
        imageIdMap = prepareImageConfig(formName, imagesConfig);
    }

    return [parentIdMap, idMap, idArray, textIdMap, imageIdMap, defaultPostData];
}
export default SetupFormData;


// mainConfig vorbereiten
function prepareMainConfig(formName, mainConfig) {
    let parentIdMap = new Map();
    let idMap = new Map();
    let idArray = [];
    let defaultPostData;

    // Nach Prio sortieren
    mainConfig.sort(function (a, b) {
        return a.prio - b.prio;
    });

    for (let i = 0; i < mainConfig.length; i++) {
        let id = mainConfig[i].element_id;
        let formId = mainConfig[i].form_id;
        let parentId = mainConfig[i].parent_id;
        let obj = mainConfig[i];

        if (id == null || formId !== formName) continue;

        idMap.set(id, obj);
        idArray.push(obj);

        if (parentId !== "") {
            if (!parentIdMap.has(parentId)) {
                let parentElements = new Array(obj);
                parentIdMap.set(parentId, parentElements);
            } else {
                parentIdMap.get(parentId).push(obj);
            }
        }
    }

    const standardData = {
        formName: formName,
        submitDate: "",
    };

    defaultPostData = {standardData};

    // Formulareingabedaten vorbereiten
    idMap.forEach((value, key) => {
        if (valueFields.includes(value.element) && !defaultPostData.hasOwnProperty(key)) {

            switch (value.element) {
                case "CHB":
                    if (value.value === "true") {
                        setDefaultPostData({...defaultPostData, [key]: {value: true, error: false, msg: ""}});
                    } else {
                        setDefaultPostData({...defaultPostData, [key]: {value: false, error: false, msg: ""}});
                    }
                    break;
                case "DATE":
                case "TIME":
                case "DATETIME":
                    let currentDate;
                    if (value.value !== "") {
                        currentDate = new Date(value.value);
                    } else {
                        currentDate = new Date();
                    }

                    setDefaultPostData({...defaultPostData, [key]: {value: currentDate, error: false, msg: ""}});
                    break;
                case "FILE":
                    setDefaultPostData({...defaultPostData, [key]: {value: {}, error: false, msg: ""}});
                    break;
                case "TABLEROW":
                    if (value.value !== "") {
                        let rowValue;

                        try {
                            value.value = value.value.replace(/\\\//g, "");
                            rowValue = JSON.parse(value.value);
                            rowValue.id = value.prio;
                        } catch (error) {
                            console.log(error);
                        }

                        if (defaultPostData.hasOwnProperty(value.parent_id)) {
                            defaultPostData[value.parent_id].value.push(rowValue);
                        } else {
                            setDefaultPostData({
                                ...defaultPostData,
                                [value.parent_id]: {value: [rowValue], error: false, msg: ""}
                            });
                        }
                    }
                    break;
                default:
                    if (value.type === "number") {
                        if (value.value === "") {
                            setDefaultPostData({...defaultPostData, [key]: {value: null, error: false, msg: ""}});
                        } else {
                            setDefaultPostData({
                                ...defaultPostData, [key]: {value: parseInt(value.value), error: false, msg: ""}
                            });
                        }
                    } else {
                        setDefaultPostData({...defaultPostData, [key]: {value: value.value, error: false, msg: ""}});
                    }
                    break;
            }
        }
    })

    function setDefaultPostData(data) {
        defaultPostData = data;
    }

    return [parentIdMap, idMap, idArray, defaultPostData];
}

// Text COnfig vorbereiten
function prepareTextConfig(formName, textConfig) {
    let textIdMap = new Map();
    // Texte mit Browsersprache vorbereiten
    for (let i = 0; i < textConfig.length; i++) {
        let language = textConfig[i].language;
        let text_id = textConfig[i].text_id;
        let obj = textConfig[i];

        if (browserLangu.includes(language)) {
            textIdMap.set(text_id, obj);
        }
    }
    // Wenn es kein Text für die Browsersprache existiert wird immer "de" ausgewählt
    for (let i = 0; i < textConfig.length; i++) {
        let language = textConfig[i].language;
        let text_id = textConfig[i].text_id;
        let obj = textConfig[i];

        if (!textIdMap.has(text_id) && language === "de") {
            textIdMap.set(text_id, obj);
        }
    }
    return textIdMap;
}

// Image Config vorbereiten
function prepareImageConfig(formName, imageConfig) {
    let imageIdMap = new Map();
    // Bilder nach Sprache vorbereiten
    for (let i = 0; i < imageConfig.length; i++) {
        let language = imageConfig[i].language;
        let image_id = imageConfig[i].image_id;
        let obj = imageConfig[i];

        if (browserLangu.includes(language)) {
            imageIdMap.set(image_id, obj);
        }
    }
    // Wenn es kein Bild für die Sprache gibt, wird immer "de" gewählt
    for (let i = 0; i < imageConfig.length; i++) {
        let language = imageConfig[i].language;
        let image_id = imageConfig[i].image_id;
        let obj = imageConfig[i];

        if (!imageIdMap.has(image_id) && language === "de") {
            imageIdMap.set(image_id, obj);
        }
    }
    return imageIdMap;
}