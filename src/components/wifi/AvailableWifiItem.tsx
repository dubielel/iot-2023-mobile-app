import { IonCheckbox, IonItem } from '@ionic/react';
import { ComponentProps } from 'react';
import { FoundWifiDetails } from '../../pages/NewDevicePage';
import { useFormContext } from 'react-hook-form';
import { WifiDataForm } from '../modals/GetWifiConfigurationModal';

interface AvailableWifiItemProps {
  wifi: FoundWifiDetails;
}

export const AvailableWifiItem = ({
  wifi,
}: AvailableWifiItemProps & ComponentProps<typeof IonItem>) => {
  const { setValue, getValues, watch } = useFormContext<WifiDataForm>();
  const { BSSID } = getValues();

  // for components to re-render
  // to have current state of SSID inserted manually in Input
  watch('SSID');

  return (
    <IonItem>
      <IonCheckbox
        checked={wifi.BSSID === BSSID}
        onIonChange={e => {
          const { checked } = e.detail;
          if (checked) {
            setValue('BSSID', wifi.BSSID, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue('SSID', wifi.SSID, {
              shouldDirty: true,
              shouldValidate: true,
            });
          } else {
            setValue('SSID', '');
            setValue('BSSID', '');
          }
        }}>
        {wifi.SSID}
      </IonCheckbox>
    </IonItem>
  );
};
