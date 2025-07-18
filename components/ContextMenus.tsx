import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenuPosition, WebsiteContextMenu, Website } from '@/types';

interface ContextMenusProps {
    contextMenu: ContextMenuPosition | null;
    websiteContextMenu: WebsiteContextMenu | null;
    onClose: () => void;
    onCreateSite: () => void;
    onEditSite: (website: Website) => void;
    onDeleteSite: (websiteId: number) => void;
    onExport: () => void;
    onImport: () => void;
}

export const ContextMenus: React.FC<ContextMenusProps> = ({
                                                              contextMenu,
                                                              websiteContextMenu,
                                                              onClose,
                                                              onCreateSite,
                                                              onEditSite,
                                                              onDeleteSite,
                                                              onExport,
                                                              onImport,
                                                          }) => {
    return (
        <>
            {/* 空白区域右键菜单 */}
            {contextMenu && (
                <DropdownMenu open onOpenChange={onClose}>
                    <DropdownMenuTrigger asChild>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={0}
                        alignOffset={0}
                        className="z-50 w-40"
                        side="right"
                        align="start"
                        style={{
                            position: 'absolute',
                            top: contextMenu.y,
                            left: contextMenu.x,
                        }}
                    >
                        <DropdownMenuItem onClick={onCreateSite}>
                            ➕ 新建网站
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onExport}>
                            📤 导出网站
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onImport}>
                            📥 导入网站
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

            {/* 网站图标右键菜单 */}
            {websiteContextMenu && (
                <DropdownMenu open onOpenChange={onClose}>
                    <DropdownMenuTrigger asChild>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={0}
                        alignOffset={0}
                        className="z-50 w-40"
                        side="right"
                        align="start"
                        style={{
                            position: 'absolute',
                            top: websiteContextMenu.y,
                            left: websiteContextMenu.x,
                        }}
                    >
                        <DropdownMenuItem onClick={() => onEditSite(websiteContextMenu.website)}>
                            ✏️ 编辑网站
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDeleteSite(websiteContextMenu.website.id)}
                            className="text-red-600"
                        >
                            🗑️ 删除网站
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    );
};