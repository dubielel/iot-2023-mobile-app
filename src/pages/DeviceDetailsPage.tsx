import { IonContent, IonPage, IonText } from '@ionic/react';
import { useContext } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import UserContext from '../contexts/UserContext';
import { Spinner } from '../components/Spinner';

type DeviceDetails = {
  id: string;
  name: string;
  value: number;
};

export const DeviceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const user = useContext(UserContext);
  const { data: deviceDetails, error } = useSWR<DeviceDetails, Error>(
    `https://iot-project-agh-bcdgl.azurewebsites.net/api/data/${id}`,
    (url: string) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
          'x-functions-key':
            'iNjJu8MziIYZumeq3ZUY1Wc4xvBcD240Kj7xrXt0qcvQAzFudlnkyw==',
        },
      }).then(res => res.json()),
  );

  if (!deviceDetails) return <Spinner />;
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Cockpit</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <IonText>
          DeviceDetailsPage for: {id} {deviceDetails.name}
        </IonText>
      </IonContent>
    </IonPage>
  );
};

// [
//   {
//     "route": "/devices",
//     "type": "GET",
//     "body": [
//       {
//         "id": "number",
//         "name": "string",
//         "lastSample": {
//           "timestamp": "number",
//           "temperature": "number"
//         }
//       }
//     ]
//   },
//   {
//     "route": "/devices/:id",
//     "type": "GET",
//     "body": {
//       "id": "number",
//       "name": "string",
//       "samples": [
//         {
//           "timestamp": "number",
//           "temperature": "number"
//         }
//       ]
//     }
//   }
// ]
