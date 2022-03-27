import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  FETCH_BY_SEARCH,
  START_LOADING,
  STOP_LOADING,
} from "../constants/actionTypes";

export default (state = { isLoading: true, posts: [] }, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberofPages: action.payload.numberofPages,
      };
    case FETCH_BY_SEARCH:
      return { ...state, posts: action.payload.data };
    case CREATE:
      return { ...state, posts: [...state.posts, action.payload] };
    case UPDATE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    default:
      return state;
  }
};
