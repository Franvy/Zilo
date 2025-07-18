import React, { useRef } from 'react';
import { Website } from '@/types';

interface ImportExportProps {
    websites: Website[];
    onImport: (websites: Website[]) => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({ websites, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                if (Array.isArray(imported)) {
                    const valid = imported.every(item => item.name && item.url && item.icon);
                    if (valid) {
                        const existingIds = new Set(websites.map(w => w.id));
                        let nextId = Math.max(0, ...websites.map(w => w.id)) + 1;

                        const withId = imported.map((item) => {
                            while (existingIds.has(nextId)) {
                                nextId++;
                            }
                            const newItem = { ...item, id: nextId };
                            existingIds.add(nextId);
                            return newItem;
                        });
                        onImport([...websites, ...withId]);
                    } else {
                        alert('导入的数据格式不正确');
                    }
                } else {
                    alert('JSON 内容必须是数组');
                }
            } catch (err) {
                alert('读取文件失败：' + err);
            }
        };
        reader.readAsText(file);
    };

    return (
        <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
    );
};