import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonAlert,
} from '@ionic/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import UserContext from '../contexts/UserContext';
import { Spinner } from '../components/Spinner';
import { DeviceLastReadingCard } from '../components/DeviceLastReadingCard';
import { DeviceReadingDetails } from '../components/DeviceReadingDetails';
import { environment as env } from '../../.environment';
import { decryptAESCBC } from '../utils/decryptAESCBC';

export type DeviceReading = {
  DeviceId: string;
  Timestamp: number;
  Value: number;
};

export const DeviceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const user = useContext(UserContext);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [presentAlert, dismissAlert] = useIonAlert();
  const history = useHistory();

  const [deviceReadings, setDeviceReadings] = useState<DeviceReading[]>([]);

  const fetchData = useCallback(async () => {
    fetch(`${env.AZURE_URL}/api/data/${id}`, {
      headers: {
        Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
        ...env.AZURE_FUNCTIONS_KEY,
      },
    })
      .then(async res => {
        if (res.status !== 200)
          throw new Error(`HTTP error: ${res.status} ${res.statusText}`);

        const encryptedData = await res.text();
        const decryptedData = decryptAESCBC(encryptedData, env.AES_KEY);
        return JSON.parse(decryptedData);
      })
      .then(data => {
        const readings = data as DeviceReading[];
        const readingsSorted = readings.sort(
          (a, b) => b.Timestamp - a.Timestamp,
        );
        setDeviceReadings(readingsSorted);
      })
      .catch(err => setErrorMessage((err as Error).message));
  }, [id, user?.user?.authentication.accessToken]);

  const handleRefresh = useCallback(
    async (event: CustomEvent<RefresherEventDetail>) => {
      fetchData().then(() => event.detail.complete());
    },
    [fetchData],
  );

  // Fetch data when mounting
  useEffect(() => {
    fetchData().then(() => setIsFetched(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (errorMessage) {
    dismissAlert().then(() => {
      presentAlert({
        message: `Ups! Something went wrong while fetching the data. Please try again. Error: ${errorMessage}`,
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
  if (!isFetched) return <Spinner />;
  return (
    <IonPage>
      <IonContent fullscreen color="light">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent color="light"></IonRefresherContent>
        </IonRefresher>
        <DeviceLastReadingCard id={id} reading={deviceReadings[0]} />
        <IonList inset>
          <IonItem style={{ textAlign: 'center' }}>
            <IonLabel>
              <h1>History readings</h1>
            </IonLabel>
          </IonItem>
          {deviceReadings.map((reading, index) => (
            <IonItem key={index}>
              <DeviceReadingDetails reading={reading} />
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
