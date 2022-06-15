import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DynForm from "./components/dynamicForm/DynForm";
import {Grid} from "@mui/material";
import TabMainConfig from "./components/editorDB/mainConfig/TabMainConfig";
import TabFormData from "./components/editorDB/formData/TabFormData";
import TabImageConfig from "./components/editorDB/imageConfig/TabImageConfig";
import TabTextConfig from "./components/editorDB/textConfig/TabTextConfig";

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="NavigationTabs"
                >
                    <Tab label="registerForm" {...a11yProps(0)} />
                    <Tab label="checkoutForm" {...a11yProps(1)} />
                    <Tab label="tableForm" {...a11yProps(2)} />
                    <Tab label="formTest" {...a11yProps(3)} />
                    <Tab label="Main Config" {...a11yProps(4)} />
                    <Tab label="Image Config" {...a11yProps(5)} />
                    <Tab label="Text Config" {...a11yProps(6)} />
                    <Tab label="Form Data" {...a11yProps(7)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <DynForm formName={"registerForm"}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DynForm formName={"checkoutForm"}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Grid container style={{display: "inline"}}>
                    <Grid alignSelf={"center"} item xs={12} sm={8}>
                        <DynForm formName={"tableForm"}/>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Grid container style={{display: "inline"}}>
                    <Grid item xs={12} sm={8}>
                        <DynForm formName={"formtest"}/>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={4}>
                <TabMainConfig/>
            </TabPanel>
            <TabPanel value={value} index={5}>
                <TabImageConfig/>
            </TabPanel>
            <TabPanel value={value} index={6}>
                <TabTextConfig/>
            </TabPanel>
            <TabPanel value={value} index={7}>
                <TabFormData/>
            </TabPanel>
        </Box>
    );
}

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            align={"center"}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}