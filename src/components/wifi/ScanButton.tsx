import { IonButton } from '@ionic/react';
import { ComponentProps, useCallback } from 'react';
import { FoundWifiDetails } from '../../pages/DEPRECATED2_NewDevicePage';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';

export type ScanButtonProps = {
  beforeScan: () => void;
  onScanSuccess: (wifis: FoundWifiDetails[]) => void;
  onScanFailure?: (err: unknown) => void;
};

export const ScanButton = ({
  beforeScan,
  onScanSuccess,
  onScanFailure = err => console.error(err),
  disabled,
}: ScanButtonProps & ComponentProps<typeof IonButton>) => {
  const onClick = useCallback(() => {
    beforeScan();
    WifiWizard2.scan()
      .then(wifis => {
        onScanSuccess(wifis as FoundWifiDetails[]);
      })
      .catch(onScanFailure);
  }, [beforeScan, onScanFailure, onScanSuccess]);
  return (
    <IonButton expand="block" onClick={onClick} disabled={disabled}>
      Scan
    </IonButton>
  );
};
