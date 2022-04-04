import { AUTH } from "../constants/actionTypes";
import * as api from "../api/index.js";

export const signin = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);

    dispatch({ type: AUTH, data });

    router.push("/");
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.register(formData);

    dispatch({ type: AUTH, data });

    router.push("/");
  } catch (error) {
    console.log(error);
  }
};

export const oAuth = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.oAuth(formData);

    dispatch({ type: "AUTH", data });

    history.push("/");
  } catch (error) {
    console.log(error);
  }
};
