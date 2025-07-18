import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Website } from '@/types';

interface SortableWebsiteProps {
    website: Website;
    onContextMenu: (e: React.MouseEvent, website: Website) => void;
}

export const SortableWebsite: React.FC<SortableWebsiteProps> = ({
                                                                    website,
                                                                    onContextMenu,
                                                                }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: website.id
    });
    const [isHovered, setIsHovered] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab',
    };

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            data-website-item=""
            data-website-id={website.id}
            onClick={() => window.open(website.url, '_blank')}
            onContextMenu={(e) => onContextMenu(e, website)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`cursor-pointer flex flex-col items-center w-18 mt-4 border-amber-50 flex-shrink-0 transition-all duration-200 ease-in-out ${
                isHovered ? 'transform scale-110' : 'transform scale-100'
            }`}
        >
            <div className={`w-18 h-18 bg-white flex rounded-xl items-center justify-center transition-all duration-200 ease-in-out ${
                isHovered ? 'shadow-lg shadow-white/20' : ''
            }`}>
                <img
                    src={website.icon}
                    alt={website.name}
                    width={64}
                    height={64}
                    className={`rounded-lg transition-all duration-200 ease-in-out ${
                        isHovered ? 'brightness-110' : ''
                    }`}
                />
            </div>
            <p className={`mt-1 text-white text-xs leading-tight transition-all duration-200 ease-in-out ${
                isHovered ? 'text-blue-300' : ''
            }`}>
                {website.name}
            </p>
        </div>
    );
};