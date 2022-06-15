import { combineReducers } from "redux";

import main from "./main.js";
import form from "./form.js";
import texts from "./texts.js";
import images from "./images.js";

export default combineReducers({
    form,
    main,
    texts,
    images
});