'use client';

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

export default function Page() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [contextUpdateMenu, setContextUpdateMenu] = useState<{ x: number; y: number; website: Website } | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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


      // 方法1：尝试获取网站标题（通过代理或直接请求）
      let siteName = '';
      let siteIcon = '';

      try {
        // 这里使用一个简单的方法：从域名提取站点名称
        siteName = domain.replace('www.', '').split('.')[0];
        siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);

        // 尝试多种常见的favicon获取方式
        const iconUrls = [
          `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
          `https://icons.duckduckgo.com/ip3/${domain}.ico`,
          `https://${domain}/favicon.ico`,
          `https://favicons.githubusercontent.com/${domain}`
        ];

        // 使用第一个可用的图标服务
        siteIcon = iconUrls[0];

      } catch (error) {
        console.log('解析网站信息时出错:', error);
        siteName = domain.replace('www.', '');
        siteIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
      }

      // 更新表单数据
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

    // 当URL看起来完整时自动解析
    if (url.includes('.') && (url.includes('http') || url.split('.').length >= 2)) {
      // 防抖处理，避免频繁请求
      const timeoutId = setTimeout(() => {
        parseWebsiteInfo(url);
      }, 1000);

      // 清理函数
      return () => clearTimeout(timeoutId);
    }
  };

  // 修改后的右键菜单处理函数
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = Math.min(e.clientX, window.innerWidth - 160);
    const y = Math.min(e.clientY, window.innerHeight - 100);

    // 检查是否点击在网站图标上
    const target = e.target as HTMLElement;
    const websiteItem = target.closest('[data-website-item]');

    if (websiteItem) {
      // 如果点击在网站图标上，显示网站操作菜单
      const websiteId = parseInt(websiteItem.getAttribute('data-website-id') || '0');
      const website = websites.find(w => w.id === websiteId);
      if (website) {
        setContextUpdateMenu({ x, y, website });
        setContextMenu(null);
      }
    } else {
      // 如果点击在空白区域，显示创建菜单
      setContextMenu({ x, y });
      setContextUpdateMenu(null);
    }
  };

  // 处理网站图标的右键菜单
  const handleWebsiteContextMenu = (e: React.MouseEvent, website: Website) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡

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
          className="flex flex-col min-h-screen bg-black"
          onContextMenu={handleContextMenu}
      >
        <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
        <div className="md:mt-51 md:mx-52 sm:mt-16 sm:mx-20 mt-6 mx-5 flex flex-wrap gap-5">
          {websites.map((website) => (
              <div
                  key={website.id}
                  data-website-item=""
                  data-website-id={website.id}
                  onClick={() => window.open(website.url, '_blank')}
                  onContextMenu={(e) => handleWebsiteContextMenu(e, website)}
                  className="cursor-pointer flex flex-col items-center w-18 mt-4 border-amber-50 flex-shrink-0"
              >
                <div className="w-18 h-18 bg-white flex rounded-xl items-center justify-center">
                  <img src={website.icon} className="size-16 rounded-lg" alt={website.name} />
                </div>
                <p className="mt-1 text-white text-xs leading-tight">{website.name}</p>
              </div>
          ))}
        </div>

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

      </div>

  );
}