import { IonContent, IonPage, IonText, useIonAlert } from '@ionic/react';
import { DeviceCard } from '../components/DeviceCard';
import useSWR from 'swr';
import { CSSProperties, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Spinner } from '../components/Spinner';
import { environment as env } from '../../.environment';
import { useHistory } from 'react-router';
import { decryptAESCBC } from '../utils/decryptAESCBC';

export const ListDevicesPage = () => {
  const user = useContext(UserContext);

  const [presentAlert, dismissAlert] = useIonAlert();
  const history = useHistory();

  const { data: deviceList, error } = useSWR<string[], Error>(
    `${env.AZURE_URL}/api/device`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
          ...env.AZURE_FUNCTIONS_KEY,
        },
      }).then(async res => {
        const encryptedData = await res.text();
        const decryptedData = decryptAESCBC(encryptedData, env.AES_KEY);
        return JSON.parse(decryptedData);
      }),
  );

  if (error) {
    dismissAlert().then(() => {
      presentAlert({
        message: `Ups! Something went wrong while fetching the data. Please try again. Error: ${error.message}`,
        buttons: [
          {
            text: 'OK',
            handler: () => history.goBack(),
          },
        ],
        backdropDismiss: false,
      });
    });
  }
  if (!deviceList) return <Spinner />;
  return (
    <IonPage>
      <IonContent fullscreen color="light">
        {deviceList.length !== 0 ? (
          deviceList.map(device => {
            return (
              <DeviceCard
                key={device}
                name={device}
                routerLink={`/device/details/${device}`}></DeviceCard>
            );
          })
        ) : (
          <div style={styles.wrapper}>
            <IonText>No devices here</IonText>
            <IonText color="dark">
              Configure a new device or add an existing one
            </IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  } as const,
} satisfies Record<string, CSSProperties>;
