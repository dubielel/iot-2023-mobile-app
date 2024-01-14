import { Route } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { IonRouterOutlet, setupIonicReact, useIonRouter } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import { useCallback, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { HomePage } from './pages/HomePage';
import { NewDevicePage } from './pages/NewDevicePage';
import { AddDevicePage } from './pages/AddDevicePage';
import { ListDevicesPage } from './pages/ListDevicesPage';
import { DeviceDetailsPage } from './pages/DeviceDetailsPage';
import { LoginPage } from './pages/LoginPage';

setupIonicReact({ mode: 'ios', swipeBackEnabled: true });
const BACK_BUTTON_EVENT_NAME = 'ionBackButton';

export const App = () => {
  const ionRouter = useIonRouter();

  const backButtonListener = useCallback(() => {
    if (!ionRouter.canGoBack()) {
      CapacitorApp.exitApp();
    }
  }, [ionRouter]);

  useEffect(() => {
    document.addEventListener(BACK_BUTTON_EVENT_NAME, backButtonListener);

    return () => {
      document.removeEventListener(BACK_BUTTON_EVENT_NAME, backButtonListener);
    };
  }, [backButtonListener]);

  return (
    <IonRouterOutlet>
      <Route exact path="/" component={LoadingScreen} />
      <Route path="/login" component={LoginPage} exact={true} />
      <Route path="/home" component={HomePage} />
      <Route exact path="/device/new" component={NewDevicePage} />
      <Route exact path="/device/add" component={AddDevicePage} />
      <Route exact path="/devices" component={ListDevicesPage} />
      <Route path="/device/details/:id" component={DeviceDetailsPage} />
    </IonRouterOutlet>
  );
};
