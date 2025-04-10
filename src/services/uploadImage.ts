export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "studyRats");

    const cloudnaryURL = import.meta.env.VITE_CLOUDINARY_URL;

    const response = await fetch(cloudnaryURL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
  } catch (err) {
    console.error("Erro no upload para o Cloudinary:", err);
    throw err;
  }
}
