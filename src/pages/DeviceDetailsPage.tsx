import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
} from '@ionic/react';
import { useContext } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import UserContext from '../contexts/UserContext';
import { Spinner } from '../components/Spinner';
import { environment as env } from '../../.environment';

type DeviceDetails = {
  id: string;
  _ts: number;
  value: number;
};

export const DeviceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const user = useContext(UserContext);
  const { data: deviceDetails, error } = useSWR<DeviceDetails[], Error>(
    `${env.AZURE_URL}/api/data/${id}`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
          ...env.AZURE_FUNCTIONS_KEY,
        },
      }).then(res => res.json()),
  );

  if (error) console.debug('we have an error');
  if (!deviceDetails) return <Spinner />;
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonText>DeviceDetailsPage for: {id}</IonText>
        <IonList>
          {deviceDetails.map((log, index) => (
            <IonItem key={index}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <IonLabel>
                  Time: {new Date(log._ts * 1000).toLocaleString()}
                </IonLabel>
                <IonLabel>Temperature: {log.value.toFixed(3) + '°C'}</IonLabel>
              </div>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
