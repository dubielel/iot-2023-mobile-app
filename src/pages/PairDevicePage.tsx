import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonNote,
  IonPage,
  IonText,
  useIonAlert,
} from '@ionic/react';
import { CSSProperties, useContext, useEffect, useState } from 'react';
import { checkmarkOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { ConnectionType } from '@capacitor/network';
import { checkNetworkStatus } from '../utils/checkNetworkStatus';
import { WaitToConfigureDeviceModal } from '../components/modals/WaitToConfigureDeviceModal';
import UserContext from '../contexts/UserContext';
import { environment as env } from '../../.environment';
import { encryptAESCBC } from '../utils/encryptAESCBC';

export const PairDevicePage = () => {
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

  const [clickedDeviceButton, setClickedDeviceButton] =
    useState<boolean>(false);

  const [isDeviceConfigured, setIsDeviceConfigured] = useState<boolean>(false);

  useEffect(() => {
    if (!clickedDeviceButton) return;

    fetch(`${env.AZURE_URL}/api/pair`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
        ...env.AZURE_FUNCTIONS_KEY,
      },
      body: encryptAESCBC(
        JSON.stringify({ RequestType: 'app', DeviceId: env.DEVICE_ID }),
        env.AES_KEY,
      ),
    })
      .then(async res => {
        if (res.ok && res.status === 200) {
          const message = await res.text();
          console.debug(message);
          setIsDeviceConfigured(true);
          dismissAlert().then(() => {
            presentAlert({
              message:
                message === 'device properly added to user'
                  ? `Successfully configured device!`
                  : `Request to pair a device saved - please click button on the device to finish pairing!`,
              buttons: [
                {
                  text: 'OK',
                  handler: () => {
                    dismissAlert();
                    history.goBack();
                  },
                },
              ],
              backdropDismiss: false,
            });
          });
        } else {
          throw new Error(`${res.status} ${res.statusText}`);
        }
      })
      .catch(err => {
        console.error(err);
        dismissAlert().then(() => {
          presentAlert({
            message: `Configuring device failed! Click button on the device and confirm it in app to try again. Error message: ${
              (err as Error).message
            }`,
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  setClickedDeviceButton(false);
                  dismissAlert();
                },
              },
            ],
            backdropDismiss: false,
          });
        });
      });
  }, [clickedDeviceButton, dismissAlert, history, presentAlert, user]);

  if (!user) return <IonNote>User must be logged in!</IonNote>;
  return (
    <IonPage>
      <IonContent fullscreen color="light">
        <div style={styles.container}>
          <IonText color="dark">Click button on the device</IonText>
          {!clickedDeviceButton ? (
            <IonButton
              slot="end"
              onClick={() =>
                !clickedDeviceButton ? setClickedDeviceButton(true) : {}
              }>
              I&apos;ve done it!
            </IonButton>
          ) : (
            <IonBadge color="success">
              <IonIcon icon={checkmarkOutline} />
            </IonBadge>
          )}
        </div>

        <WaitToConfigureDeviceModal
          isOpen={clickedDeviceButton && !isDeviceConfigured}
        />
      </IonContent>
    </IonPage>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  } as const,
} satisfies Record<string, CSSProperties>;
