import TextConfig from "../models/postTextConfig.js";
import ConfigLogs, {getLogData} from "../models/postConfigLogs.js";
import mongoose from "mongoose";



export const getTextConfig = async (req, res) => {
    try {
        const textConfig = await TextConfig.find();
        console.log("getTextConfig - Server");
        res.status(200).json(textConfig);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getTextConfigByForm = async (req, res) => {
    const {formId} = req.params;

    try {
        const textConfig = await TextConfig.find({form_id: formId});
        console.log("getTextConfig! " + formId + " - Server");
        res.status(200).json(textConfig);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createTextConfig = async (req, res) => {
    const post = req.body;
    const newPost = new TextConfig(post);
    const newConfigLog = new ConfigLogs(getLogData("textConfig","CREATE", newPost, newPost._id));

    try {
        console.log("createTextConfig! - Server");
        await newPost.save();
        console.log("saveLogs! - Server");
        await newConfigLog.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateTextConfig = async (req, res) => {
    const {id} = req.params;
    const updatedPost = req.body;
    const newConfigLog = new ConfigLogs(getLogData("textConfig","UPDATE", updatedPost, mongoose.Types.ObjectId(id)));

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`${id} is no real _id`);

    try {
        await TextConfig.findByIdAndUpdate(id, updatedPost, {new: true});
        console.log(`updateTextConfig! _id:${id} - Server`);
        await newConfigLog.save();
        console.log("saveLogs! - Server");
    } catch (error) {
        res.json({message: error.message});
    }

    res.json(updatedPost);
}

export const deleteTextConfig = async (req, res) => {
    const {id} = req.params;
    const newConfigLog = new ConfigLogs(getLogData("textConfig","DELETE", {}, mongoose.Types.ObjectId(id)));

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`${id} is no real _id`);

    try {
        await TextConfig.findByIdAndRemove(id);
        console.log(`deleteTextConfig! _id:${id} - Server`);
        await newConfigLog.save();
        console.log("saveLogs! - Server");
    } catch (error) {
        res.json({message: error.message});
    }

    res.json({message: "dynamicElement deleted successfully."});
}