const localhost = "http://127.0.0.1:8000";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const productListURL = `${endpoint}/products/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const oderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const AddressURL = `${endpoint}/addresses/`;
export const AddressCreateURL = `${endpoint}/addresses/create/`;
export const countryListURL = `${endpoint}/countries/`;
export const userIDtURL = `${endpoint}/user-id/`;
export const AddressUpdatetURL = id => `${endpoint}/addresses/${id}/update/`;
export const orderItemDeleteURL = id => `${endpoint}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;
