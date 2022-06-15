import React from "react";
import FileBase from 'react-file-base64';
import {postData, setPostData} from "../../DynForm";

const FileField_ = ({element, style}) => {


    function handleChange(base64) {
        delete base64.file;
        setPostData({...postData, [element.element_id]: {value: base64}});
    }

    return (
        <FileBase style={style} id={element.element_id} type={"file"} multiple={false}
                  onDone={(base64) => handleChange(base64)}/>
    );
}

export default FileField_;