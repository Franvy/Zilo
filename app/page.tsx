'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WebsiteGrid } from '@/components/WebsiteGrid';
import { ContextMenus } from '@/components/ContextMenus';
import { WebsiteDialog } from '@/components/WebsiteDialog';
import { ImportExport } from '@/components/ImportExport';
import { useWebsiteData } from '@/hooks/useWebsiteData';
import { usePagination } from '@/hooks/usePagination';
import { Website, ContextMenuPosition, WebsiteContextMenu } from '@/types';

export default function Page() {
  const { websites, addWebsite, updateWebsite, deleteWebsite, reorderWebsites, setWebsites } = useWebsiteData();
  const { currentWebsites } = usePagination(websites);

  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [websiteContextMenu, setWebsiteContextMenu] = useState<WebsiteContextMenu | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 160);
    const y = Math.min(e.clientY, window.innerHeight - 100);

    const target = e.target as HTMLElement;
    const websiteItem = target.closest('[data-website-item]');

    if (!websiteItem) {
      setContextMenu({ x, y });
      setWebsiteContextMenu(null);
    }
  };

  const handleWebsiteContextMenu = (e: React.MouseEvent, website: Website) => {
    e.preventDefault();
    e.stopPropagation();

    const x = Math.min(e.clientX, window.innerWidth - 160);
    const y = Math.min(e.clientY, window.innerHeight - 100);

    setWebsiteContextMenu({ x, y, website });
    setContextMenu(null);
  };

  const handleCloseContextMenus = () => {
    setContextMenu(null);
    setWebsiteContextMenu(null);
  };

  const handleCreateSite = () => {
    setIsCreateDialogOpen(true);
    setContextMenu(null);
  };

  const handleEditSite = (website: Website) => {
    setEditingWebsite(website);
    setIsEditDialogOpen(true);
    setWebsiteContextMenu(null);
  };

  const handleDeleteSite = (websiteId: number) => {
    deleteWebsite(websiteId);
    setWebsiteContextMenu(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(websites, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "websites.json";
    link.click();
    URL.revokeObjectURL(url);
    setContextMenu(null);
  };

  const handleImport = () => {
    // 触发文件选择
    const fileInput = containerRef.current?.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
    setContextMenu(null);
  };

  const handleCreateWebsite = (websiteData: Omit<Website, 'id'>) => {
    addWebsite(websiteData);
  };

  const handleUpdateWebsite = (websiteData: Omit<Website, 'id'>) => {
    if (editingWebsite) {
      updateWebsite(editingWebsite.id, websiteData);
      setEditingWebsite(null);
    }
  };

  const handleEditDialogClose = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setEditingWebsite(null);
    }
  };

  // 点击任意处关闭菜单
  useEffect(() => {
    const handleClick = () => {
      handleCloseContextMenus();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
      <div
          ref={containerRef}
          className="flex flex-col min-h-screen bg-black relative"
          onContextMenu={handleContextMenu}
      >
        <ImportExport websites={websites} onImport={setWebsites} />

        <WebsiteGrid
            websites={currentWebsites}
            onContextMenu={handleWebsiteContextMenu}
            onReorder={reorderWebsites}
        />

        <ContextMenus
            contextMenu={contextMenu}
            websiteContextMenu={websiteContextMenu}
            onClose={handleCloseContextMenus}
            onCreateSite={handleCreateSite}
            onEditSite={handleEditSite}
            onDeleteSite={handleDeleteSite}
            onExport={handleExport}
            onImport={handleImport}
        />

        <WebsiteDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreateWebsite}
            title="创建网站"
        />

        <WebsiteDialog
            open={isEditDialogOpen}
            onOpenChange={handleEditDialogClose}
            website={editingWebsite}
            onSubmit={handleUpdateWebsite}
            title="编辑网站"
        />
      </div>
  );
}