import * as api from "../api/apiRoutes";

// Gesamte image-Tabelle lesen
export const getImages = () => async (dispatch) => {
    try {
        const {data} = await api.fetchImages();
        console.log("getImages - Client");
        dispatch({type: "FETCH", payload: data});
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

// Alle bilder für ein bestimmtes Formular lesen
export const getImagesByForm = (formId) => async (dispatch) => {
    try {
        if (formId === "" || formId === undefined) throw new Error("No FormID");
        const {data} = await api.fetchImagesByForm(formId);
        console.log("getImages " + formId + " - Client");
        dispatch({type: "FETCH", payload: data});
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

// Bild anlegen
export const createImage = (post) => async (dispatch) => {
    try {
        const {data} = await api.createImage(post);
        console.log("createImage - Client");
        dispatch({type: "CREATE_IMAGE", payload: data});
    } catch (error) {
        console.log(error.message);
    }
}

// image-Tabelle ändern
export const updateImage = (id, post) => async (dispatch) => {
    try {
        const {data} = await api.updateImage(id, post);
        console.log("updateImage - Client");
        dispatch({type: "UPDATE_IMAGE", payload: data});
    } catch (error) {
        console.log(error.message);
    }
}

// Bild-Eintrag löschen
export const deleteImage = (id) => async (dispatch) => {
    try {
        await api.deleteImage(id);
        console.log("deleteImage - Client");
        dispatch({ type: "DELETE_IMAGE", payload: id });
    } catch (error) {
        console.log(error.message);
    }
};