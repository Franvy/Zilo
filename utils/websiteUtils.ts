export const imageUrlToBase64 = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('转换图片失败:', error);
        return null;
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
};

export const compressImage = (file: File, maxWidth: number = 256, quality: number = 0.9): Promise<Blob> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const maxSize = maxWidth;

        img.onload = () => {
            if (!ctx) return;

            let { width, height } = img;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
            }, file.type.startsWith('image/png') ? 'image/png' : 'image/jpeg', quality);
        };

        img.src = URL.createObjectURL(file);
    });
};

export const parseWebsiteInfo = async (url: string) => {
    if (!url) return null;

    try {
        let finalUrl = url;
        if (!url.match(/^https?:\/\//)) {
            finalUrl = 'https://' + url;
        }

        let urlObj: URL;
        try {
            urlObj = new URL(finalUrl);
        } catch (err) {
            console.error('非法URL:', err);
            return null;
        }

        const domain = urlObj.hostname;
        let siteName = domain.replace('www.', '').split('.')[0];
        siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);

        const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
        const base64Icon = await imageUrlToBase64(iconUrl);

        return {
            name: siteName,
            url: finalUrl,
            icon: base64Icon || iconUrl,
        };
    } catch (error) {
        console.error('解析URL失败:', error);
        return {
            name: '',
            url: url.startsWith('http') ? url : 'https://' + url,
            icon: '',
        };
    }
};