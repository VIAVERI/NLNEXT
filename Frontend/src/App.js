import React from "react";
import Header from "./components/common/header/Header";
import "./App.css";
import Homepages from "./components/home/Homepages";
import Footer from "./components/common/footer/Footer";
import SinglePage from "./components/singlePage/SinglePage";
import Culture from "./components/culture/Culture";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <ReactNotifications />
        <Switch>
          <Route exact path='/' component={Homepages} />
          <Route path='/singlepage/:id' exact component={SinglePage} />
          <Route exact path='/culture' component={Culture} />
          <Route exact path='/partners' component={AllPartners} />
          <Route path="/partner/:partnerId" component={SinglePartnerPage} />
          <Route exact path="/" component={Homepages} />
          <Route path="/singlepage/:id" exact component={SinglePage} />
          <Route exact path="/culture" component={Culture} />
        </Switch>
        <Footer />
      </Router>
    </>
  );
};

export default App;
