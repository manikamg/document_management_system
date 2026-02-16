// fileTypeFeature.js
import axios from "axios";

// export const checkFileType = async (url) => {
//     try {
//         const res = await fetch(url, { method: 'HEAD' , mode: 'no-cors'});
//         const contentType = res.headers.get('Content-Type');
//         console.log(contentType)

//         if (!contentType) return 'unknown';

//         if (contentType.startsWith('image/')) return 'image';
//         if (contentType === 'application/pdf') return 'pdf';

//         return 'unknown';
//     } catch (err) {
//         console.error('Error checking file type:', err);
//         return 'unknown';
//     }
// };

export const checkFileType = (url) => {
    return new Promise((resolve) => { 
        const img = new Image(); 
        img.onload = () => resolve("image"); 
        img.onerror = () => resolve("pdf"); 
        img.src = url; 
    });
};
