import { AUTH } from "../constants/actionTypes";
import * as api from "../api";

export const login = (formData, history) => async (dispatch) => {
  try {
    history.push("/");
  } catch (error) {
    console.log(error.message);
  }
};

export const register = (formData, history) => async (dispatch) => {
  try {
    history.push("/");
  } catch (error) {
    console.log(error.message);
  }
};
