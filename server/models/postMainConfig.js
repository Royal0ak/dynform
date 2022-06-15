import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    form_id: String,
    element: String,
    element_id: String,
    parent_id: String,
    prio: Number,
    text_id: String,
    helper_text: String,
    tooltip: String,
    readonly: Boolean,
    required: Boolean,
    disabled: Boolean,
    value: String,
    type: String,
    variant: String,
    margin: String,
    action: String,
    action_value: String,
    style: String,
    regex: String,
    min: String,
    max: String
}, {
    collection: "mainConfig",
    strict: true,
    versionKey: false
});

const MainConfig = mongoose.model("mainConfig", postSchema);

export default MainConfig;