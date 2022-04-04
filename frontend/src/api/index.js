import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).access_token
    }`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      localStorage.removeItem("profile");
      toast.error("Expire Login Time, Please Login Again", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location = "/";
      }, 3300);
    }
  }
);

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?creator&page=${page}`);
export const fetchPostsBySearch = (searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );
export const createPost = (formData) =>
  API.post("/posts", formData, {
    headers: { "content-type": "multipart/form-data" },
  });
export const updatePost = (id, formData) =>
  API.patch(`/posts/${id}`, formData, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (body, id) =>
  API.post(`/posts/${id}/commentPost`, { body });

export const login = (formData) => API.post("/auth/login", formData);
export const register = (formData) => API.post("/auth/register", formData);
export const oAuth = (formData) => API.post("/auth/oAuth", formData);
