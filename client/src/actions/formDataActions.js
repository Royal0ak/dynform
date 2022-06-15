import * as api from "../api/apiRoutes";

//Formular absenden
export const createForm = (post) => async (dispatch) => {
    try {
        const {data} = await api.createForm(post);
        console.log("createForm - Client");
        dispatch({type: "CREATE_FORM", payload: data});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

//Formulardaten lesen
export const getFormData = () => async (dispatch) => {
    try {
        const {data} = await api.fetchFormData();
        console.log("getFormData - Client");
        dispatch({type: "FETCH", payload: data});
        return data;
    } catch (error) {
        console.log(error.message);
    }
}