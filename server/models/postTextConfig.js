import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    form_id: String,
    text_id: String,
    language: String,
    text: String,
}, {
    collection: "textConfig",
    strict: true,
    versionKey: false
});

const TextConfig = mongoose.model("textConfig", postSchema);

export default TextConfig;