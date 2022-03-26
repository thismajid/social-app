import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const fetchPosts = () => API.get("/posts");
export const createPost = (newPost) => API.post("/posts", newPost);
export const updatePost = (id, updatePost) =>
  API.patch(`/posts/${id}`, updatePost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);

export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);
