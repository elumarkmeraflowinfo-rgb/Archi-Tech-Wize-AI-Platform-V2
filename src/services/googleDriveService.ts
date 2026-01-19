import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export const authenticateDrive = async (): Promise<string> => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope(SCOPES);

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential || !credential.accessToken) {
        throw new Error("Failed to get Google Drive access token.");
    }

    return credential.accessToken;
};

export const uploadToDrive = async (file: File, accessToken: string): Promise<{ id: string, webViewLink: string }> => {
    const metadata = {
        name: file.name,
        mimeType: file.type,
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: form,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Drive upload failed');
    }

    return await response.json();
};

export const deleteFromDrive = async (fileId: string, accessToken: string) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        console.warn('Failed to delete file from Drive. It might verify permissions or already be deleted.');
    }
};
