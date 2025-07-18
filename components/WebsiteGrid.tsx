import React from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableWebsite } from './SortableWebsite';
import { Website } from '@/types';

interface WebsiteGridProps {
    websites: Website[];
    onContextMenu: (e: React.MouseEvent, website: Website) => void;
    onReorder: (oldIndex: number, newIndex: number) => void;
}

export const WebsiteGrid: React.FC<WebsiteGridProps> = ({
                                                            websites,
                                                            onContextMenu,
                                                            onReorder,
                                                        }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = websites.findIndex((w) => w.id === active.id);
        const newIndex = websites.findIndex((w) => w.id === over.id);
        onReorder(oldIndex, newIndex);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={websites} strategy={verticalListSortingStrategy}>
                <div className="md:mt-51 md:mx-52 sm:mt-16 sm:mx-20 mt-6 mx-5 flex flex-wrap gap-5">
                    {websites.map((website, index) => (
                        <motion.div
                            key={website.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.1,
                                delay: index * 0.01,
                                ease: "easeOut"
                            }}
                        >
                            <SortableWebsite
                                website={website}
                                onContextMenu={onContextMenu}
                            />
                        </motion.div>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};