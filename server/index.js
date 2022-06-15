import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import formRoutes from "./routes/formDataPath.js";
import mainRoutes from "./routes/mainConfigPath.js";
import textRoutes from "./routes/textConfigPath.js";
import imageRoutes from "./routes/imageConfigPath.js";

const CONNECTION_URL = "mongodb://localhost:27017/formConfigDB";
const PORT = 5000;
const app = express();

// API Einstellungen
app.use(express.json({limit: "10mb", extended: true }));
app.use(express.urlencoded({limit: "10mb", extended: true }));
app.use(cors());

// Stellt die Routen als API zur verfügung
app.use("/main", mainRoutes);
app.use("/form", formRoutes);
app.use("/texts", textRoutes);
app.use("/images", imageRoutes);

// Verbindung mit der Datenbank. Erst bei einer erfolgreichen Verbindung wird die API gestartet.
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log("Server running on port: " + PORT)))
    .catch((error) => console.log(error.message));
