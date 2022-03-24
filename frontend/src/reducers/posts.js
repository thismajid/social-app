export default (posts = [], action) => {
  switch (action.type) {
    case "FETCH_ALL":
      return action.payload;
    case "CREATE":
      return [...posts, action.payload];
    case "UPDATE":
      return posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    case "DELETE":
      return posts.filter((post) => post.id !== action.payload);
    default:
      return posts;
  }
};
