export interface OpeningListItem {
  id: string;
  name: string;
  description: string;
  ecoCode: string;
  movesCount: number;
  author: string;
  createdAt: string;
}

export interface OpeningDetail {
  id: string;
  name: string;
  description: string;
  ecoCode: string;
  moves: string;
  isPublic: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningRequest {
  name: string;
  description?: string;
  ecoCode?: string;
  moves: string;
  isPublic?: boolean;
}
