import { useState, useEffect } from 'react';
import { Website } from '@/types';

const defaultWebsites: Website[] = [
    {
        "id": 1,
        "name": "Github",
        "url": "https://github.com",
        "icon": "https://s2.loli.net/2025/07/10/YHJAd9lr8enD2NM.webp"
    },
    {
        "id": 2,
        "name": "Mail",
        "url": "https://mail.google.com/mail",
        "icon": "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico"
    },
    {
        "id": 3,
        "name": "Youtube",
        "url": "https://www.youtube.com",
        "icon": "https://www.google.com/s2/favicons?domain=www.youtube.com&sz=256"
    },
    {
        "id": 4,
        "name": "Apple",
        "url": "https://www.apple.com",
        "icon": "https://s2.loli.net/2025/07/08/lvCOQUYI2D5ySaN.webp"
    },
    {
        "id": 5,
        "name": "Bilibili",
        "url": "https://www.bilibili.com",
        "icon": "https://www.google.com/s2/favicons?domain=www.bilibili.com&sz=256"
    },
    {
        "id": 6,
        "name": "Cloudflare",
        "url": "https://dash.cloudflare.com",
        "icon": "https://www.google.com/s2/favicons?domain=dash.cloudflare.com&sz=256"
    },
    {
        "id": 7,
        "name": "Windy",
        "url": "https://www.windy.com",
        "icon": "https://www.google.com/s2/favicons?domain=www.windy.com&sz=256"
    },
    {
        "id": 8,
        "name": "Rust",
        "url": "https://www.rust-lang.org",
        "icon": "https://www.google.com/s2/favicons?domain=www.rust-lang.org&sz=256"
    },
    {
        "id": 9,
        "name": "Shadcn",
        "url": "https://ui.shadcn.com",
        "icon": "https://www.google.com/s2/favicons?domain=ui.shadcn.com&sz=256"
    },
    {
        "id": 10,
        "name": "React",
        "url": "https://zh-hans.react.dev",
        "icon": "https://s2.loli.net/2025/07/10/hLvA6mwsxPDVcWY.webp"
    },
    {
        "id": 11,
        "name": "Follow",
        "url": "https://app.follow.is",
        "icon": "https://www.google.com/s2/favicons?domain=app.follow.is&sz=256"
    },
    {
        "id": 12,
        "name": "Canva",
        "url": "https://www.canva.com",
        "icon": "https://www.google.com/s2/favicons?domain=www.canva.com&sz=256"
    },
    {
        "id": 13,
        "name": "Linux",
        "url": "https://linux.do",
        "icon": "https://www.google.com/s2/favicons?domain=linux.do&sz=256"
    },
    {
        "id": 14,
        "name": "Claude",
        "url": "https://claude.ai/new",
        "icon": "https://s2.loli.net/2025/07/08/s3jRlJngOaUemrz.webp"
    },
    {
        "id": 15,
        "name": "Nextjs",
        "url": "https://nextjs.org/docs",
        "icon": "https://s2.loli.net/2025/07/08/qKTo4Dh3V2FwcsY.webp"
    },
    {
        "id": 16,
        "name": "V0",
        "url": "https://v0.dev",
        "icon": "https://www.google.com/s2/favicons?domain=v0.dev&sz=256"
    },
    {
        "id": 17,
        "name": "Vercel",
        "url": "https://vercel.com",
        "icon": "https://www.google.com/s2/favicons?domain=vercel.com&sz=256"
    },
    {
        "id": 18,
        "name": "Insta360",
        "url": "https://www.insta360.com",
        "icon": "https://s2.loli.net/2025/07/08/Er4pjkQlZoz7yNJ.webp"
    },
    {
        "id": 19,
        "name": "Dji",
        "url": "https://www.dji.com",
        "icon": "https://www.google.com/s2/favicons?domain=www.dji.com&sz=256"
    },
    {
        "id": 20,
        "name": "Producthunt",
        "url": "https://www.producthunt.com",
        "icon": "https://www.google.com/s2/favicons?domain=www.producthunt.com&sz=256"
    },
    {
        "id": 21,
        "name": "Gemini",
        "url": "https://gemini.google.com/app",
        "icon": "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=256"
    },
    {
        "id": 22,
        "name": "Tailwind",
        "url": "https://tailwind.nodejs.cn",
        "icon": "https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=256"
    },
    {
        "id": 23,
        "name": "MDN",
        "url": "https://developer.mozilla.org",
        "icon": "https://www.google.com/s2/favicons?domain=developer.mozilla.org&sz=256"
    },
    {
        "id": 24,
        "name": "Compressor",
        "url": "https://compressor.io/",
        "icon": "https://compressor.io/pro-icon.svg"
    },
    {
        "id": 25,
        "name": "Astro",
        "url": "https://docs.astro.build",
        "icon": "https://docs.astro.build/favicon.svg"
    },
    {
        "id": 26,
        "name": "Iconfont",
        "url": "https://www.iconfont.cn/",
        "icon": "https://www.google.com/s2/favicons?domain=www.iconfont.cn&sz=256"
    },
    {
        "id": 27,
        "name": "ClaudeCode",
        "url": "https://docs.anthropic.comw",
        "icon": "https://s2.loli.net/2025/07/14/PoqDdYm7xk2bAtK.webp"
    },
    {
        "id": 28,
        "name": "Motion",
        "url": "https://motion.dev/examples",
        "icon": "https://www.google.com/s2/favicons?domain=motion.dev&sz=256"
    },
    {
        "id": 29,
        "name": "Aiven",
        "url": "https://console.aiven.io",
        "icon": "https://s2.loli.net/2025/07/15/i1utzV93jB74Srl.webp"
    }
];

export const useWebsiteData = () => {
    const [websites, setWebsites] = useState<Website[]>(defaultWebsites);

    // 从本地存储加载数据
    useEffect(() => {
        const saved = localStorage.getItem('my-websites');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setWebsites(parsed);
                }
            } catch (err) {
                console.error('读取本地网站数据失败:', err);
            }
        }
    }, []);

    // 保存数据到本地存储
    useEffect(() => {
        localStorage.setItem('my-websites', JSON.stringify(websites));
    }, [websites]);

    const addWebsite = (website: Omit<Website, 'id'>) => {
        const newWebsite: Website = {
            ...website,
            id: Math.max(0, ...websites.map(w => w.id)) + 1,
        };
        setWebsites([...websites, newWebsite]);
    };

    const updateWebsite = (id: number, updates: Partial<Website>) => {
        setWebsites(websites.map(website =>
            website.id === id ? { ...website, ...updates } : website
        ));
    };

    const deleteWebsite = (id: number) => {
        setWebsites(websites.filter(website => website.id !== id));
    };

    const reorderWebsites = (oldIndex: number, newIndex: number) => {
        const newWebsites = [...websites];
        const [removed] = newWebsites.splice(oldIndex, 1);
        newWebsites.splice(newIndex, 0, removed);
        setWebsites(newWebsites);
    };

    return {
        websites,
        setWebsites,
        addWebsite,
        updateWebsite,
        deleteWebsite,
        reorderWebsites,
    };
};
