import ConfigLogs from "../models/postConfigLogs.js";


export const createConfigLog = async (req, res) => {
    const newConfigLog = new ConfigLogs(req.body);

    try {
        await newConfigLog.save();
        console.log("createConfigLog! - Server");
        res.status(201).json(newConfigLog);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
