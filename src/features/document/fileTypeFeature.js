// fileTypeFeature.js

export const checkFileType = async (url) => {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        const contentType = res.headers.get('Content-Type');

        if (!contentType) return 'unknown';

        if (contentType.startsWith('image/')) return 'image';
        if (contentType === 'application/pdf') return 'pdf';
        
        return 'unknown';
    } catch (err) {
        console.error('Error checking file type:', err);
        return 'unknown';
    }
};
