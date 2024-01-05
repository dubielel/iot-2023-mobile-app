import { IonContent, IonPage, IonText } from '@ionic/react';
import { useParams } from 'react-router';

export const DeviceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Cockpit</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <IonText>DeviceDetailsPage for: {id}</IonText>
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
