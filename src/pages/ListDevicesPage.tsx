import { IonContent, IonPage, IonText } from '@ionic/react';
import { DeviceCard } from '../components/DeviceCard';

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

export const ListDevicesPage = () => {
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
        {devices.map(device => {
          return (
            <DeviceCard
              name={device.name}
              timestamp={1703274646}
              temperature={18.6}
              routerLink={`/device/details/${device.id}`}></DeviceCard>
          );
        })}
      </IonContent>
    </IonPage>
  );
};
