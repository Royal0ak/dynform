import * as api from "../api/apiRoutes";

// gesammte Text-Config lesen
export const getTexts = () => async (dispatch) => {
    try {
        const {data} = await api.fetchTexts();
        console.log("getTexts - Client");
        dispatch({type: "FETCH", payload: data});
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

// Text-COnfig für ein bestimmtes Formular lesen
export const getTextsByForm = (formId) => async (dispatch) => {
    try {
        if (formId === "" || formId === undefined) throw new Error("No FormID");
        const {data} = await api.fetchTextsByForm(formId);
        console.log("getTexts " + formId + " - Client");
        dispatch({type: "FETCH", payload: data});
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

// Text-Eintrag aktualisieren
export const updateText = (id, post) => async (dispatch) => {
    try {
        const {data} = await api.updateText(id, post);
        console.log("updateText - Client");
        dispatch({type: "UPDATE_TEXT", payload: data});
    } catch (error) {
        console.log(error.message);
    }
}

// Text-Eintrag erstellen
export const createText = (post) => async (dispatch) => {
    try {
        const { data } = await api.createText(post);
        console.log("createText - Client");
        dispatch({ type: "CREATE_TEXT", payload: data });
        return data;
    } catch (error) {
        console.log(error.message);
        return undefined;
    }
};

// Text-Eintrag löschen
export const deleteText = (id) => async (dispatch) => {
    try {
        await api.deleteText(id);
        console.log("deleteText - Client");
        dispatch({ type: "DELETE_TEXT", payload: id });
    } catch (error) {
        console.log(error.message);
    }
};