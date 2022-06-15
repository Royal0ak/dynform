import React from "react";
import {
    styled,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {getChildren} from "../../DynForm";
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import DynElement from "../DynElement";
import ReactHtmlParser from 'react-html-parser';

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} {...props} />
))(({theme}) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ExpandMoreIcon/>}
        {...props}
    />
))(({theme}) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Accordion_ = ({element, style}) => {
    const [expanded, setExpanded] = React.useState(element.element_id);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };


    return (
        <Accordion expanded={expanded === element.element_id} onChange={handleChange(element.element_id)}>
            <AccordionSummary aria-controls={element.element_id.concat("-content")}
                              id={element.element_id.concat("-header")}>
                <Typography>{ReactHtmlParser(element.text_id)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                    !getChildren(element.element_id) ? void (0) : (
                        getChildren(element.element_id).map(childElement => {
                                return <DynElement post={childElement}/>
                            }
                        ))
                }
            </AccordionDetails>
        </Accordion>
    );
}

export default Accordion_;