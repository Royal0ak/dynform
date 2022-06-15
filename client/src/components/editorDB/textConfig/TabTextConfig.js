import React, {useState} from 'react';
import {Box, Button, TextField} from "@mui/material";
import EditorTable from "../EditorTable";
import {useDispatch} from "react-redux";
import {getTexts, getTextsByForm} from "../../../actions/textConfigActions";
import SetupEditorData from "../SetupEditorData";

let configRow = {};
let defaultRows = [];

const TabTextConfig = () => {
    let [currentFormName, setCurrentFormName] = useState();
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        {name: 'form_id', title: 'form_id'},
        {name: 'text_id', title: 'text_id'},
        {name: 'language', title: 'language'},
        {name: 'text', title: 'text'}
    ]);

    // Tabellendaten lesen
    const getTableData = async () => {
        let config
        if (currentFormName === undefined || currentFormName === "") {
            config = await dispatch(getTexts());
        } else {
            config = await dispatch(getTextsByForm(currentFormName));
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

    return ([
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
                    }} size={"large"} variant="contained" style={{margin: "5px", height: "100%"}}>Search</Button>
                </Box>
            </Box>,
            <br/>,
            <EditorTable collection={"textConfig"} columns={columns} configRow={configRow} rows={rows}
                          setRows={setRowFunc}/>
        ]
    );
};


export default TabTextConfig;
