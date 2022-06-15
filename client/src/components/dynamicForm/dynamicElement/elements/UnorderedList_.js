import React from "react";
import {getChildren} from "../../DynForm";
import DynElement from "../DynElement";

const UnorderedList_ = ({element, style}) => {


    return (
        <ul id={element.element_id} style={style}>
            {
                !getChildren(element.element_id) ? void (0) : (
                    getChildren(element.element_id).map(childElement => {
                            return <DynElement post={childElement}/>
                        }
                    ))
            }
        </ul>
    );
}

export default UnorderedList_;