import ImageConfig from "../models/postImageConfig.js";
import mongoose from "mongoose";
import ConfigLogs, {getLogData} from "../models/postConfigLogs.js";



export const getImageConfig = async (req, res) => {
    try {
        const imageConfig = await ImageConfig.find();
        console.log("getImageConfig! - Server");
        res.status(200).json(imageConfig);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getImageConfigByForm = async (req, res) => {
    const {formId} = req.params;

    try {
        const imageConfig = await ImageConfig.find({form_id: formId});
        console.log("getImageConfig! " + formId + " - Server");
        res.status(200).json(imageConfig);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


// Image hochladen
export const createImageConfig = async (req, res) => {
    const post = req.body;
    const newPost = new ImageConfig(post);
    const newConfigLog = new ConfigLogs(getLogData("imageConfig","CREATE", newPost, newPost._id));

    try {
        console.log("createImage! - Server");
        await newPost.save();
        console.log("saveLogs! - Server");
        await newConfigLog.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateImageConfig = async (req, res) => {
    const {id} = req.params;
    const updatedPost = req.body;
    const newConfigLog = new ConfigLogs(getLogData("imageConfig","UPDATE", updatedPost, mongoose.Types.ObjectId(id)));

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`${id} is no real _id`);

    try {
        await ImageConfig.findByIdAndUpdate(id, updatedPost, {new: true});
        console.log("updateImageConfig! - Server");
        await newConfigLog.save();
        console.log("saveLogs! - Server");
    } catch (error) {
        console.log(error);
    }

    res.json(updatedPost);
}

export const deleteImageConfig = async (req, res) => {
    const {id} = req.params;
    const newConfigLog = new ConfigLogs(getLogData("imageConfig","DELETE", {}, mongoose.Types.ObjectId(id)));

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`${id} is no real _id`);

    try {
        await ImageConfig.findByIdAndRemove(id);
        console.log("deleteImageConfig! - Server");
        await newConfigLog.save();
        console.log("saveLogs! - Server");
    } catch (error) {
        res.json({message: "dynamicElement deleted successfully, but Logging failed"});
    }

    res.json({message: "dynamicElement deleted successfully."});
}