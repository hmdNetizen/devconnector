import { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/layout/auth/Register";
import Login from "./components/layout/auth/Login";

function App() {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route path="/" exact component={Landing} />
        <section className="container">
          <Switch>
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
}

export default App;
