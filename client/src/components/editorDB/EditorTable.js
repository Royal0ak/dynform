import React, {useState} from 'react';
import Paper from '@mui/material/Paper';
import {EditingState, IntegratedPaging, PagingState} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    PagingPanel,
    TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import {useDispatch} from "react-redux";
import { CircularProgress } from "@mui/material";
import {createMain, deleteMain, updateMain} from "../../actions/mainConfigActions";
import {createImage, deleteImage, updateImage} from "../../actions/imageConfigActions";
import {createText, deleteText, updateText} from "../../actions/textConfigActions";



const getRowId = row => row._id;
const booleanFields = ["required", "disabled", "readonly"]
const integerFields = ["prio"]

const EditorTable = ({collection, rows, columns, configRow, setRows}) => {
    const dispatch = useDispatch();

    const commitChanges = ({added, changed, deleted}) => {
        let changedRows;
        let currentRow;

        if (added) {
            const newRow = fillRowContent(added[0], configRow);

            handleDispatch(newRow, "CREATE");
        }
        if (changed) {
            changedRows = rows.map(row => (changed[row._id] ? {...row, ...changed[row._id]} : row));

            const rowId = Object.keys(changed)[0];
            currentRow = changed[rowId];
            currentRow._id = rowId;
            currentRow = parseRowContent(currentRow);
            handleDispatch(currentRow, "UPDATE");
        }

        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = rows.filter(row => !deletedSet.has(row._id));

            handleDispatch(deleted[0], "DELETE");
        }

        if (changedRows !== undefined) {
            setRows(changedRows);
        }
    };

    const [pageSizes] = useState([5, 10, 15, 0]);

    return ([
            rows.length === 0 || columns.length === 0 ? <CircularProgress/> : (
                <Paper>
                    <Grid
                        rows={rows}
                        columns={columns}
                        getRowId={getRowId}
                    >
                        <EditingState
                            onCommitChanges={commitChanges}
                        />
                        <PagingState
                            defaultCurrentPage={0}
                            pageSize={10}
                        />
                        <IntegratedPaging/>
                        <Table/>
                        <TableHeaderRow/>
                        <TableEditRow/>
                        <TableEditColumn
                            showAddCommand
                            showEditCommand
                            showDeleteCommand
                        /> <PagingPanel
                        pageSizes={pageSizes}
                    />
                    </Grid>
                </Paper>)
        ]
    );


    function handleDispatch(data, action) {

        const createEntry = async () => {
            let res;
            switch(collection) {
                case "mainConfig":
                    res = await dispatch(createMain(data));
                    break;
                case "imageConfig":
                    res = await dispatch(createImage(data));
                    break;
                case "textConfig":
                    res = await dispatch(createText(data));
                    break;
                default:
            }

            if (res !== undefined) {
                let newRows = rows.slice();
                newRows.push(res);
                setRows(newRows);
            }
        };

        const updateEntry = () => {
            switch(collection) {
                case "mainConfig":
                    dispatch(updateMain(data._id, data));
                    break;
                case "imageConfig":
                    dispatch(updateImage(data._id, data));
                    break;
                case "textConfig":
                    dispatch(updateText(data._id, data));
                    break;
                default:
            }
        };

        const deleteEntry = () => {
            switch(collection) {
                case "mainConfig":
                    dispatch(deleteMain(data));
                    break;
                case "imageConfig":
                    dispatch(deleteImage(data));
                    break;
                case "textConfig":
                    dispatch(deleteText(data));
                    break;
                default:
            }
        };

        switch(action) {
            case "CREATE":
                createEntry();
                break;
            case "UPDATE":
                updateEntry();
                break;
            case "DELETE":
                deleteEntry();
                break;
            default:
                break;
        }
    }
};

function fillRowContent(added, configRow) {
    const entries = Object.entries(added);
    let newRow = JSON.parse(JSON.stringify(configRow)); // Kopie erstellen

    entries.forEach(element => (newRow[element[0]] = element[1]));

    return parseRowContent(newRow);
}


function parseRowContent(selectedRow) {
    for (const key in selectedRow) {
        if (integerFields.includes(key)) {
            if (selectedRow[key] === "") {
                selectedRow[key] = 0;
            } else {
                selectedRow[key] = parseInt(selectedRow[key]);
            }
        } else if (booleanFields.includes(key)) {
            if (selectedRow[key] === "true" || selectedRow[key] === true) {
                selectedRow[key] = true;
            } else {
                selectedRow[key] = false;
            }
        }
    }
    return selectedRow;
}


export default EditorTable;
