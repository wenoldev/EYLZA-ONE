/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from "./cloudinary";

export async function uploadFileToCloudinary(
  folder: string,
  storeId: string,
  fileName: string,
  fileContent: string
) {
  try {
    const base64Data = fileContent.replace(/^data:.*;base64,/, "");

    const uploadResult = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      {
        folder: `${folder}/${storeId}`,
        public_id: fileName.replace(/\.[^/.]+$/, ""),
        overwrite: true,
        resource_type: "image",
      }
    );

    return {
      filePath: uploadResult.public_id,
      publicUrl: uploadResult.secure_url,
    };

  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

export function extractPublicId(input: string): string {
  try {
    let afterUpload: string;

    if (input.includes("/upload/")) {
      const parts = input.split("/upload/");
      if (parts.length < 2) {
        throw new Error("Invalid Cloudinary path: missing '/upload/'");
      }
      afterUpload = parts[1];
    } else {
      afterUpload = input;
    }
    let cleaned = afterUpload.replace(/^v\d+\//, "");
    cleaned = cleaned.replace(/\.[^/.]+$/, "");
    cleaned = cleaned.replace(/^\/+|\/+$/g, "");

    return cleaned;
  } catch (err: any) {
    console.error("extractPublicId error:", err.message, "Input:", input);
    return "";
  }
}

export async function deleteFileFromCloudinary(url: string) {
  try {
    if (!url) {
      console.error("deleteFileFromCloudinary: no URL provided");
      return;
    }
    const publicId = extractPublicId(url);
    if (!publicId) {
      console.error("deleteFileFromCloudinary: invalid publicId extracted");
      return;
    }
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      console.error("Cloudinary delete failed:", result);
    } else {
      console.log("Cloudinary delete success:", publicId);
    }
  } catch (err: any) {
    console.error("deleteFileFromCloudinary error:", err.message);
  }
}