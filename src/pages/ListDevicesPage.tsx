import { IonContent, IonPage, IonText } from '@ionic/react';
import { DeviceCard } from '../components/DeviceCard';
import useSWR from 'swr';
import { CSSProperties, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Spinner } from '../components/Spinner';
import { environment as env } from '../../.environment';

export const ListDevicesPage = () => {
  const user = useContext(UserContext);
  const { data: deviceList, error } = useSWR<string[], Error>(
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
