import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"
import Header from "./components/common/header/Header"
import Footer from "./components/common/footer/Footer"
import Homepages from "./components/home/Homepages"
import SinglePage from "./components/singlePage/SinglePage"
import Culture from "./components/culture/Culture"
import AllPartners from "./components/partners/AllPartners"
import SinglePartnerPage from "./components/partners/SinglePartnerPage"

const App = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Homepages} />
          <Route path='/singlepage/:id' exact component={SinglePage} />
          <Route exact path='/culture' component={Culture} />
          <Route exact path='/partners' component={AllPartners} />
          <Route path="/partner/:partnerId" component={SinglePartnerPage} />
        </Switch>
        <Footer />
      </Router>
    </>
  )
}

export default App