import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  useIonAlert,
} from '@ionic/react';
import { useCallback, useContext, useEffect, useState } from 'react';

import { checkmarkOutline } from 'ionicons/icons';

import { useHistory } from 'react-router';
import { ConnectionType } from '@capacitor/network';
import { checkNetworkStatus } from '../utils/checkNetworkStatus';
import { Browser } from '@capacitor/browser';
import { Spinner } from '../components/Spinner';
import { WaitToConfigureDeviceModal } from '../components/modals/WaitToConfigureDeviceModal';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';
import UserContext from '../contexts/UserContext';
import { io } from 'socket.io-client';
import { encryptAESCTR } from '../utils/encryptAESCTR';
import { environment as env } from '../../.environment';

export type FoundWifiDetails = {
  BSSID: string;
  SSID: string;
  capabilities: string;
  centerFreq0: number;
  centerFreq1: number;
  channelWidth: number;
  frequency: number;
  level: number;
  timestamp: number;
};

type DeviceConfig = {
  deviceId: string;
  primaryKey: string;
  secondaryKey: string;
  connectionString: string;
};

export const NewDevicePage = () => {
  const user = useContext(UserContext);

  // Check internet connection
  const [currentINetConnType, setCurrentINetConnType] =
    useState<ConnectionType>('unknown');
  const [currentINetConnSSID, setCurrentINetConnSSID] = useState<
    string | undefined
  >(undefined);

  // TODO (FUTURE) integrate presenting alert and awaiting
  // for user interaction with button to execute retry
  const [presentAlert, dismissAlert] = useIonAlert();
  const history = useHistory();
  useEffect(() => {
    if (currentINetConnSSID || currentINetConnType === 'cellular') return;

    checkNetworkStatus()
      .then(networkStatus => {
        setCurrentINetConnType(networkStatus.connectionType);
        setCurrentINetConnSSID(networkStatus.ssid);
      })
      .catch(err => {
        console.error(err);
        dismissAlert().then(() => {
          presentAlert({
            message: `You are not connected to the Internet! Connect and try again.`,
            buttons: [
              {
                text: 'OK',
                handler: () => history.goBack(), // TODO prevent android hardware button from going back
              },
            ],
            backdropDismiss: false,
          });
        });
      });
  }, [
    currentINetConnSSID,
    dismissAlert,
    presentAlert,
    history,
    currentINetConnType,
  ]);
  // Check internet connection end

  const [userRemembersWifi, setUserRemembersWifi] = useState<boolean>(false);

  const [enabledAPN, setEnabledAPN] = useState<boolean>(false);

  const [isLoadingAPNui, setIsLoadingAPNui] = useState<boolean>(false);

  const [userProvidedWifiToDevice, setUserProvidedWifiToDevice] =
    useState<boolean>(false);

  // GET request to Azure to ask for new device configuration data (key)
  const [deviceConfigEncrypted, setDeviceConfigEncrypted] =
    useState<Uint8Array>(new Uint8Array());

  const [isConfiguringDevice, setIsConfiguringDevice] =
    useState<boolean>(false);

  useEffect(() => {
    if (!enabledAPN) return;

    // Connect to device's APN -- hardcoded configuration
    const openCapacitorSite = async () => {
      await new Promise(r => setTimeout(r, 2000));
      // Get new device configuration from Azure
      // const data = await fetch(
      //   `${env.AZURE_URL}/api/add-device`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
      //       ...env.AZURE_FUNCTIONS_KEY,
      //     },
      //   },
      // );
      // const newDeviceConfig = (await data.json()) as DeviceConfig;
      // const encryptedDeviceConfig = encryptAESCTR(
      //   `${newDeviceConfig.deviceId},${newDeviceConfig.primaryKey}`,
      //   DeviceEncryptionAESKey,
      // );
      // setDeviceConfigEncrypted(encryptedDeviceConfig);

      // Connect to device's APN
      // await WifiWizard2.connect('http://192.168.SOMETHING', true);

      // Open device's APN login to network page
      await Browser.open({ url: 'http://capacitorjs.com/' });
    };

    setIsLoadingAPNui(true);
    openCapacitorSite().then(() => setIsLoadingAPNui(false));

    // Send POST request with provided WIFI configuration to device
    // and wait for device's response that request was successful
    // and for device's data

    // Switch from device's APN to 'main' network
  }, [enabledAPN]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tcp = useCallback(async (toSend: Uint8Array) => {
    console.debug('in tcp');
    const socket = io('http://192.168.SOMETHING:PORT');
    await socket.emitWithAck('device', toSend);
  }, []);

  const onBrowserFinishedCb = useCallback(async () => {
    setIsConfiguringDevice(true);
    console.debug('in browserFinished listener callback');
    await tcp(deviceConfigEncrypted);

    // await WifiWizard2.disconnect('http://192.168.SOMETHING');

    if (currentINetConnSSID) {
      console.debug(`current ssid: ${currentINetConnSSID}`);
      // await WifiWizard2.enable(currentINetConnSSID, undefined, true); // with waiting for verified connection
    } else {
      // Timeout just to be sure that device switches to cellular network and establishes connection
      await new Promise(r => setTimeout(r, 3000));
    }

    Browser.removeAllListeners();
    await new Promise(r => setTimeout(r, 10000));
    setIsConfiguringDevice(false);
  }, [currentINetConnSSID, deviceConfigEncrypted, tcp]);

  useEffect(() => {
    Browser.removeAllListeners().then(() =>
      Browser.addListener('browserFinished', onBrowserFinishedCb),
    );
  }, [onBrowserFinishedCb]);

  // if (isLoadingAPNui) return <Spinner />;
  if (!user) return <IonNote>User must be logged in!</IonNote>;
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonList>
          <IonNote>Steps to configure new device:</IonNote>
          <IonItem>
            <IonLabel color="dark">
              1. Remind yourself your WIFI network configuration (SSID,
              password) that you want your new device to use.
            </IonLabel>
            {!userRemembersWifi ? (
              <IonButton slot="end" onClick={() => setUserRemembersWifi(true)}>
                I have it now!
              </IonButton>
            ) : (
              <IonBadge color="success">
                <IonIcon icon={checkmarkOutline} />
              </IonBadge>
            )}
          </IonItem>
          <IonItem>
            <IonLabel color="dark">2. Click button on the device</IonLabel>
            {!enabledAPN ? (
              <IonButton
                slot="end"
                onClick={() => setEnabledAPN(true)}
                disabled={!userRemembersWifi}>
                {!userRemembersWifi ? 'Do steps before!' : "I've done it!"}
              </IonButton>
            ) : (
              <IonBadge color="success">
                <IonIcon icon={checkmarkOutline} />
              </IonBadge>
            )}
          </IonItem>
          <IonItem>
            <IonLabel color="dark">
              3. When device page loads, insert your WIFI network configuration
              there
            </IonLabel>
            {!userProvidedWifiToDevice ? (
              <IonButton
                slot="end"
                onClick={() => setUserProvidedWifiToDevice(true)}
                disabled={!(userRemembersWifi && enabledAPN)}>
                {!(userRemembersWifi && enabledAPN)
                  ? 'Do steps before!'
                  : "I've done it!"}
              </IonButton>
            ) : (
              <IonBadge color="success">
                <IonIcon icon={checkmarkOutline} />
              </IonBadge>
            )}
          </IonItem>
        </IonList>

        <WaitToConfigureDeviceModal
          isOpen={isLoadingAPNui || isConfiguringDevice}
        />
      </IonContent>
    </IonPage>
  );
};
