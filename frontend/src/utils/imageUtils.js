/**
 * Transforms Cloudinary URLs to use automatic format & quality optimization.
 * Leaves non-Cloudinary URLs unchanged.
 */
export const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  // Insert optimization parameters after 'upload/'
  return url.replace('upload/', 'upload/f_auto,q_auto/');
};