export interface UploadedPropertyImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

export type UploadPropertyImageResult =
  | { ok: true; data: UploadedPropertyImage }
  | { ok: false; error: string };
