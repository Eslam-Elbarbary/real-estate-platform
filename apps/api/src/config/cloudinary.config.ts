import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  apiKey: process.env.CLOUDINARY_API_KEY ?? '',
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  folder: process.env.CLOUDINARY_FOLDER ?? 'aqarmap',
  /** Local dev only — bypass TLS verification when Node cannot verify Cloudinary certs. */
  tlsInsecure: process.env.CLOUDINARY_TLS_INSECURE === 'true',
}));
