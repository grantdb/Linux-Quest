export const GameState = {
  HARDWARE_SELECT: 0,
  USB_PREP: 1,
  NETWORK_SETUP: 2,
  BIOS_ENTRY: 3,
  SYSTEM_SETUP: 4,
  PARTITIONING: 5,
  INSTALL_LOGIC: 6,
  BONUS_DRIVERS: 7,
  REBOOT_VALIDATION: 8,
  SUCCESS: 9,
  FAILURE: 10
} as const;

export type GameState = typeof GameState[keyof typeof GameState] | 'BOOTING';

export type Hardware = 
  | 'AMD_RYZEN' | 'INTEL_CORE' | 'NVIDIA_RTX' | 'HYBRID_MOBILE';

export type FSFormat = 'FAT32' | 'NTFS' | 'EXT4' | 'ISO9660' | 'UDF';
export type FlashTool = 'Rufus' | 'Ventoy' | 'BalenaEtcher' | 'ImgBurn' | 'Nero Burning ROM' | 'Xfburn';
export type PartitionScheme = 'GPT' | 'MBR' | 'ISO9660' | 'UDF';

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
