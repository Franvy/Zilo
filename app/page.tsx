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
          className={`cursor-pointer flex flex-col items-center w-18 mt-4 border-amber-50 flex-shrink-0 transition-all duration-300 ease-in-out ${
              isHovered ? 'transform scale-110' : 'transform scale-100'
          }`}
      >
        <div className={`w-18 h-18 bg-white flex rounded-xl items-center justify-center transition-all duration-300 ease-in-out ${
            isHovered ? 'shadow-lg shadow-white/20' : ''
        }`}>
          <img
              src={website.icon}
              className={`size-16 rounded-lg transition-all duration-300 ease-in-out ${
                  isHovered ? 'brightness-110' : ''
              }`}
              alt={website.name}
          />
        </div>
        <p className={`mt-1 text-white text-xs leading-tight transition-all duration-300 ease-in-out ${
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
  const [pageTransition, setPageTransition] = useState(false);

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
      "id": 25,
      "name": "Mi",
      "url": "https://mi.com",
      "icon": "https://www.google.com/s2/favicons?domain=mi.com&sz=256"
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
      "id": 17,
      "name": "Notion",
      "url": "https://notion.so",
      "icon": "https://www.google.com/s2/favicons?domain=notion.so&sz=256"
    },
    {
      "id": 24,
      "name": "Openai",
      "url": "https://openai.com",
      "icon": "https://www.google.com/s2/favicons?domain=openai.com&sz=256"
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
      "id": 26,
      "name": "Github",
      "url": "https://github.com",
      "icon": "https://github.githubassets.com/assets/apple-touch-icon-180x180-a80b8e11abe2.png"
    },
    {
      "id": 27,
      "name": "Mail",
      "url": "https://mail.google.com/mail",
      "icon": "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico"
    },
    {
      "id": 28,
      "name": "Youtube",
      "url": "https://www.youtube.com",
      "icon": "https://www.google.com/s2/favicons?domain=www.youtube.com&sz=256"
    },
    {
      "id": 29,
      "name": "Apple",
      "url": "https://www.apple.com",
      "icon": "https://s2.loli.net/2025/07/08/lvCOQUYI2D5ySaN.webp"
    },
    {
      "id": 30,
      "name": "Juejin",
      "url": "https://juejin.cn",
      "icon": "https://www.google.com/s2/favicons?domain=juejin.cn&sz=256"
    },
    {
      "id": 31,
      "name": "Macgf",
      "url": "https://www.macgf.com",
      "icon": "https://www.google.com/s2/favicons?domain=www.macgf.com&sz=256"
    },
    {
      "id": 32,
      "name": "Bilibili",
      "url": "https://www.bilibili.com",
      "icon": "https://www.google.com/s2/favicons?domain=www.bilibili.com&sz=256"
    },
    {
      "id": 33,
      "name": "Dash",
      "url": "https://dash.cloudflare.com",
      "icon": "https://www.google.com/s2/favicons?domain=dash.cloudflare.com&sz=256"
    },
    {
      "id": 34,
      "name": "Windy",
      "url": "https://www.windy.com/22.833/108.303/wind?22.722,108.243,10,i:pressure,m:ejfajbB",
      "icon": "https://www.google.com/s2/favicons?domain=www.windy.com&sz=256"
    },
    {
      "id": 35,
      "name": "Rust-lang",
      "url": "https://www.rust-lang.org/zh-CN/",
      "icon": "https://www.google.com/s2/favicons?domain=www.rust-lang.org&sz=256"
    },
    {
      "id": 36,
      "name": "Shadcn",
      "url": "https://ui.shadcn.com/?ref=producthunt",
      "icon": "https://www.google.com/s2/favicons?domain=ui.shadcn.com&sz=256"
    },
    {
      "id": 37,
      "name": "Tailwindcss",
      "url": "https://tailwindcss.com/?ref=producthunt",
      "icon": "https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=256"
    },
    {
      "id": 38,
      "name": "React",
      "url": "https://zh-hans.react.dev",
      "icon": "https://www.google.com/s2/favicons?domain=zh-hans.react.dev&sz=256"
    },
    {
      "id": 39,
      "name": "Follow",
      "url": "https://app.follow.is/timeline/view-0/all/pending",
      "icon": "https://www.google.com/s2/favicons?domain=app.follow.is&sz=256"
    },
    {
      "id": 40,
      "name": "Canva",
      "url": "https://www.canva.com",
      "icon": "https://www.google.com/s2/favicons?domain=www.canva.com&sz=256"
    },
    {
      "id": 41,
      "name": "Linux",
      "url": "https://linux.do",
      "icon": "https://www.google.com/s2/favicons?domain=linux.do&sz=256"
    },
    {
      "id": 42,
      "name": "Claude",
      "url": "https://claude.ai/new",
      "icon": "https://s2.loli.net/2025/07/08/s3jRlJngOaUemrz.webp"
    },
    {
      "id": 43,
      "name": "Nextjs",
      "url": "https://nextjs.org/docs",
      "icon": "https://s2.loli.net/2025/07/08/qKTo4Dh3V2FwcsY.webp"
    },
    {
      "id": 44,
      "name": "V0",
      "url": "https://v0.dev",
      "icon": "https://www.google.com/s2/favicons?domain=v0.dev&sz=256"
    },
    {
      "id": 45,
      "name": "Vercel",
      "url": "https://vercel.com/franciscos-projects-4488bd95",
      "icon": "https://www.google.com/s2/favicons?domain=vercel.com&sz=256"
    },
    {
      "id": 46,
      "name": "Insta360",
      "url": "https://www.insta360.com/cn/product/insta360-ace-pro2",
      "icon": "https://s2.loli.net/2025/07/08/Er4pjkQlZoz7yNJ.webp"
    },
    {
      "id": 47,
      "name": "Dji",
      "url": "https://www.dji.com/cn/mavic-4-pro?site=brandsite&from=homepage",
      "icon": "https://www.google.com/s2/favicons?domain=www.dji.com&sz=256"
    },
    {
      "id": 48,
      "name": "Shadcn-Tool",
      "url": "https://awesome-shadcn-ui.vercel.app",
      "icon": "https://awesome-shadcn-ui.vercel.app/logo.svg"
    },
    {
      "id": 49,
      "name": "Berlix UI",
      "url": "https://ui.rechesoares.com/docs/text-circle",
      "icon": "https://s2.loli.net/2025/07/08/W5nBzjEtYrhCxIi.webp"
    },
    {
      "id": 50,
      "name": "Imgsrc",
      "url": "https://imgsrc.io",
      "icon": "https://www.google.com/s2/favicons?domain=imgsrc.io&sz=256"
    },
    {
      "id": 51,
      "name": "Animata",
      "url": "https://animata.design/docs/accordion/faq",
      "icon": "https://www.google.com/s2/favicons?domain=animata.design&sz=256"
    },
    {
      "id": 52,
      "name": "Magicui",
      "url": "https://pro.magicui.design/docs/sections/header",
      "icon": "https://www.google.com/s2/favicons?domain=pro.magicui.design&sz=256"
    },
    {
      "id": 53,
      "name": "Indie UI",
      "url": "https://ui.indie-starter.dev/form-builder",
      "icon": "https://www.google.com/s2/favicons?domain=ui.indie-starter.dev&sz=256"
    },
    {
      "id": 54,
      "name": "Variant",
      "url": "https://variantvault.chrisabdo.dev",
      "icon": "https://s2.loli.net/2025/07/08/sH2lm8kbNTVAnrY.webp"
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
          setPageTransition(true);
          setTimeout(() => {
            setCurrentPage(prev => prev - 1);
            setPageTransition(false);
          }, 150);
        }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (currentPage < totalPages - 1) {
          setPageTransition(true);
          setTimeout(() => {
            setCurrentPage(prev => prev + 1);
            setPageTransition(false);
          }, 150);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // 解析网站信息
  const parseWebsiteInfo = async (url: string) => {
    if (!url) return;

    try {
      setIsLoading(true);

      let finalUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
      }

      let urlObj: URL;
      try {
        urlObj = new URL(finalUrl);
      } catch (err) {
        console.error('非法URL:', err);
        throw new Error('非法 URL: ' + finalUrl);
      }

      const domain = urlObj.hostname;

      let siteName = '';
      let siteIcon = '';

      try {
        siteName = domain.replace('www.', '').split('.')[0];
        siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);

        const iconUrls = [
          `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
          `https://icons.duckduckgo.com/ip3/${domain}.ico`,
          `https://${domain}/favicon.ico`,
          `https://favicons.githubusercontent.com/${domain}`
        ];

        siteIcon = iconUrls[0];

      } catch (error) {
        console.log('解析网站信息时出错:', error);
        siteName = domain.replace('www.', '');
        siteIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
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

  // 处理URL输入变化
  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));

    if (url.includes('.') && (url.includes('http') || url.split('.').length >= 2)) {
      const timeoutId = setTimeout(() => {
        parseWebsiteInfo(url);
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
    const handleClick = () => {
      setContextMenu(null);
      setContextUpdateMenu(null);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

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
            <div className={`md:mt-51 md:mx-52 sm:mt-16 sm:mx-20 mt-6 mx-5 flex flex-wrap gap-5 transition-all duration-300 ease-in-out ${
                pageTransition ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}>
              {currentWebsites.map((website, index) => (
                  <div
                      key={website.id}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: 'both'
                      }}
                  >
                    <SortableWebsite
                        website={website}
                        handleWebsiteContextMenu={handleWebsiteContextMenu}
                    />
                  </div>
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
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="flex-1"
                      placeholder="自动解析或手动输入图标链接"
                  />
                  {formData.icon && (
                      <img
                          src={formData.icon}
                          alt="icon preview"
                          className="w-8 h-8 rounded border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                      />
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
                <Input
                    id="edit-icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="col-span-3"
                    placeholder="请输入图标链接（可选）"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmitEdit}>
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
  );
}