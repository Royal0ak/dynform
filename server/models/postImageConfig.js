import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    form_id: String,
    image_id: String,
    language: String,
    image: String,
}, {
    collection: "imageConfig",
    strict: true,
    versionKey: false
});

const ImageConfig = mongoose.model("imageConfig", postSchema);

export default ImageConfig;