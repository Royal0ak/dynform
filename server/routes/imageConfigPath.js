import express from "express";
import {
    createImageConfig, deleteImageConfig,
    getImageConfig,
    getImageConfigByForm,
    updateImageConfig
} from "../controllers/imageConfigHandler.js";

const router = express.Router();

router.get("/", getImageConfig);
router.get("/:formId", getImageConfigByForm);
router.post("/", createImageConfig);
router.patch("/:id", updateImageConfig);
router.delete('/:id', deleteImageConfig);


export default router;