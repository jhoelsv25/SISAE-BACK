export interface BiometricDeviceConfig {
  id: string;
  ip: string;
  port: number;
  timeout: number;
  inport: number;
  isActive: boolean;
}

export interface BiometricConfigRepoPort {
  getActive(): Promise<BiometricDeviceConfig | null>;
  upsert(config: Omit<BiometricDeviceConfig, 'id'>): Promise<BiometricDeviceConfig>;
}
