export const getOptimizedPhotoUrl = (url: string | null, width = 400, height = 400) => {
  if (!url) return null;
  if (!url.includes("ik.imagekit.io")) return url;
  
  try {
    const parts = url.split("/");
    const idPart = parts[3]; // e.g. "your_id"
    // Insert transformation after the ID or endpoint part
    // Using fo-face to focus on the person's face if it's an avatar
    const transformedUrl = url.replace(`/${idPart}/`, `/${idPart}/tr:w-${width},h-${height},fo-face/`);
    return transformedUrl;
  } catch (e) {
    return url;
  }
};
