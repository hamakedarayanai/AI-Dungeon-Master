
export interface StorySegment {
  text: string;
  from: 'user' | 'ai';
}

export enum GameState {
  INITIAL = 'initial',
  PLAYING = 'playing',
  LOADING = 'loading',
  ERROR = 'error',
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export interface GeminiResponse {
  storyText: string;
  choices: string[];
}
