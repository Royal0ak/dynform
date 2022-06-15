/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (posts = [], action) => {
    switch (action.type) {
        case "CREATE_FORM":
            return [...posts, action.payload];
        case "FETCH":
            return action.payload;
        default:
            return posts;
    }
}