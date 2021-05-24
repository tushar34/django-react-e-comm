import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import HomepageLayout from "./containers/Home";
import Productlist from "./containers/Productlist";
import OrderSummary from "./containers/Order-summary";
import Checkout from "./containers/Checkout";
import Profile from "./containers/Profile";
import UpdateAddress from "./containers/Update-Address";
const BaseRouter = () => (
  <Hoc>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/profile" component={Profile} />
    <Route path="/products" component={Productlist} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/Checkout" component={Checkout} />
    <Route path="/Update-Address" component={UpdateAddress} />
    <Route exact path="/" component={HomepageLayout} />
  </Hoc>
);

export default BaseRouter;
