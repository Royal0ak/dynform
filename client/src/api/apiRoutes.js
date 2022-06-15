import axios from "axios";

// mainConfig
const urlMain = "http://localhost:5000/main";
export const fetchAllMain = () => axios.get(urlMain);
export const fetchMainByForm = (formId) => axios.get(`${urlMain}/${formId}`);
export const createMain = (newPost) => axios.post(urlMain, newPost);
export const updateMain = (id , updatedPost) => axios.patch(`${urlMain}/${id}`, updatedPost);
export const deleteMain = (id) => axios.delete(`${urlMain}/${id}`);

// textConfig
const urlTexts = "http://localhost:5000/texts";
export const fetchTexts = () => axios.get(urlTexts);
export const fetchTextsByForm = (formId) => axios.get(`${urlTexts}/${formId}`);
export const createText = (newPost) => axios.post(urlTexts, newPost);
export const updateText = (id , updatedPost) => axios.patch(`${urlTexts}/${id}`, updatedPost);
export const deleteText = (id) => axios.delete(`${urlTexts}/${id}`);

// imageConfig
const urlImage = "http://localhost:5000/images";
export const fetchImages = () => axios.get(urlImage);
export const fetchImagesByForm = (formId) => axios.get(`${urlImage}/${formId}`);
export const createImage = (newPost) => axios.post(urlImage, newPost);
export const updateImage = (id , updatedPost) => axios.patch(`${urlImage}/${id}`, updatedPost);
export const deleteImage = (id) => axios.delete(`${urlImage}/${id}`);

// formData
const urlForm = "http://localhost:5000/form";
export const fetchFormData = () => axios.get(urlForm);
export const createForm = (newPost) => axios.post(urlForm, newPost);