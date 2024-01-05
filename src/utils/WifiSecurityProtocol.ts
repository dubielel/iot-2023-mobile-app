export const WifiSecurityProtocol = {
  None: 'None',
  WEP: 'WEP',
  WPA: 'WPA',
  WPA2_WPA3: 'WPA2/WPA3',
  WPA3: 'WPA3',
  WPA_ENTERPRISE: 'WPA Enterprise',
  WPA2_ENTERPRISE: 'WPA2 Enterprise',
  WPA3_ENTERPRISE: 'WPA3 Enterprise',
} as const;

// Values supported by WifiWizard:
// WPA, WPA (for WPA2), WEP or NONE
export const WifiSecurityProtocolMapForWifiWizard = {
  None: 'NONE',
  WEP: 'WEP',
  WPA: 'WPA',
  'WPA2/WPA3': 'WPA',
  WPA3: 'WPA',
  'WPA Enterprise': 'WPA',
  'WPA2 Enterprise': 'WPA',
  'WPA3 Enterprise': 'WPA',
} as const;
