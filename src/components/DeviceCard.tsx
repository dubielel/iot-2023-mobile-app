import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonRippleEffect,
} from '@ionic/react';
import { ComponentProps } from 'react';

interface DeviceCardProps {
  name: string;
}

export const DeviceCard = (
  props: DeviceCardProps & ComponentProps<typeof IonCard>,
) => {
  return (
    <IonCard
      className="ion-activatable ripple-parent rounded-rectangle"
      routerLink={props.routerLink}>
      <IonRippleEffect />
      <IonCardHeader>
        <IonCardTitle>{props.name}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};
