import { supabase } from '../supabase';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
    provider: 'supabase' | 'cloudinary';
    providerRef: string;
    downloadURL: string;
}

export const uploadToSupabase = async (file: File, uid: string): Promise<UploadResult> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uid}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`; // Sanitize

    const { data, error } = await supabase.storage
        .from('user_uploads')
        .upload(fileName, file);

    if (error) {
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('user_uploads')
        .getPublicUrl(fileName);

    return {
        provider: 'supabase',
        providerRef: fileName,
        downloadURL: publicUrl
    };
};

export const deleteFromSupabase = async (path: string) => {
    const { error } = await supabase.storage
        .from('user_uploads')
        .remove([path]);

    if (error) {
        console.error('Error deleting from Supabase:', error);
        // Best effort, don't throw to block firestore delete
    }
};

export const uploadToCloudinary = async (file: File, uid: string): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `architechwize_ai/${uid}/`);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();

    return {
        provider: 'cloudinary',
        providerRef: data.public_id,
        downloadURL: data.secure_url
    };
};
