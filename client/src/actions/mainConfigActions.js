import * as api from "../api/apiRoutes";

// Alle mainConfig Daten lesen
export const getMain = () => async (dispatch) => {
    try {
        const {data} = await api.fetchAllMain();
        console.log("getAllMain - Client");
        dispatch({type: "FETCH", payload: data});
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

// mainConfig für ein bestimmtes Formular lesen
export const getMainByForm = (formId) => async (dispatch) => {
    try {
        if (formId === "" || formId === undefined) throw new Error("No FormID");
        const {data} = await api.fetchMainByForm(formId);
        console.log("getMain " + formId + " - Client");
        dispatch({type: "FETCH", payload: data});
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

// mainConfig-Eintrag updaten
export const updateMain = (id, post) => async (dispatch) => {
    try {
        const {data} = await api.updateMain(id, post);
        console.log("updateMain - Client");
        dispatch({type: "UPDATE_MAIN", payload: data});
    } catch (error) {
        console.log(error.message);
    }
}

// mainConfig-Eintrag erstellen
export const createMain = (post) => async (dispatch) => {
    try {
        const { data } = await api.createMain(post);
        console.log("createMain - Client");
        dispatch({ type: "CREATE_MAIN", payload: data });
        return data;
    } catch (error) {
        console.log(error.message);
        return undefined;
    }
};

// mainConfig-Eintrag löschen
export const deleteMain = (id) => async (dispatch) => {
    try {
        await api.deleteMain(id);
        console.log("deleteMain - Client");
        dispatch({ type: "DELETE_MAIN", payload: id });
    } catch (error) {
        console.log(error.message);
    }
};