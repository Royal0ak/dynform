import React, {useState} from 'react';
import {Box, Button, TextField} from "@mui/material";
import EditorTable from "../EditorTable";
import SetupEditorData from "../SetupEditorData";
import {useDispatch} from "react-redux";
import {getMain, getMainByForm} from "../../../actions/mainConfigActions";

let configRow = {};
let defaultRows = [];

const TabMainConfig = () => {
    let [currentFormName, setCurrentFormName] = useState();
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        {name: 'form_id', title: 'form_id'},
        {name: 'element', title: 'element'},
        {name: 'element_id', title: 'element_id'},
        {name: 'parent_id', title: 'parent_id'},
        {name: 'prio', title: 'prio'},
        {name: 'text_id', title: 'text_id'},
        {name: 'helper_text_id', title: 'helper_text_id'},
        {name: 'tooltip_id', title: 'tooltip_id'},
        {name: 'readonly', title: 'readonly'},
        {name: 'required', title: 'required'},
        {name: 'disabled', title: 'disabled'},
        {name: 'value', title: 'value'},
        {name: 'type', title: 'type'},
        {name: 'variant', title: 'variant'},
        {name: 'margin', title: 'margin'},
        {name: 'action', title: 'action'},
        {name: 'action_value', title: 'action_value'},
        {name: 'style', title: 'style'},
        {name: 'regex', title: 'regex'},
        {name: 'min', title: 'min'},
        {name: 'max', title: 'max'}
    ]);

    // Tabellendaten lesen
    const getTableData = async () => {
        let config
        if (currentFormName === undefined || currentFormName === "") {
            config = await dispatch(getMain());
        } else {
            config = await dispatch(getMainByForm(currentFormName));
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
            <EditorTable collection={"mainConfig"} columns={columns} configRow={configRow} rows={rows}
                         setRows={setRowFunc}/>
        ]
    );
};


export default TabMainConfig;
