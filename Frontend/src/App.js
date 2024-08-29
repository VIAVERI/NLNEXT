import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import Homepages from "./components/home/Homepages";
import SinglePage from "./components/singlePage/SinglePage";
import Culture from "./components/culture/Culture";
import AdminDashboard from "./components/Admin/Dashboard/AdminHome";
import SignInSignUp from "./components/login/login";
import AllPartners from "./components/partners/AllPartners";
import SinglePartnerPage from "./components/partners/SinglePartnerPage";
import OurServices from "./components/partners/components/OurServices";
import FavoriteArticlePage from "./components/home/mainContent/favoriteArticles/FavoriteArticlesPage";
import SubmitArticlePage from "./components/partners/SubmitArticlePage";
import EditArticle from "./components/partners/EditArticle";
import PPCreation from "./components/home/PPCreation"
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "./App.css";
import { auth } from "./firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import PartnerProfilePage from "./components/partners/PartnerProfilePage";
import PartnerAdminDashboard from "./components/PartnerAdmin/PartnerAdmin";
import { AuthProvider } from './contexts/AuthContext';

const db = getFirestore();

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
          console.log("role is", userDoc.data().role);
        }
      }
      setLoading(false);
    };
    checkUserRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Route
      {...rest}
      render={(props) =>
        allowedRoles.includes(userRole) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [partnerId, setPartnerId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          setPartnerId(userData.partnerId);
          setShouldRedirect(userData.role === 'partner' && !userData.profile_completed);
        }
      } else {
        setUserRole(null);
        setShouldRedirect(false);
        setPartnerId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <ReactNotifications />
        <Switch>
          <Route
            path="/login"
            render={(props) =>
              user ? <Redirect to="/" /> : <SignInSignUp {...props} />
            }
          />
          <PrivateRoute
            path="/admin-dashboard"
            component={AdminDashboard}
            allowedRoles={["admin"]}
          />
          <PrivateRoute
            path="/partner-admin"
            component={PartnerAdminDashboard}
            allowedRoles={["partner"]}
          />
          <Route
            path="/"
            render={(props) => (
              <>
                <Header />
                <Switch>
                  <Route exact path="/" component={Homepages} />
                  <Route path="/singlepage/:id" exact component={SinglePage} />
                  <Route exact path="/culture" component={Culture} />
                  <Route exact path="/partners" component={AllPartners} />
                  <Route
                    path="/partner/:partnerId"
                    component={SinglePartnerPage}
                  />
                  <Route
                    path="/partner-profile/:partnerId"
                    component={PartnerProfilePage}
                  />
                  <Route exact path="/services" component={OurServices} />
                  <Route
                    path="/favorites"
                    exact
                    component={FavoriteArticlePage}
                  />
                  <Route path="/submit-article" component={SubmitArticlePage} />
                  <Route path="/edit-article/:id" component={EditArticle} />
                  <Route path="/partner-profile-creation" component={PPCreation} />
                  <Route
                    render={({ location }) => {
                      if (shouldRedirect && location.pathname !== '/partner-profile-creation') {
                        return <Redirect to="/partner-profile-creation" />;
                      } else if (user && location.pathname === '/login') {
                        return <Redirect to="/" />;
                      } else if (user && userRole === 'partner' && partnerId && location.pathname === '/') {
                        return <Redirect to={`/partner-profile/${partnerId}`} />;
                      } else {

                        return null;
                      }
                    }}
                  />
                </Switch>
                <Footer />
              </>
            )}
          />
        </Switch>
      </Router>
    </AuthProvider>

  );
};

export default App;