import { v2 as cloudinary } from "cloudinary";
import type { VideoProvider, VideoUploadTicket } from "./types";

function client() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

// Videos are uploaded with delivery type "authenticated" so the raw
// Cloudinary URL is unusable without a valid signature — playback always
// goes through getPlaybackUrl(), never the URL returned at upload time.
const DELIVERY_TYPE = "authenticated";

export const cloudinaryProvider: VideoProvider = {
  async createUploadTicket({ folder }): Promise<VideoUploadTicket> {
    const c = client();
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = {
      folder,
      timestamp,
      type: DELIVERY_TYPE,
    };
    const signature = c.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET ?? "");

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
      fields: {
        api_key: process.env.CLOUDINARY_API_KEY ?? "",
        timestamp,
        signature,
        folder,
        type: DELIVERY_TYPE,
      },
    };
  },

  async deleteVideo(publicId: string): Promise<void> {
    const c = client();
    await c.uploader.destroy(publicId, { resource_type: "video", type: DELIVERY_TYPE });
  },

  async getPlaybackUrl(publicId: string): Promise<string> {
    const c = client();
    return c.url(publicId, {
      resource_type: "video",
      type: DELIVERY_TYPE,
      sign_url: true,
      secure: true,
    });
  },
};
