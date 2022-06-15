import React, {useState} from "react";
import FileBase from 'react-file-base64';
import {Button, TextField, Paper, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import styles from "../styles";
import {createImage} from "../../../actions/imageConfigActions";



const UploadImageConfig = () => {
    const [postData, setPostData] = useState({
        form_id: "",
        image_id: "",
        language: "de",
        image: ""
    });

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(createImage(postData));
    }

    const clear = () => {
        setPostData({form_id: "", image_id: '', language: '', image: ''});
    };


    return (
        <Paper style={styles.paper}>
            <form style={styles.form} autoComplete={"off"} noValidate onSubmit={handleSubmit}>
                <Typography variant={"h6"}>Upload new Image</Typography>
                <TextField style={styles.tf} name={"form_id"} variant={"outlined"} label={"form_id"} fullWidth
                           value={postData.form_id}
                           onChange={(e) => setPostData({...postData, form_id: e.target.value})}/>
                <TextField style={styles.tf} name={"image_id"} variant={"outlined"} label={"image_id"} fullWidth
                           value={postData.image_id}
                           onChange={(e) => setPostData({...postData, image_id: e.target.value})}/>
                <TextField style={styles.tf} name={"language"} variant={"outlined"} label={"language"} fullWidth
                           value={postData.language}
                           onChange={(e) => setPostData({...postData, language: e.target.value})}/>
                <div style={styles.fileInput}><FileBase type={"file"} multiple={false}
                                                        onDone={({base64}) => setPostData({
                                                            ...postData, image: base64
                                                        })}/></div>
                <Button style={styles.buttonSubmit} variant="contained" color="primary" size="large" type="submit"
                        fullWidth>Submit</Button>
                <Button style={styles.buttonSubmit} variant="contained" color="secondary" size="small"
                        onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper>
    );
}

export default UploadImageConfig;