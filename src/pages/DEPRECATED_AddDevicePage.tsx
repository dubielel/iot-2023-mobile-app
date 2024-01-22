import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import { useCallback, useContext, useState } from 'react';
import { WaitToConfigureDeviceModal } from '../components/modals/WaitToConfigureDeviceModal';
import { io } from 'socket.io-client';
import { decryptAESCTR } from '../utils/decryptAESCTR';
import { environment as env } from '../../environment';
import UserContext from '../contexts/UserContext';

export const AddDevicePage = () => {
  const user = useContext(UserContext);

  const [isRetrieving, setIsRetrieving] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const onDeviceIdObtained = useCallback(
    async (toDecode: string) => {
      const deviceIdDecrypted = decryptAESCTR(toDecode, env.AES_KEY);
      setDeviceId(deviceIdDecrypted);

      const res = await fetch(`${env.AZURE_URL}/api/pair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.user?.authentication.accessToken}`,
          ...env.AZURE_FUNCTIONS_KEY,
        },
        body: JSON.stringify({
          deviceId: deviceIdDecrypted,
        }),
      });

      if (res.ok) {
        setIsRetrieving(false);
        setIsAdded(true);
      } else {
        console.error('sth is no yes');
      }
    },
    [user?.user?.authentication.accessToken],
  );

  const retrieveDeviceId = useCallback(async () => {
    setIsRetrieving(true);

    const socket = io('http://192.168.SOMETHING:PORT');

    socket.on('deviceId', onDeviceIdObtained);
  }, [onDeviceIdObtained]);

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add existing device</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <IonText color="dark">
          You need to click button on the device to start adding this device
        </IonText>

        <IonButton onClick={retrieveDeviceId}>
          I&apos;ve done it - let&apos; get started!
        </IonButton>
        {/* <IonBadge color="success">
                <IonIcon icon={checkmarkOutline} />
              </IonBadge> */}

        <WaitToConfigureDeviceModal isOpen={isRetrieving} />

        {isAdded && (
          <IonText color="success">
            Device {deviceId} added successfully to your account! You can now
            see the logs
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};
