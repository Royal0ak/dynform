import React, {useState} from 'react';
import Paper from '@mui/material/Paper';
import {EditingState} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
} from '@devexpress/dx-react-grid-material-ui';
import {getChildren, postData, setPostData} from "../../DynForm";


const getRowId = row => row.id;
let defaultColumn = [];
let defaultColumnEditing = [];
let defaultColumnExtensions = [];
let editTableColumnElements = [];
let editTableColumn = <TableEditColumn/>;
let editTableColumnNames = {
    addCommand: "New",
    editCommand: "Edit",
    deleteCommand: "Delete",
    commitCommand: "Save",
    cancelCommand: "Cancel"
};


const Table_ = ({element, style}) => {
    const tableColumns = getChildren(element.element_id);

    if (defaultColumn.length === 0) {
        tableColumns.map(childElement => {
                if (childElement.action === "" && childElement.element === "TABLEHEAD") {
                    defaultColumn.push({name: childElement.element_id, title: childElement.text_id})
                    defaultColumnEditing.push({columnName: childElement.element_id, editingEnabled: !childElement.readonly})

                    if (childElement.variant !== undefined && childElement.variant !== "") {
                        defaultColumnExtensions.push({
                            columnName: childElement.element_id,
                            width: parseInt(childElement.variant)
                        })
                    }
                } else if (childElement.element === "TABLEHEAD") {
                    editTableColumnElements.push(childElement);
                }
            }
        )

        if (editTableColumnElements.length !== 0) {
            let tableEditProps;

            editTableColumnElements.map(childElement => {
                switch (childElement.action) {
                    case "ADD":
                        tableEditProps = {...tableEditProps, showAddCommand: true};
                        editTableColumnNames.addCommand = childElement.text_id;
                        break;
                    case "EDIT":
                        tableEditProps = {...tableEditProps, showEditCommand: true};
                        editTableColumnNames.editCommand = childElement.text_id;
                        break;
                    case "DELETE":
                        tableEditProps = {...tableEditProps, showDeleteCommand: true};
                        editTableColumnNames.deleteCommand = childElement.text_id;
                        break;
                    case "COMMIT":
                        editTableColumnNames.commitCommand = childElement.text_id;
                        break;
                    case "CANCEL":
                        editTableColumnNames.cancelCommand = childElement.text_id;
                        break;
                    default:
                        break;
                }
            })
            editTableColumn = <TableEditColumn messages={editTableColumnNames} {...tableEditProps}/>
        }
    }

    const [columns] = useState(defaultColumn);

    const [editingStateColumnExtensions] = useState(defaultColumnEditing);
    const [tableColumnExtensions] = useState(defaultColumnExtensions);

    const commitChanges = ({added, changed, deleted}) => {
        let changedRows;
        if (added) {
            const startingAddedId = postData[element.element_id].value.length > 0 ? postData[element.element_id].value[postData[element.element_id].value.length - 1].id + 1 : 0;
            changedRows = [
                ...postData[element.element_id].value,
                ...added.map((row, index) => ({
                    id: startingAddedId + index,
                    ...row,
                })),
            ];
        }
        if (changed) {
            changedRows = postData[element.element_id].value.map(row => (changed[row.id] ? {...row, ...changed[row.id]} : row));
        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = postData[element.element_id].value.filter(row => !deletedSet.has(row.id));
        }
        setPostData({...postData, [element.element_id]: {value: changedRows}});
    };


    return (
        <Paper>
            <Grid
                rows={postData[element.element_id].value}
                columns={columns}
                getRowId={getRowId}
                style={style}
            >
                <EditingState
                    onCommitChanges={commitChanges}
                    // defaultEditingRowIds={[0]}
                    columnExtensions={editingStateColumnExtensions}
                />
                <Table columnExtensions={tableColumnExtensions}/>
                <TableHeaderRow/>
                <TableEditRow/>
                {editTableColumn}
            </Grid>
        </Paper>
    );
};


export default Table_;