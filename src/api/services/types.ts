import type { BaseApiResponse } from "../types";

export interface UploadData {
  [key: string]: string | number | boolean;
}

// 카테고리 API 응답 타입
export interface CategoryApiResponse extends BaseApiResponse {
  body: string; // JSON.parse 후: string[] (카테고리 목록)
}

// 덱 API 응답 타입
export interface DeckApiResponse extends BaseApiResponse {
  body: string; // JSON.parse 후: { deck_name: string, cards: Card[] }
}

// 덱 목록 API 응답 타입
export interface DeckListApiResponse extends BaseApiResponse {
  body: string; // JSON.parse 후: { deck_name: string, cards: Card[] }[]
}

// 덱 상태 API 응답 타입
export interface DeckStatusApiResponse extends BaseApiResponse {
  body: string; // JSON.parse 후: { status: string }
}
