import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  useIonAlert,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import {
  WifiSecurityProtocol,
  WifiSecurityProtocolMapForWifiWizard,
} from '../utils/WifiSecurityProtocol';
import { checkmarkOutline } from 'ionicons/icons';
import { IonLabelRight } from '../components/helpers/IonLabelRight';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';
import { useHistory } from 'react-router';
import { ConnectionType } from '@capacitor/network';
import { checkNetworkStatus } from '../utils/checkNetworkStatus';
import { WaitToConfigureDeviceModal } from '../components/modals/WaitToConfigureDeviceModal';
import {
  GetWifiConfigurationModal,
  WifiDataForm,
} from '../components/modals/GetWifiConfigurationModal';

type WifiConfig = Omit<WifiDataForm, 'BSSID'>;

type FoundWifiDetails = {
  BSSID: string;
  SSID: string;
  capabilities: string;
  centerFreq0: number;
  centerFreq1: number;
  channelWidth: number;
  frequency: number;
  level: number;
  timestamp: number;
};

type DeviceConfig = {
  deviceId: string;
  primaryKey: string;
  secondaryKey: string;
  connectionString: string;
};

const NewDevicePage = () => {
  const [currentINetConnType, setCurrentINetConnType] =
    useState<ConnectionType>('unknown');
  const [currentINetConnSSID, setCurrentINetConnSSID] = useState<
    string | undefined
  >(undefined);

  // TODO (FUTURE) integrate presenting alert and awaiting
  // for user interaction with button to execute retry
  const [presentAlert, dismissAlert] = useIonAlert();
  const history = useHistory();
  useEffect(() => {
    if (currentINetConnSSID || currentINetConnType === 'cellular') return;

    checkNetworkStatus()
      .then(networkStatus => {
        setCurrentINetConnType(networkStatus.connectionType);
        setCurrentINetConnSSID(networkStatus.ssid);
      })
      .catch(err => {
        console.error(err);
        dismissAlert().then(() => {
          presentAlert({
            message: `You are not connected to the Internet! Connect and try again.`,
            buttons: [
              {
                text: 'OK',
                handler: () => history.goBack(), // TODO prevent android hardware button from going back
              },
            ],
            backdropDismiss: false,
          });
        });
      });
  }, [
    currentINetConnSSID,
    dismissAlert,
    presentAlert,
    history,
    currentINetConnType,
  ]);

  const [isGetWifiConfigurationModalOpen, setIsGetWifiConfigurationModalOpen] =
    useState(false);

  const [isLoadingWifis, setIsLoadingWifis] = useState<boolean | null>(null);
  const [availableWifis, setAvailableWifis] = useState<FoundWifiDetails[]>([]);

  const [selectedWifi, setSelectedWifi] = useState<WifiConfig>({
    SSID: '',
    algorithm: WifiSecurityProtocol.None,
    password: '',
  });

  const [enabledAPN, setEnabledAPN] = useState<boolean>(false);

  // GET request to Azure to ask for new device configuration data (key)
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig | undefined>(
    undefined,
  );

  const [isConfiguringDeviceCompleted, setIsConfiguringDeviceCompleted] =
    useState<boolean>(false);

  useEffect(() => {
    if (!enabledAPN) return;

    // Connect to device's APN -- hardcoded configuration
    // TODO for mock purposes we connect to provided WIFI configuration
    WifiWizard2.connect(
      selectedWifi.SSID,
      true,
      selectedWifi.password,
      WifiSecurityProtocolMapForWifiWizard[selectedWifi.algorithm],
    )
      .then(v => console.debug(v))
      .catch(e => console.error(e));

    // Send POST request with provided WIFI configuration to device
    // and wait for device's response that request was successful
    // and for device's data

    // Switch from device's APN to 'main' network
  }, [enabledAPN, selectedWifi]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonList>
          <IonNote>Steps to configure new device:</IonNote>
          <IonItem>
            <IonLabel color="dark">
              1. Provide WIFI network configuration to be sent to the device
            </IonLabel>
            {selectedWifi.SSID === '' ? (
              <IonButton
                slot="end"
                onClick={() => setIsGetWifiConfigurationModalOpen(true)}>
                Let&apos;s do it!
              </IonButton>
            ) : (
              <IonBadge color="success">
                <IonIcon icon={checkmarkOutline} />
              </IonBadge>
            )}
          </IonItem>
          {!(selectedWifi.SSID === '') && (
            <IonItem>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <IonLabel>Provided WIFI network configuration:</IonLabel>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <IonLabel>SSID:</IonLabel>
                  <IonLabelRight>{selectedWifi.SSID}</IonLabelRight>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <IonLabel>Security protocol:</IonLabel>
                  <IonLabelRight>{selectedWifi.algorithm}</IonLabelRight>
                </div>
                {selectedWifi.password && (
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <IonLabel>Password length:</IonLabel>
                    <IonLabelRight>
                      {selectedWifi.password.length}
                    </IonLabelRight>
                  </div>
                )}
              </div>
              <IonButton
                slot="end"
                onClick={() => setIsGetWifiConfigurationModalOpen(true)}
                disabled={enabledAPN}>
                Correct
              </IonButton>
            </IonItem>
          )}
          <IonItem>
            <IonLabel color="dark">2. Click button on the device</IonLabel>
            {!enabledAPN ? (
              <IonButton
                slot="end"
                onClick={() => setEnabledAPN(true)}
                disabled={selectedWifi.SSID === ''}>
                {selectedWifi.SSID === ''
                  ? 'Do steps before!'
                  : "I've done it!"}
              </IonButton>
            ) : (
              <IonBadge color="success">
                <IonIcon icon={checkmarkOutline} />
              </IonBadge>
            )}
          </IonItem>
        </IonList>

        <GetWifiConfigurationModal
          onFormSubmit={values => {
            const { BSSID: _, ...wifiConfig } = values;
            setSelectedWifi(wifiConfig);
            setIsGetWifiConfigurationModalOpen(false);
          }}
          isOpen={isGetWifiConfigurationModalOpen}
          defaultValues={{ ...selectedWifi, BSSID: '' }}
          onSSIDInputHelper={ssid =>
            availableWifis.find(wifi => wifi.SSID === ssid)
          }
          beforeScan={() => setIsLoadingWifis(true)}
          onScanSuccess={wifis => {
            setAvailableWifis(wifis);
            setIsLoadingWifis(false);
          }}
          availableWifisList={availableWifis.filter(wifi => wifi.BSSID !== '')}
          isLoadingWifis={isLoadingWifis ?? false}
        />

        <WaitToConfigureDeviceModal
          isOpen={enabledAPN && !isConfiguringDeviceCompleted}
        />
      </IonContent>
    </IonPage>
  );
};
