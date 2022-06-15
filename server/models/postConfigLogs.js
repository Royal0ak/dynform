import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    collectionName: String,
    logDate: Date,
    action: String,
    targetId: Object,
    newData: Object
}, {
    collection: "configLogs",
    strict: true,
    versionKey: false
});

const ConfigLogs = mongoose.model("configLogs", postSchema);

export default ConfigLogs;

export function getLogData(collection, action, newData, id) {
    return {
        collectionName: collection,
        logDate: new Date(),
        action: action,
        targetId: id,
        newData: newData
    };
}