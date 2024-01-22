import { IonList } from '@ionic/react';
import { ComponentProps } from 'react';
import { FoundWifiDetails } from '../../pages/DEPRECATED2_NewDevicePage';
import { AvailableWifiItem } from './AvailableWifiItem';

interface AvailableWifiListProps {
  wifis: FoundWifiDetails[];
}

export const AvailableWifiList = ({
  wifis,
}: AvailableWifiListProps & ComponentProps<typeof IonList>) => {
  return (
    <IonList inset={true}>
      {wifis.map(wifi => (
        <AvailableWifiItem wifi={wifi} key={wifi.SSID} />
      ))}
    </IonList>
  );
};
