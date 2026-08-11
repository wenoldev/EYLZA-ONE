/**
 * Standard utility for generating Cloudinary folder paths
 * Format: area/storeId/type
 */
export function getStandardUploadPath(
  area: 'products' | 'category' | 'cms' | 'store',
  storeId: string,
  type: 'images' | 'videos' | 'logo' | 'files'
): string {
  const cleanArea = area.trim();
  const cleanStoreId = storeId.trim();
  const cleanType = type.trim();
  
  return `${cleanArea}/${cleanStoreId}/${cleanType}`;
}

/**
 * Interface for signature request parameters
 */
export interface UploadSignatureParams {
  fileName: string;
  area: string;
  storeId: string;
  type: string;
  resourceType?: 'image' | 'video' | 'raw';
}
