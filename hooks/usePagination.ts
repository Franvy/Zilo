import { useState, useEffect } from 'react';
import { Website } from '@/types';

export const usePagination = (websites: Website[], itemsPerPage: number = 36) => {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(websites.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentWebsites = websites.slice(startIndex, endIndex);

    // 键盘和滚轮导航
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                if (currentPage > 0) {
                    setCurrentPage(prev => prev - 1);
                }
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                if (currentPage < totalPages - 1) {
                    setCurrentPage(prev => prev + 1);
                }
            }
        };

        let isScrolling = false;
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (isScrolling) return;
            isScrolling = true;

            if (e.deltaY > 0) {
                if (currentPage < totalPages - 1) {
                    setCurrentPage(prev => prev + 1);
                }
            } else {
                if (currentPage > 0) {
                    setCurrentPage(prev => prev - 1);
                }
            }

            setTimeout(() => {
                isScrolling = false;
            }, 300);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [currentPage, totalPages]);

    return {
        currentPage,
        totalPages,
        currentWebsites,
        setCurrentPage,
    };
};