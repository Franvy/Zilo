'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import React, {useEffect, useRef, useState} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';

interface Website {
  id: number;
  name: string;
  url: string;
  icon: string;
}

function SortableWebsite({
                           website,
                           handleWebsiteContextMenu,
                         }: {
  website: Website;
  handleWebsiteContextMenu: (e: React.MouseEvent, website: Website) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: website.id });
  const [isHovered, setIsHovered] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  const [hasMounted, setHasMounted] = useState(false);


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
          onContextMenu={(e) => handleWebsiteContextMenu(e, website)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`cursor-pointer flex flex-col items-center w-18 mt-4 border-amber-50 flex-shrink-0 transition-all duration-20 ease-in-out ${
              isHovered ? 'transform scale-110' : 'transform scale-100'
          }`}
      >
        <div className={`w-18 h-18 bg-white flex rounded-xl items-center justify-center transition-all duration-20 ease-in-out ${
            isHovered ? 'shadow-lg shadow-white/20' : ''
        }`}>
          <img
              src={website.icon}
              className={`size-16 rounded-lg transition-all duration-20 ease-in-out ${
                  isHovered ? 'brightness-110' : ''
              }`}
              alt={website.name}
          />
        </div>
        <p className={`mt-1 text-white text-xs leading-tight transition-all duration-20 ease-in-out ${
            isHovered ? 'text-blue-300' : ''
        }`}>
          {website.name}
        </p>
      </div>
  );
}

