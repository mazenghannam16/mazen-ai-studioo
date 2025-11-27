export interface PromptResult {
  english: string;
  arabic: string;
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: PromptResult | null;
  error: string | null;
}

export type ImageSourceType = 'file' | 'url';

export interface ImageData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}