export const GameState = {
  HARDWARE_SELECT: 0,
  USB_PREP: 1,
  BIOS_ENTRY: 2,
  INSTALL_LOGIC: 3,
  PARTITIONING: 4,
  REBOOT_VALIDATION: 5,
  BONUS_DRIVERS: 6,
  SUCCESS: 7,
  FAILURE: 8
} as const;

export type GameState = typeof GameState[keyof typeof GameState];

export type Hardware = 'LAPTOP' | 'PC' | 'HIGH_END';
export type FSFormat = 'FAT32' | 'NTFS';

export interface GameData {
  hardware?: Hardware;
  usbFormat?: FSFormat;
  flashTool?: string;
  biosTime?: number;
  partitionScore?: number;
  driversSuccess?: boolean;
  difficultyMultiplier?: number;
  finalScore?: number;
  error?: string;
  leaderboard?: { member: string; score: number }[];
}
