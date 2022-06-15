import MainConfig from "../models/postMainConfig.js";
import mongoose from "mongoose";
import ConfigLogs, {getLogData} from "../models/postConfigLogs.js";



export const getMainConfigs = async (req, res) => {
    try {
        const mainConfig = await MainConfig.find();
        console.log("getMainConfig! - Server");
        res.status(200).json(mainConfig);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getMainConfigByForm = async (req, res) => {
    const {formId} = req.params;

    try {
        const mainConfig = await MainConfig.find({form_id: formId});
        console.log("getMainConfig! " + formId + " - Server");
        res.status(200).json(mainConfig);
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const createMainConfig = async (req, res) => {
    const newMainConfig = new MainConfig(req.body);
    const newConfigLog = new ConfigLogs(getLogData("mainConfig","CREATE", newMainConfig, newMainConfig._id));

    try {
        await newMainConfig.save();
        console.log("createMainConfig! - Server");
        await newConfigLog.save();
        console.log("saveLogs! - Server");
        res.status(201).json(newMainConfig);
    } catch (error) {
        res.status(409).json({message: error.message});
    }
}

export const updateMainConfig = async (req, res) => {
    const {id} = req.params;
    const updatedPost = req.body;
    const newConfigLog = new ConfigLogs(getLogData("mainConfig","UPDATE", updatedPost, mongoose.Types.ObjectId(id)));

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`${id} is no real _id`);

    try {
        await MainConfig.findByIdAndUpdate(id, updatedPost, {new: true});
        console.log("updateMainConfig! - Server");
        await newConfigLog.save();
        console.log("saveLogs! - Server");
    } catch (error) {
        res.json({message: error.message});
    }

    res.json(updatedPost);
}

export const deleteMainConfig = async (req, res) => {
    const {id} = req.params;
    const newConfigLog = new ConfigLogs(getLogData("mainConfig","DELETE", {}, mongoose.Types.ObjectId(id)));

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`${id} is no real _id`);

    try {
        await MainConfig.findByIdAndRemove(id);
        console.log("deleteMainConfig! - Server");
        await newConfigLog.save();
        console.log("saveLogs! - Server");
    } catch (error) {
        res.json({message: error.message});
    }

    res.json({message: "dynamicElement deleted successfully."});
}