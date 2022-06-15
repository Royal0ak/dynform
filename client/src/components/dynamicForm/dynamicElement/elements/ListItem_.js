import React from "react";

const ListItem_ = ({element, style}) => {


    return (
        <li id={element.element_id} style={style}>{element.text_id}</li>
    );
}

export default ListItem_;