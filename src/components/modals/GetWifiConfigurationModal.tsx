import {
  IonInput,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/react';
import { ComponentProps, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { WifiSecurityProtocol } from '../../utils/WifiSecurityProtocol';
import { SubmitButton } from '../forms/SubmitButton';
import { AvailableWifiList } from '../wifi/AvailableWifiList';
import { ScanButton, ScanButtonProps } from '../wifi/ScanButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FoundWifiDetails } from '../../pages/NewDevicePage';

const wifiDataValidationSchema = z
  .object({
    SSID: z.string().min(1),
    BSSID: z.string(),
    algorithm: z.nativeEnum(WifiSecurityProtocol),
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

type GetWifiConfigurationModalProps = {
  onFormSubmit: (values: WifiDataForm) => void;
  defaultValues: WifiDataForm;
  onSSIDInputHelper: (
    arg0: string | number | null | undefined,
  ) => FoundWifiDetails | undefined;
  availableWifisList: FoundWifiDetails[];
  isLoadingWifis: boolean;
} & ScanButtonProps &
  ComponentProps<typeof IonModal>;

export const GetWifiConfigurationModal = ({
  onFormSubmit,
  isOpen,
  defaultValues,
  onSSIDInputHelper,
  beforeScan,
  onScanSuccess,
  availableWifisList,
  isLoadingWifis,
}: GetWifiConfigurationModalProps) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const form = useForm<WifiDataForm>({
    mode: 'onChange',
    defaultValues: defaultValues,
    resolver: zodResolver(wifiDataValidationSchema),
  });
  const { formState, control, setValue, watch, handleSubmit } = form;
  const algorithm = watch('algorithm');
  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      canDismiss={async (_, role) => role !== 'gesture'}
      initialBreakpoint={1}
      breakpoints={[0, 0.5, 0.75, 1]}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
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
                  const wifiWithMatchingSSID = onSSIDInputHelper(currentValue);
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
        <ScanButton beforeScan={beforeScan} onScanSuccess={onScanSuccess} />
        <FormProvider {...form}>
          {isLoadingWifis ? (
            <IonSpinner />
          ) : (
            <AvailableWifiList wifis={availableWifisList} />
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
  );
};
