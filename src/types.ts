export type PaletteId = 'variant1' | 'variant2' | 'variant3' | 'variant4' | 'variant5' | 'variant6';

export interface Palette {
  id: PaletteId;
  name: string;
  description: string;
  bg: string;
  cardBg: string;
  borderColor: string;
  textMuted: string;
  textAccent: string;
  textAccentHover: string;
  accentBg: string;
  accentGlow: string;
  accentButton: string;
  accentButtonHover: string;
  accentBadge: string;
  inputBg: string;
  footerBg: string;
}

export interface UploadedBlob {
  owner: string;
  blobName: string;
  blobCommitment: string;
  createdAt: string;
  expiresAt: string;
  size: number;
  isWritten: boolean;
  sliceAddress?: string;
  transactionHash?: string;
  type?: 'encrypted' | 'public' | 'private';
}

export interface ValidatorNode {
  id: string;
  name: string;
  uptime: number;
  commission: number;
  totalStaked: number;
  location: string;
  status: 'active' | 'inactive';
}

export interface PinnedVault {
  id: string;
  name: string;
  filesCount: number;
  type: 'docs' | 'identity' | 'memories';
}
