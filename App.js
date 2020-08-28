import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';
import { Notifications } from "expo";
import Loading from "./components/loading";
import ConfirmModal from "./components/confirmModal";
import ErrorModal from "./components/ErrorModal";
import { Provider } from "react-redux";
import store from "./store";
import PhoneVerification from "./pages/PhoneVerification";
import MapPage from "./pages/MapView";
import UserDetail from "./pages/userDetails";
import HowItWorks from "./pages/howItWorks";
import AboutUs from "./pages/aboutUs";
import Complaint from "./pages/complaint";
import ContactUs from "./pages/contactUs";
import History from "./pages/history";
import Share from "./pages/share";
import Sidebar from "./components/sidebar";
import { Scene, Router, Stack } from "react-native-router-flux";

export default function App() {

  const [screenType, setScreenType] = useState("");

  useEffect(() => {
    getUserInfo();
    registerForPushNotificationsAsync();
    Notifications.addListener(_handleNotification);
  }, []);

  _handleNotification = (notification) => {
    console.log(notification, "Notification");
    // this.setState({notification: notification});
  };

  getUserInfo = async () => {
    let userInfo = await AsyncStorage.getItem("userInfo");
    console.log("USERINFO", userInfo);
    if(userInfo){
      setScreenType("mapView")
    }
  }

  return (
    <Provider store={store}>
      <Router>
        <Stack key="root">
        <Scene
          type="reset"
          hideNavBar={true}
          key="loginPage"
          component={PhoneVerification}
          title="LoginPage"
          initial={screenType != 'mapView'}
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="MapView"
          component={MapPage}
          title="MapView"
          initial={screenType == 'mapView'}
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="UserDetail"
          component={UserDetail}
          title="UserDetail"
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="complaint"
          component={Complaint}
          title="Complaint"
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="howItWorks"
          component={HowItWorks}
          title="HowItWorks"
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="aboutUs"
          component={AboutUs}
          title="aboutUs"
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="contactUs"
          component={ContactUs}
          title="contactUs"
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="history"
          component={History}
          title="history"
        />
        <Scene
          type="reset"
          hideNavBar={true}
          key="share"
          component={Share}
          title="Share"
        />
        </Stack>
      </Router>
      <Loading />
      <ConfirmModal />
      <ErrorModal />
      <Sidebar />
    </Provider>
  );
}
