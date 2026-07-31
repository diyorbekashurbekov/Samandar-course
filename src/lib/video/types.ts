// Storage-agnostic contract for lesson video hosting. `src/lib/video/cloudinary.ts`
// is the only file that knows about Cloudinary specifically — swapping
// providers later means implementing this interface again and changing the
// single export in `src/lib/video/index.ts`.

export type VideoUploadTicket = {
  /** URL the browser uploads the file to directly (never proxied through our server). */
  uploadUrl: string;
  /** Extra form fields the client must include alongside the file in the upload request. */
  fields: Record<string, string | number>;
};

export interface VideoProvider {
  /** Generates a short-lived, signed ticket for a direct browser-to-storage upload. */
  createUploadTicket(params: { folder: string }): Promise<VideoUploadTicket>;
  /** Permanently removes a previously uploaded video. */
  deleteVideo(publicId: string): Promise<void>;
  /** Generates a fresh, cryptographically signed delivery URL for playback. */
  getPlaybackUrl(publicId: string): Promise<string>;
}
