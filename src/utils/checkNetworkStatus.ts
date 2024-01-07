import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';
import { Network } from '@capacitor/network';

type NetworkStatus = {
  connected: boolean;
  connectionType: 'cellular' | 'none' | 'unknown';
  ssid: undefined;
};
type WifiNetworkStatus = {
  connected: boolean;
  connectionType: 'wifi';
  ssid: string;
};

export const checkNetworkStatus = async (): Promise<
  NetworkStatus | WifiNetworkStatus
> => {
  const { connected, connectionType } = await Network.getStatus();
  if (!connected)
    return Promise.reject(`Couldn't resolve connection to the Internet`);

  if (connectionType !== 'wifi')
    return Promise.resolve({ connected, connectionType, ssid: undefined });

  const ssid = (await WifiWizard2.getConnectedSSID()) as string;
  return Promise.resolve({
    connected,
    connectionType,
    ssid,
  });
};

export const isWifiNetworkStatus = (
  status: NetworkStatus | WifiNetworkStatus,
): status is WifiNetworkStatus => {
  return (status as WifiNetworkStatus).ssid !== undefined;
};
