import router from 'next/router';

const WEBP_STORAGEKEY = 'webpkey';

const lossy = 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
const detectWebp = (): boolean => {
    if (!process.browser) return true;
    const valueFromLocalStorage = window.localStorage.getItem(WEBP_STORAGEKEY);
    if (valueFromLocalStorage === '1') return true;
    if (valueFromLocalStorage === '0') return false;

    const img = new Image();
    const onFail = () => {
        window.localStorage.setItem(WEBP_STORAGEKEY, '0');
        router.reload();
    };

    img.onload = () => {
        if (img.width > 0 && img.height > 0) {
            window.localStorage.setItem(WEBP_STORAGEKEY, '1');
        } else {
            onFail();
        }
    };

    img.onerror = onFail;
    img.src = `data:image/webp;base64,${lossy}`;
    return true;
};

export const isWebpSupported = detectWebp();
