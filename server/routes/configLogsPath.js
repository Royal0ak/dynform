import express from "express";
import {createConfigLog} from "../controllers/configLogsHandler";

const router = express.Router();

router.post("/", createConfigLog);


export default router;