import express from "express";
import {
    createTextConfig,
    deleteTextConfig,
    getTextConfig,
    getTextConfigByForm,
    updateTextConfig
} from "../controllers/textConfigHandler.js";


const router = express.Router();


router.get("/", getTextConfig);
router.get("/:formId", getTextConfigByForm);
router.patch("/:id", updateTextConfig);
router.delete('/:id', deleteTextConfig);
router.post("/", createTextConfig);

export default router;