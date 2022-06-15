import express from "express";
import { getMainConfigs, getMainConfigByForm, updateMainConfig, createMainConfig, deleteMainConfig} from "../controllers/mainConfigHandler.js";

const router = express.Router();

router.get("/", getMainConfigs);
router.get("/:formId", getMainConfigByForm);
router.patch("/:id", updateMainConfig);
router.delete('/:id', deleteMainConfig);
router.post("/", createMainConfig);

export default router;