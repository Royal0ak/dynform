import React from "react";
import {Box} from "@mui/material";
import {getChildren} from "../../DynForm";
import DynElement from "../DynElement";

const Box_ = ({element, style}) => {

    return (
        <Box id={element.element_id} margin={element.margin} style={style}>
            {
                !getChildren(element.element_id) ? void (0) : (
                    getChildren(element.element_id).map(childElement => {
                            return <DynElement post={childElement}/>
                        }
                    ))
            }
        </Box>
    );
}

export default Box_;