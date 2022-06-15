import express from "express";
import {createFormData, getFormData} from "../controllers/formDataHandler.js";

const router = express.Router();


router.post("/", createFormData);
router.get("/", getFormData);

export default router;