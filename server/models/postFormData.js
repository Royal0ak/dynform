import mongoose from "mongoose";


const postSchema = mongoose.Schema({

}, {
    collection: "formData",
    strict: false,
    versionKey: false
});


const PostFormData = mongoose.model("formData", postSchema);

export default PostFormData;