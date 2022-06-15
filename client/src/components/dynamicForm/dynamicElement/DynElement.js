import React from "react";
import InputField_ from "./elements/InputField_.js";
import {getImage, getText} from "../DynForm.js";
import DateField_ from "./elements/DateField_";
import CheckBox from "./elements/Checkbox_";
import Button_ from "./elements/Button_";
import CheckboxGroup_ from "./elements/CheckboxGroup_";
import RadioGroup_ from "./elements/RadioGroup_";
import RadioButton_ from "./elements/RadioButton_";
import Box_ from "./elements/Box_";
import {Tooltip} from "@mui/material";
import FileField_ from "./elements/FileField_";
import Image_ from "./elements/Image_";
import Header_ from "./elements/Header_";
import Text_ from "./elements/Text_";
import OrderedList_ from "./elements/OrderedList_";
import UnorderedList_ from "./elements/UnorderedList_";
import ListItem_ from "./elements/ListItem_";
import Accordion_ from "./elements/Accordion_";
import Link_ from "./elements/Link_";
import Stepper_ from "./elements/Stepper_";
import Container_ from "./elements/Container_";
import Item_ from "./elements/Item_";
import Table_ from "./elements/Table_";
import DateTimeField_ from "./elements/DateTimeField_";
import TimeField_ from "./elements/TimeField_";


const DynElement = ({post}) => {
    let style;

    if (post.text_id !== "") {
        const textObj = getText(post.text_id);
        if (textObj != null) {
            post.text_id = textObj.text;
        }
    }

    if (post.helper_text_id !== "") {
        const textObj = getText(post.helper_text_id);
        if (textObj != null) {
            post.helper_text_id = textObj.text;
        }
    }

    if (post.tooltip_id !== "") {
        const textObj = getText(post.tooltip_id);
        if (textObj != null) {
            post.tooltip_id = textObj.text;
        }
    }

    if (post.element === "IMG") {
        const imgObj = getImage(post.value);
        if (imgObj != null) {
            post.value = imgObj.image;
        }
    }

    if (post.style !== "") {
        try {
            post.style = post.style.replace(/\\\//g, "");
            style = JSON.parse(post.style);
        } catch (error) {
            console.log(error);
        }
    }

    switch (post.element) {
        case "TF":
        case "TA":
            return <InputField_ element={post} style={style}/>;
            break;
        case "DATE":
            return <DateField_ element={post} style={style}/>;
            break;
        case "DATETIME":
            return <DateTimeField_ element={post} style={style}/>;
            break;
        case "TIME":
            return <TimeField_ element={post} style={style}/>;
            break;
        case "BTN":
            return <Button_ element={post} style={style}/>;
            break;
        case "CHB_GRP":
            return <CheckboxGroup_ element={post} style={style}/>;
            break;
        case "CHB":
            return <CheckBox element={post} style={style}/>;
            break;
        case "RADIO_GRP":
            return <RadioGroup_ element={post} style={style}/>;
            break;
        case "RADIO":
            return <RadioButton_ element={post} style={style}/>;
            break;
        case "BOX":
            return <Box_ element={post} style={style}/>;
            break;
        case "FILE":
            return <FileField_ element={post} style={style}/>;
            break;
        case "IMG":
            return <Image_ element={post} style={style}/>;
            break;
        case "HEADER":
            return <Header_ element={post} style={style}/>;
            break;
        case "TEXT":
            return <Text_ element={post} style={style}/>;
            break;
        case "OL":
            return <OrderedList_ element={post} style={style}/>;
            break;
        case "UL":
            return <UnorderedList_ element={post} style={style}/>;
            break;
        case "LI":
            return <ListItem_ element={post} style={style}/>;
            break;
        case "PANEL":
            return <Accordion_ element={post} style={style}/>;
            break;
        case "LINK":
            return <Link_ element={post} style={style}/>;
            break;
        case "STEPPER":
            return <Stepper_ element={post} style={style}/>;
            break;
        case "CONTAINER":
            return <Container_ element={post} style={style}/>;
            break;
        case "ITEM":
            return <Item_ element={post} style={style}/>;
            break;
        case "TABLE":
            return <Table_ element={post} style={style}/>;
            break;
        default:
            break;
    }
    return null;
}

export function addToolTip(mainElement, tooltip) {
    return (
        <Tooltip title={tooltip}>
            {mainElement}
        </Tooltip>
    );
}

export default DynElement;