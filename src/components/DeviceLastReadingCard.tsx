import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';
import { DeviceReading } from '../pages/DeviceDetailsPage';
import { DeviceReadingDetails } from './DeviceReadingDetails';

type DeviceLastReadingCardProps = {
  id: string;
  reading?: DeviceReading;
};

export const DeviceLastReadingCard = ({
  id,
  reading,
}: DeviceLastReadingCardProps) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{id}</IonCardTitle>
        <IonCardSubtitle>Last reading</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <DeviceReadingDetails reading={reading} />
      </IonCardContent>
    </IonCard>
  );
};
