import React, {useState} from 'react';
import {Box, Button, Container, Grid, TextField} from "@mui/material";
import EditorTable from "../EditorTable";
import {useDispatch} from "react-redux";
import UploadImageConfig from "./UploadImageConfig";
import SetupEditorData from "../SetupEditorData";
import {getImages, getImagesByForm} from "../../../actions/imageConfigActions";

let configRow = {};
let defaultRows = [];

const TabMainConfig = () => {
    let [currentFormName, setCurrentFormName] = useState();
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        {name: 'form_id', title: 'form_id'},
        {name: 'image_id', title: 'image_id'},
        {name: 'language', title: 'language'},
        {name: 'image', title: 'image'}
    ]);

    // Tabellendaten lesen
    const getTableData = async () => {
        let config
        if (currentFormName === undefined || currentFormName === "") {
            config = await dispatch(getImages());
        } else {
            config = await dispatch(getImagesByForm(currentFormName));
        }

        if (config !== undefined && config.length > 0) {
            [defaultRows, configRow] = SetupEditorData(currentFormName, config);
            setRows(defaultRows);
        }
    };

    if (rows.length === 0) getTableData();


    function setRowFunc(input) {
        setRows(input);
    }

    return (
        <Container>
            <Grid container justify="space-between" alignItems="stretch">
                <Grid item xs={12} sm={8}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Box>
                            <TextField
                                id={"formName"}
                                name={"formName"}
                                label={"Form Name"}
                                onChange={(e) => setCurrentFormName(e.target.value)}
                                style={{margin: "5px"}}
                            />
                        </Box>
                        <Box>
                            <Button onClick={() => {
                                getTableData();
                            }} size={"large"} variant="contained"
                                    style={{margin: "5px", height: "100%"}}>Search</Button>
                        </Box>
                    </Box>
                    <br/>
                    <EditorTable collection={"imageConfig"} columns={columns} configRow={configRow} rows={rows}
                                 setRows={setRowFunc}/>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <UploadImageConfig/>
                </Grid>
            </Grid>
        </Container>
    );
};


export default TabMainConfig;
