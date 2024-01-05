import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { ScanButton } from '../components/wifi/ScanButton';
import { AvailableWifiList } from '../components/wifi/AvailableWifiList';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '../components/forms/SubmitButton';
import { WifiSecurityProtocol } from '../utils/WifiSecurityProtocol';
import { checkmarkOutline } from 'ionicons/icons';
import { IonLabelRight } from '../components/helpers/IonLabelRight';

const wifiDataValidationSchema = z
  .object({
    SSID: z.string().min(1),
    BSSID: z.string(),
    algorithm: z.string(),
    password: z.string().optional(),
  })
  .refine(
    ({ algorithm, password }) => {
      if (algorithm !== WifiSecurityProtocol.None && password?.length === 0)
        return false;
      return true;
    },
    { message: 'Password is required with security protocol' },
  );

export type WifiDataForm = z.infer<typeof wifiDataValidationSchema>;
type WifiConfig = Omit<WifiDataForm, 'BSSID'>;

export type FoundWifiDetails = {
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

export const NewDevicePage = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isLoadingWifis, setIsLoadingWifis] = useState<boolean | null>(null);
  const [availableWifis, setAvailableWifis] = useState<FoundWifiDetails[]>([]);

  const [selectedWifi, setSelectedWifi] = useState<WifiConfig>({
    SSID: '',
    algorithm: WifiSecurityProtocol.None,
    password: '',
  });

  const [enabledAPN, setEnabledAPN] = useState(false);

  const form = useForm<WifiDataForm>({
    mode: 'onChange',
    defaultValues: {
      ...selectedWifi,
      BSSID: '',
    },
    resolver: zodResolver(wifiDataValidationSchema),
  });
  const { formState, control, setValue, watch, handleSubmit } = form;
  const algorithm = watch('algorithm');

  // DEBUG CODE
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(value, name, type),
        console.log(wifiDataValidationSchema.safeParse(value));
    });
    console.debug(formState);
    return () => subscription.unsubscribe();
  }, [watch, formState]);
  // DEBUG CODE END

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Configure new device</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <IonList>
          <IonNote>Steps to configure new device:</IonNote>
          <IonItem>
            <IonLabel color="dark">
              1. Provide WIFI network configuration to be sent to the device
            </IonLabel>
            {selectedWifi.SSID === '' ? (
              <IonButton slot="end" onClick={() => setIsOpen(true)}>
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
              <IonButton slot="end" onClick={() => setIsOpen(true)}>
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

        <IonModal
          ref={modal}
          isOpen={isOpen}
          canDismiss={async (_, role) => role !== 'gesture'}
          initialBreakpoint={1}
          breakpoints={[0, 0.5, 0.75, 1]}>
          <form
            onSubmit={handleSubmit(values => {
              const { BSSID: _, ...wifiConfig } = values;
              setSelectedWifi(wifiConfig);
              setIsOpen(false);
            })}>
            <Controller
              name="SSID"
              control={control}
              render={({ field }) => {
                return (
                  <IonInput
                    label="Enter WiFi SSID"
                    labelPlacement="stacked"
                    type="text"
                    placeholder="SSID"
                    value={field.value}
                    onIonInput={event => {
                      const currentValue = event.target.value;
                      const wifiWithMatchingSSID = availableWifis.find(
                        wifi => wifi.SSID === currentValue,
                      );
                      setValue('BSSID', wifiWithMatchingSSID?.BSSID ?? '');
                      field.onChange(currentValue);
                    }}
                  />
                );
              }}
            />
            <IonNote>
              Or scan for available networks and select one from list
            </IonNote>
            <ScanButton
              beforeScan={() => setIsLoadingWifis(true)}
              onScanSuccess={wifis => {
                setAvailableWifis(wifis);
                setIsLoadingWifis(false);
              }}
            />
            <FormProvider {...form}>
              {isLoadingWifis ? (
                <IonSpinner />
              ) : (
                <AvailableWifiList
                  wifis={availableWifis.filter(wifi => wifi.BSSID !== '')}
                />
              )}
            </FormProvider>

            <Controller
              name="algorithm"
              control={control}
              render={({ field }) => {
                return (
                  <IonSelect
                    label="Security protocol"
                    placeholder="Select"
                    value={field.value}
                    onIonChange={event => field.onChange(event.target.value)}>
                    {Object.values(WifiSecurityProtocol).map(value => (
                      <IonSelectOption key={value} value={value}>
                        {value}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                );
              }}
            />
            {algorithm !== WifiSecurityProtocol.None && (
              <Controller
                name="password"
                control={control}
                render={({ field }) => {
                  return (
                    <IonInput
                      label="Enter WiFi password"
                      labelPlacement="stacked"
                      type="password"
                      placeholder="PASSWORD"
                      value={field.value}
                      onIonInput={event => field.onChange(event.target.value)}
                    />
                  );
                }}
              />
            )}
            <SubmitButton formState={formState}>Continue</SubmitButton>
          </form>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
