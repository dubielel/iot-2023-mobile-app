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

// "None" | "WEP" | "WPA" | "WPA2/WPA3" | "WPA3" | "WPA Enterprise" | "WPA2 Enterprise" | "WPA3 Enterprise"
export const WifiSecurityProtocolMapForSTM = {
  None: 0, // Open
  WEP: 1, // WEP
  WPA: 2097156, // WPA_AES_PSK
  'WPA2/WPA3': 4194308, // WPA2_AES_PSK
  WPA3: -1, // IDK
  'WPA Enterprise': -1, // IDK
  'WPA2 Enterprise': -1, // IDK
  'WPA3 Enterprise': -1, // IDK
  // IDK WEP_TKIP_PSK 2097154
  // IDK WPA2_TKIP_PSK 4194306
  // IDK WPA2_MIXED_PSK 4194310
} as const;
export type WifiSecurityProtocolMapForSTMValues =
  (typeof WifiSecurityProtocolMapForSTM)[keyof typeof WifiSecurityProtocolMapForSTM];
