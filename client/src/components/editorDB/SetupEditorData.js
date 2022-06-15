const SetupEditorData = (formName, config) => {

    let defaultRows = undefined;
    let tmpColumn = undefined;
    let configRow = {};


    if (config && config.length !== 0) {
        tmpColumn = Object.keys(config[0]);

        for (let i = 0; i < tmpColumn.length; i++) {
            if (tmpColumn[i] !== "_id") {
                const keyField = tmpColumn[i];
                configRow[keyField] = "";
            }
        }
        defaultRows = config;
    }
    return [defaultRows, configRow];
}


export default SetupEditorData;