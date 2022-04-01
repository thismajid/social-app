import { AUTH } from "../constants/actionTypes";
import * as api from "../api";

export const login = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);

    console.log(data);

    dispatch({ type: "AUTH", data });

    history.push("/");
  } catch (error) {
    console.log(error.message);
  }
};

export const register = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.register(formData);

    dispatch({ type: "AUTH", data });

    history.push("/");
  } catch (error) {
    console.log(error.message);
  }
};

export const oAuth = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.oAuth(formData);

    dispatch({ type: "AUTH", data });

    history.push("/");
  } catch (err) {
    console.log(err);
  }
};
