import { IonLabel } from '@ionic/react';
import { ComponentProps } from 'react';

export const IonLabelRight = (props: ComponentProps<typeof IonLabel>) => {
  return <IonLabel {...props} style={{ textAlign: 'right', ...props.style }} />;
};
