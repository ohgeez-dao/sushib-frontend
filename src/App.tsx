import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import useEthereum from "./hooks/useEthereum";
import ClaimSushib from "./pages/ClaimSushib";
import ClaimXSushib from "./pages/ClaimXSushib";

function App() {
  const context = useEthereum();
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/xsushib">
            <ClaimXSushib context={context} />
          </Route>
          <Route path="/">
            <ClaimSushib context={context} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
