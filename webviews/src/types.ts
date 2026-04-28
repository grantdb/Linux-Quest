export const GameState = {
  HARDWARE_SELECT: 0,
  USB_PREP: 1,
  BIOS_ENTRY: 2,
  PARTITIONING: 3,
  INSTALL_LOGIC: 4,
  NETWORK_SETUP: 5,
  SYSTEM_SETUP: 6,
  BONUS_DRIVERS: 7,
  REBOOT_VALIDATION: 8,
  SUCCESS: 9,
  FAILURE: 10
} as const;

export type GameState = typeof GameState[keyof typeof GameState] | 'BOOTING';

export type Hardware = 
  | 'AMD_RYZEN' | 'INTEL_CORE' | 'RASPI_ARM' | 'HYBRID_MOBILE';

export type FSFormat = 'FAT32' | 'NTFS' | 'EXT4' | 'ISO9660' | 'UDF' | 'BTRFS';
export type FlashTool = 'Rufus' | 'Ventoy' | 'BalenaEtcher' | 'ImgBurn' | 'Nero Burning ROM' | 'Xfburn';
export type PartitionScheme = 'GPT' | 'MBR' | 'ISO9660' | 'UDF';

export interface Network {
  id: string;
  ssid: string;
  signal: number;
  security: string;
  active: boolean;
}

export interface GameData {
  hardware?: Hardware;
  usbFormat?: FSFormat;
  flashTool?: FlashTool;
  scheme?: PartitionScheme;
  netData?: any;
  biosTime?: number;
  partitionScore?: number;
  driversSuccess?: boolean;
  bootloader?: string;
  initSystem?: string;
  updateFrequency?: string;
  difficultyMultiplier?: number;
  finalScore?: number;
  error?: string;
  leaderboard?: { member: string; score: number }[];
}
