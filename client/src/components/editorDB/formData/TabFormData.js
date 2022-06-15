import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {
    Box,
    Button,
    TextField,
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import DynForm, {setPostData} from "../../dynamicForm/DynForm";
import html2pdf from "html2pdf.js/src";
import TableFormData from "./TableFormData";
import {getFormData} from "../../../actions/formDataActions";


let formData;
let column = [];
let defaultRows = [];

const TabFormData = () => {

    // Zustand für das Eingabefeld
    const [currentFormName, setFormName] = useState();

    // Zustand für das dynamische Formular, das nur beim suchen gesetzt wird.
    // (Damit beim Tippen im Eingabefeld das dynamische Formular nicht verschwindet)
    const [searchedFormName, setSearchedFormName] = useState();

    const dispatch = useDispatch();

    const startUp = async () => {
        formData = await dispatch(getFormData());
    };

    if (formData === undefined) startUp();

    const [rows, setRows] = useState({});
    const [columns, setColumns] = useState([]);

    // Action-Icons
    const addResetBtn = ({index}) => {
        return ([
            <PictureAsPdfIcon onClick={handleActionPDF.bind(this, index)}
                              style={{marginRight: "20px", marginLeft: "10px"}}/>,
            <ArrowCircleDownIcon onClick={handleActionFill.bind(this, index)}/>
        ]);
    };

    // Formular füllen und donwloaden
    const handleActionPDF = (index) => {
        handleActionFill(index);
        printPDF();
        console.log("open details", index);
    };
    // Formular füllen
    const handleActionFill = (index) => {
        const tmpPreData = formData.filter(row => row._id === index)[0];
        setPostData(tmpPreData);
    };


    return [
        <Box sx={{display: "flex", alignItems: "center"}}>
            <Box>
                <TextField
                    id={"formName"}
                    name={"formName"}
                    label={"Form Name"}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{margin: "5px"}}
                />
            </Box>
            <Box>
                <Button onClick={() => {
                    handleSearch();
                }} size={"large"} variant="contained" style={{margin: "5px", height: "100%"}}>Search</Button>
            </Box>
        </Box>,
        <br/>,
        isEmpty(rows) ? void (0) : ([
            <TableFormData rows={rows} columns={columns}/>,
            <div style={{margin: "40px"}}>
                <Button variant="contained"
                        color="primary" onClick={() => {
                    printPDF()
                }}>PDF
                </Button>
                <div style={{marginTop: "10px"}}
                     className="w3-card-12 w3-white mainContainer"
                     id="element-to-print">
                    <DynForm formName={searchedFormName} stopSubmit={true}/>
                </div>
            </div>
        ])
    ];

    // Formular als PDF konvertieren und downloaden
    function printPDF() {
        const elementId = "element-to-print";
        let element = document.getElementById(elementId);
        let opt = {
            margin: 1,
            filename: 'myfile.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 1},
            jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().from(element).set(opt).save();
    }

    function isEmpty(obj) {
        for (var i in obj) return false;
        return true;
    }

    // Nach formularnamen suchen. -> Bei Erfolg wird die Tabelle und das dynamische Formular angezeigt
    function handleSearch() {
        if (currentFormName !== undefined && formData.length > 0) {
            let tmpColumn;

            for (let i = 0; i < formData.length; i++) {
                if (formData[i].standardData.formName === currentFormName) {
                    tmpColumn = Object.keys(formData[i]);
                    break;
                } else {
                    tmpColumn = undefined;
                }
            }

            // Wurden Formulardaten gefunden?
            if (tmpColumn !== undefined) {
                column = [];
                column.push({name: "actions", title: " "});
                // Spalten zusammenstellen
                for (let i = 0; i < tmpColumn.length; i++) {
                    if (tmpColumn[i] !== "_id" && tmpColumn[i] !== "__v" && tmpColumn[i] !== "standardData") {
                        column.push({name: tmpColumn[i], title: tmpColumn[i]});
                    } else if (tmpColumn[i] === "standardData") {
                        column.push({name: "submitDate", title: "SubmitDate"});
                    }
                }
                // Spalten setzten
                setColumns(column);
                defaultRows = [];

                for (let i = 0; i < formData.length; i++) {
                    if (formData[i].standardData.formName === currentFormName) {
                        let tmpFormData = Object.entries(formData[i]);
                        let tmpRow = {};

                        // Zeilen zusammenstellen
                        tmpFormData.forEach(function (item) {
                            try {
                                switch (item[0]) {
                                    case "_id":
                                        tmpRow[item[0]] = item[1];
                                        // Fügt die Action-ICons hinzu
                                        tmpRow["actions"] = addResetBtn.call(this, {index: item[1]});
                                        break;
                                    case "standardData":
                                        tmpRow["submitDate"] = item[1].submitDate;
                                        break;
                                    default:
                                        if (item[1].hasOwnProperty("value")) {
                                            if (item[1].value.hasOwnProperty("name")) {
                                                tmpRow[item[0]] = item[1].value.name.toString();
                                            } else {
                                                tmpRow[item[0]] = item[1].value.toString();
                                            }
                                        }
                                        break;
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        });
                        defaultRows.push(tmpRow);
                    }
                }
                // Zeilen setzen
                setRows(defaultRows)
            }
        }
        setSearchedFormName(currentFormName);
    }

};


export default TabFormData;
