import axios from "axios";

const url = "http://localhost:3001/api/posts";

export const fetchPosts = () => axios.get(url);