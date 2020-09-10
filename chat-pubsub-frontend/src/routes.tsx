import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import CreateUser from "./pages/CreateUser";
import CreateUserSuccess from "./pages/CreateUserSuccess";
import Page404 from "./pages/Page404";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/create/user" exact component={CreateUser} />
        <Route path="/create/user/success" component={CreateUserSuccess} />
        <Route component={Page404} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
