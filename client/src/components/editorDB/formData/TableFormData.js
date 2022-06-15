import React, {useState} from 'react';
import Paper from '@mui/material/Paper';
import {IntegratedPaging, PagingState} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    PagingPanel
} from '@devexpress/dx-react-grid-material-ui';



const getRowId = row => row._id;


const TableFormData = ({rows, columns}) => {

    const [pageSizes] = useState([5, 10, 15, 0]);

    const [tableColumnExtensions] = useState([
        {columnName: 'submitDate', width: 220}
    ]);


    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
            >
                <PagingState
                    defaultCurrentPage={0}
                    pageSize={10}
                />
                <IntegratedPaging/>
                <Table columnExtensions={tableColumnExtensions}/>
                <TableHeaderRow/>
                <PagingPanel
                    pageSizes={pageSizes}
                />
            </Grid>
        </Paper>
    );

};


export default TableFormData;