export default function Page() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [contextUpdateMenu, setContextUpdateMenu] = useState<{ x: number; y: number; website: Website } | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const ITEMS_PER_PAGE = 36;

  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5,
        },
      })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = websites.findIndex((w) => w.id === active.id);
      const newIndex = websites.findIndex((w) => w.id === over.id);
      const newWebsites = arrayMove(websites, oldIndex, newIndex);
      setWebsites(newWebsites);
    }
  };

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: ''
  });

  // 初始网站数据
  const [websites, setWebsites] = useState<Website[]>([
    {
      "id": 4,
      "name": "Google",
      "url": "https://google.com",
      "icon": "https://www.google.com/s2/favicons?domain=google.com&sz=256"
    },
    {
      "id": 5,
      "name": "Github",
      "url": "https://github.com",
      "icon": "https://www.google.com/s2/favicons?domain=github.com&sz=256"
    },
    {
      "id": 6,
      "name": "Youtube",
      "url": "https://www.youtube.com",
      "icon": "https://www.google.com/s2/favicons?domain=www.youtube.com&sz=256"
    },
    {
      "id": 7,
      "name": "Facebook",
      "url": "https://facebook.com",
      "icon": "https://www.google.com/s2/favicons?domain=facebook.com&sz=256"
    },
    {
      "id": 8,
      "name": "Twitter",
      "url": "https://twitter.com",
      "icon": "https://abs.twimg.com/responsive-web/client-web/icon-ios.77d25eba.png"
    },
    {
      "id": 13,
      "name": "Reddit",
      "url": "https://reddit.com",
      "icon": "https://www.google.com/s2/favicons?domain=reddit.com&sz=256"
    },
    {
      "id": 16,
      "name": "Slack",
      "url": "https://slack.com",
      "icon": "https://a.slack-edge.com/fd21de4/marketing/img/nav/logo.svg"
    },
    {
      "id": 17,
      "name": "Notion",
      "url": "https://notion.so",
      "icon": "https://www.google.com/s2/favicons?domain=notion.so&sz=256"
    },
    {
      "id": 18,
      "name": "Figma",
      "url": "https://figma.com",
      "icon": "https://www.google.com/s2/favicons?domain=figma.com&sz=256"
    },
    {
      "id": 19,
      "name": "Canva",
      "url": "https://canva.com",
      "icon": "https://www.google.com/s2/favicons?domain=canva.com&sz=256"
    },
    {
      "id": 20,
      "name": "Adobe",
      "url": "https://adobe.com",
      "icon": "https://www.google.com/s2/favicons?domain=adobe.com&sz=256"
    },
    {
      "id": 22,
      "name": "Airbnb",
      "url": "https://airbnb.com",
      "icon": "https://www.google.com/s2/favicons?domain=airbnb.com&sz=256"
    },
    {
      "id": 23,
      "name": "Yahoo",
      "url": "https://yahoo.com",
      "icon": "https://www.google.com/s2/favicons?domain=yahoo.com&sz=256"
    },
    {
      "id": 24,
      "name": "Openai",
      "url": "https://openai.com",
      "icon": "https://www.google.com/s2/favicons?domain=openai.com&sz=256"
    }
  ]);


  const containerRef = useRef<HTMLDivElement>(null);

  // 计算分页数据
  const totalPages = Math.ceil(websites.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentWebsites = websites.slice(startIndex, endIndex);

  // 处理键盘事件
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

      // 防抖处理
      if (isScrolling) return;
      isScrolling = true;

      if (e.deltaY > 0) { // 向下滚动
        if (currentPage < totalPages - 1) {
          setCurrentPage(prev => prev + 1);
        }
      } else { // 向上滚动
        if (currentPage > 0) {
          setCurrentPage(prev => prev - 1);
        }
      }

      // 300ms后重置防抖标志
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

  // 1. 添加图片处理工具函数 (在组件开始处添加)
  const imageUrlToBase64 = async (url: string): Promise<string | null> => {
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  // 修改 compressImage 函数，提高图片质量
  const compressImage = (file: File, maxWidth: number = 256, quality: number = 0.9): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const maxSize = maxWidth; // 或者用 maxDimension 表达“最大边长”

      img.onload = () => {
        if (!ctx) return;

        // 计算合适的尺寸，保持宽高比
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

        // 使用更好的图像渲染设置
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // 使用 PNG 格式保持更好的质量，或者提高 JPEG 质量
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, file.type.startsWith('image/png') ? 'image/png' : 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // 2. 修改parseWebsiteInfo函数
  const parseWebsiteInfo = async (url: string) => {
    if (!url) return;

    try {
      setIsLoading(true);

      let finalUrl = url;
      if (!url.startsWith('https://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
      }

      let urlObj: URL;
      try {
        urlObj = new URL(finalUrl);
      } catch (err) {
        console.error('非法URL:', err);
        return;
      }

      const domain = urlObj.hostname;

      let siteName = '';
      let siteIcon: string;

      try {
        siteName = domain.replace('www.', '').split('.')[0];
        siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);

        const iconUrls = [
          `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
          `https://icons.duckduckgo.com/ip3/${domain}.ico`,
          `https://${domain}/favicon.ico`,
          `https://favicons.githubusercontent.com/${domain}`
        ];

        const iconUrl = iconUrls[0];

        // 将图片URL转换为Base64
        const base64Icon = await imageUrlToBase64(iconUrl);
        siteIcon = base64Icon || iconUrl; // 如果转换失败，保持原URL

      } catch (error) {
        console.log('解析网站信息时出错:', error);
        siteName = domain.replace('www.', '');
        siteIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

        // 尝试转换默认图标
        const base64Icon = await imageUrlToBase64(siteIcon);
        siteIcon = base64Icon || siteIcon;
      }

      setFormData({
        name: siteName,
        url: finalUrl,
        icon: siteIcon
      });

    } catch (error) {
      console.error('解析URL失败:', error);
      setFormData(prev => ({
        ...prev,
        url: url.startsWith('http') ? url : 'https://' + url
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 添加文件上传处理函数
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);

      // 压缩图片
      const compressedFile = await compressImage(file);
      const base64 = await fileToBase64(compressedFile as File);

      setFormData(prev => ({ ...prev, icon: base64 }));
    } catch (error) {
      console.error('上传图片失败:', error);
      alert('上传图片失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理URL输入变化
  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));

    if (url.includes('.') && (url.includes('http') || url.split('.').length >= 2)) {
      const timeoutId = setTimeout(() => {
        parseWebsiteInfo(url).then(r => {console.info('<UNK> URL:', r);});
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  };

  // 修改后的右键菜单处理函数
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 160);
    const y = Math.min(e.clientY, window.innerHeight - 100);

    const target = e.target as HTMLElement;
    const websiteItem = target.closest('[data-website-item]');

    if (websiteItem) {
      const websiteId = parseInt(websiteItem.getAttribute('data-website-id') || '0');
      const website = websites.find(w => w.id === websiteId);
      if (website) {
        setContextUpdateMenu({ x, y, website });
        setContextMenu(null);
      }
    } else {
      setContextMenu({ x, y });
      setContextUpdateMenu(null);
    }
  };

  // 处理网站图标的右键菜单
  const handleWebsiteContextMenu = (e: React.MouseEvent, website: Website) => {
    e.preventDefault();
    e.stopPropagation();

    const x = Math.min(e.clientX, window.innerWidth - 160);
    const y = Math.min(e.clientY, window.innerHeight - 100);

    setContextUpdateMenu({ x, y, website });
    setContextMenu(null);
  };

  const handleCreateSite = () => {
    setFormData({ name: '', url: '', icon: '' });
    setIsCreateDialogOpen(true);
    setContextMenu(null);
  };

  const handleEditSite = (website: Website) => {
    setEditingWebsite(website);
    setFormData({
      name: website.name,
      url: website.url,
      icon: website.icon
    });
    setIsEditDialogOpen(true);
    setContextUpdateMenu(null);
  };

  const handleSubmitCreate = () => {
    if (formData.name && formData.url) {
      const newWebsite: Website = {
        id: Math.max(0, ...websites.map(w => w.id)) + 1,
        name: formData.name,
        url: formData.url,
        icon: formData.icon || 'https://avatars.githubusercontent.com/u/199066147?v=4'
      };
      setWebsites([...websites, newWebsite]);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', url: '', icon: '' });
    }
  };

  const handleSubmitEdit = () => {
    if (editingWebsite && formData.name && formData.url) {
      setWebsites(websites.map(website =>
          website.id === editingWebsite.id
              ? { ...website, name: formData.name, url: formData.url, icon: formData.icon }
              : website
      ));
      setIsEditDialogOpen(false);
      setEditingWebsite(null);
      setFormData({ name: '', url: '', icon: '' });
    }
  };

  const handleDeleteSite = (websiteId: number) => {
    setWebsites(websites.filter(website => website.id !== websiteId));
    setContextUpdateMenu(null);
  };

  // 点击任意处关闭菜单
  useEffect(() => {
    // 页面加载的时候尝试从本地获取数据
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

    const handleClick = () => {
      setContextMenu(null);
      setContextUpdateMenu(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 监听 websites 变化时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('my-websites', JSON.stringify(websites));
  }, [websites]);

  const handleExport = () => {
    const dataStr = JSON.stringify(websites, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "websites.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          const valid = imported.every(item =>
              item.name && item.url && item.icon
          );
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
            setWebsites([...websites, ...withId]);
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
      <div
          ref={containerRef}
          className="flex flex-col min-h-screen bg-black relative"
          onContextMenu={handleContextMenu}
      >
        <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={currentWebsites} strategy={verticalListSortingStrategy}>
            <div className={`md:mt-51 md:mx-52 sm:mt-16 sm:mx-20 mt-6 mx-5 flex flex-wrap gap-5`}>
              {currentWebsites.map((website, index) => (
                  <motion.div
                      key={website.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                  >
                    <SortableWebsite
                        website={website}
                        handleWebsiteContextMenu={handleWebsiteContextMenu}
                    />
                  </motion.div>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* 空白区域右键菜单 */}
        {contextMenu && (
            <DropdownMenu open onOpenChange={() => setContextMenu(null)}>
              <DropdownMenuTrigger asChild>
                <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 1,
                      height: 1,
                    }}
                />
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
                <DropdownMenuItem onClick={handleCreateSite}>
                  ➕ 新建网站
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  📤 导出网站
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportClick}>
                  📥 导入网站
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )}

        {/* 网站图标右键菜单 */}
        {contextUpdateMenu && (
            <DropdownMenu open onOpenChange={() => setContextUpdateMenu(null)}>
              <DropdownMenuTrigger asChild>
                <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 1,
                      height: 1,
                    }}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                  sideOffset={0}
                  alignOffset={0}
                  className="z-50 w-40"
                  side="right"
                  align="start"
                  style={{
                    position: 'absolute',
                    top: contextUpdateMenu.y,
                    left: contextUpdateMenu.x,
                  }}
              >
                <DropdownMenuItem onClick={() => handleEditSite(contextUpdateMenu.website)}>
                  ✏️ 编辑网站
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleDeleteSite(contextUpdateMenu.website.id)}
                    className="text-red-600"
                >
                  🗑️ 删除网站
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )}

        {/* 新建网站对话框 */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>新建网站</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  网址 *
                </Label>
                <div className="col-span-3 relative">
                  <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="pr-10"
                      placeholder="请输入网址，如：google.com"
                  />
                  {isLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                    placeholder="自动解析或手动输入"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  图标
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                      id="icon"
                      value={formData.icon && formData.icon.startsWith('data:') ? '已上传本地图片' : formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="flex-1"
                      placeholder="自动解析或手动输入图标链接"
                      disabled={!!(formData.icon && formData.icon.startsWith('data:'))}
                  />
                  <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('icon-upload')?.click()}
                      disabled={isLoading}
                  >
                    {isLoading ? '处理中...' : '上传'}
                  </Button>
                  <input
                      id="icon-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleIconUpload}
                  />
                  {formData.icon && (
                      <div className="flex items-center gap-2">
                        <img
                            src={formData.icon}
                            alt="icon preview"
                            className="w-8 h-8 rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                        />
                        {formData.icon.startsWith('data:') && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData(prev => ({ ...prev, icon: '' }))}
                            >
                              清除
                            </Button>
                        )}
                      </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                  type="submit"
                  onClick={handleSubmitCreate}
                  disabled={!formData.url || isLoading}
              >
                {isLoading ? '解析中...' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 编辑网站对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>编辑网站</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  名称
                </Label>
                <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                    placeholder="请输入网站名称"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  链接
                </Label>
                <Input
                    id="edit-url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="col-span-3"
                    placeholder="请输入网站链接"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-icon" className="text-right">
                  图标
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                      id="edit-icon"
                      value={formData.icon && formData.icon.startsWith('data:') ? '已上传本地图片' : formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="flex-1"
                      placeholder="请输入图标链接（可选）"
                      disabled={!!(formData.icon && formData.icon.startsWith('data:'))}
                  />
                  <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('edit-icon-upload')?.click()}
                      disabled={isLoading}
                  >
                    {isLoading ? '处理中...' : '上传'}
                  </Button>
                  <input
                      id="edit-icon-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleIconUpload}
                  />
                  {formData.icon && (
                      <div className="flex items-center gap-2">
                        <img
                            src={formData.icon}
                            alt="icon preview"
                            className="w-8 h-8 rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                        />
                        {formData.icon.startsWith('data:') && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setFormData(prev => ({ ...prev, icon: '' }))}
                            >
                              清除
                            </Button>
                        )}
                      </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmitEdit}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
  );
}