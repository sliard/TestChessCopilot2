/** Types for chess openings */

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
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserOpening {
  id: string;
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  movesCount: number;
  isPublic: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserOpeningListItem {
  id: string;
  name: string;
  description: string;
  ecoCode?: string;
  movesCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpeningRequest {
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  isPublic: boolean;
}

export interface UpdateOpeningRequest {
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  isPublic: boolean;
}

export interface UpdateVisibilityRequest {
  isPublic: boolean;
}

export interface MovesValidationResult {
  valid: boolean;
  error?: string;
  position?: string;
}
