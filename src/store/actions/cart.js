import { CART_START, CART_SUCCESS, CART_FAIL } from "./actionTypes";
import { authAxios } from "../../utils";
import { oderSummaryURL, fetchCart } from "../../constants";

export const cartStart = () => {
    return {
        type: CART_START
    };
};

export const cartSuccess = data => {
    //  console.log(data);
    return {
        type: CART_SUCCESS,
        data
    };
};

export const cartFail = error => {
    return {
        type: CART_FAIL,
        error: error
    };
};

export const cartFetch = () => {
    return dispatch => {
        dispatch(cartStart());
        authAxios
            .get(oderSummaryURL)
            .then(res => {
                console.log(res);
                dispatch(cartSuccess(res.data));
            })
            .catch(err => {
                dispatch(cartFail(err));
            });
    };
};