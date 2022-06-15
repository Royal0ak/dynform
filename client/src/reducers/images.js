/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (posts = [], action) => {
    switch (action.type) {
        case "FETCH":
            return action.payload;
        case "CREATE_IMAGE":
            return [...posts, action.payload];
        case "UPDATE_IMAGE":
            return posts.map((post) => (post._id === action.payload._id ? action.payload : post));
        case "DELETE_IMAGE":
            return posts.filter((post) => post._id !== action.payload);
        default:
            return posts;
    }
}