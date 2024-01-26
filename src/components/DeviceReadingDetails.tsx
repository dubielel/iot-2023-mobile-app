import { IonLabel, IonIcon } from '@ionic/react';
import { thermometerOutline, time } from 'ionicons/icons';
import { DeviceReading } from '../pages/DeviceDetailsPage';

type DeviceReadingDetailsProps = {
  reading?: DeviceReading;
};

export const DeviceReadingDetails = ({
  reading,
}: DeviceReadingDetailsProps) => {
  return (
    <>
      <IonLabel style={{ display: 'flex', alignItems: 'center' }}>
        <IonIcon icon={thermometerOutline} size="large" />
        {(reading ? reading.Value.toFixed(3) : '--') + '°C'}
      </IonLabel>
      <IonLabel style={{ display: 'flex', alignItems: 'center' }}>
        <IonIcon icon={time} size="large" />
        {reading ? new Date(reading.Timestamp * 1000).toLocaleString() : '--'}
      </IonLabel>
    </>
  );
};
