import { IonContent, IonPage, IonText } from '@ionic/react';
import { DeviceCard } from '../components/DeviceCard';
import useSWR, { Fetcher } from 'swr';
import { CSSProperties, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Spinner } from '../components/Spinner';
import { environment as env } from '../../environment';

const devices = [
  { name: '1', id: 1 },
  { name: '2', id: 2 },
  { name: '3', id: 3 },
  { name: '4', id: 4 },
  { name: '5', id: 5 },
  { name: '6', id: 6 },
  { name: '7', id: 7 },
  { name: '8', id: 8 },
  { name: '9', id: 9 },
  { name: '10', id: 10 },
  { name: '11', id: 11 },
  { name: '12', id: 12 },
];

type Device = {
  id: string;
  name: string;
  value: number;
};

export const ListDevicesPage = () => {
  const user = useContext(UserContext);
  const { data: deviceList, error } = useSWR<Device[], Error>(
    `${env.AZURE_URL}/api/device`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
          ...env.AZURE_FUNCTIONS_KEY,
        },
      }).then(res => res.json()),
  );
  console.debug(`data: ${JSON.stringify(deviceList)}`);
  console.error(`error ${error}`);
  if (!deviceList) return <Spinner />;
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Devices list</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        {deviceList.length === 0 ? (
          devices.map(device => {
            return (
              <DeviceCard
                key={device.id}
                name={device.name}
                timestamp={1703274646}
                temperature={18.6}
                routerLink={`/device/details/${device.id}`}></DeviceCard>
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
