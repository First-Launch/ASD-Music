export interface InstrumentDocument {
    id?: string;
    assetTag: string;
    brand: string;
    condition: string;
    hasMouthpiece: boolean;
    inForRepair: boolean;
    model: string;
    needsRepair: boolean;
    primaryPhoto: string;
    serial: string;
    status: string;
    type: string;
    checkedOutTo?: string;  // New field to store student information
}

export interface MusicDocument {
    id: string;
    title: string;
    composer: string;
    arranger?: string;
    description: string;
    notes: string;
    audioUrl?: string;
    infoUrl?: string;
    coverImageUrl?: string;
    gradeLow: string;
    gradeHigh: string;
    type: string;
  }