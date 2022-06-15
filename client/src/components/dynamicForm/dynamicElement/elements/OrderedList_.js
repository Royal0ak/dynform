import React from "react";
import {getChildren} from "../../DynForm";
import DynElement from "../DynElement";

const OrderedList_ = ({element, style}) => {


    return (
        <ol id={element.element_id} style={style}>
            {
                !getChildren(element.element_id) ? void (0) : (
                    getChildren(element.element_id).map(childElement => {
                            return <DynElement post={childElement}/>
                        }
                    ))
            }
        </ol>
    );
}

export default OrderedList_;