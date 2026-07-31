import { cloudinaryProvider } from "./cloudinary";
import type { VideoProvider } from "./types";

export const videoProvider: VideoProvider = cloudinaryProvider;
export type { VideoProvider, VideoUploadTicket } from "./types";
