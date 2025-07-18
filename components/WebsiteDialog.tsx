import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Website } from '@/types';
import { parseWebsiteInfo, compressImage, fileToBase64 } from '@/utils/websiteUtils';

interface WebsiteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    website?: Website | null;
    onSubmit: (websiteData: Omit<Website, 'id'>) => void;
    title: string;
}

export const WebsiteDialog: React.FC<WebsiteDialogProps> = ({
                                                                open,
                                                                onOpenChange,
                                                                website,
                                                                onSubmit,
                                                                title,
                                                            }) => {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        icon: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (website) {
            setFormData({
                name: website.name,
                url: website.url,
                icon: website.icon
            });
        } else {
            setFormData({ name: '', url: '', icon: '' });
        }
    }, [website, open]);

    const handleUrlChange = async (url: string) => {
        setFormData(prev => ({ ...prev, url }));

        if (url.includes('.') && (url.includes('http') || url.split('.').length >= 2)) {
            setIsLoading(true);
            try {
                const websiteInfo = await parseWebsiteInfo(url);
                if (websiteInfo) {
                    setFormData(prev => ({
                        ...prev,
                        name: websiteInfo.name || prev.name,
                        icon: websiteInfo.icon || prev.icon
                    }));
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
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

    const handleSubmit = () => {
        if (formData.name && formData.url) {
            onSubmit({
                name: formData.name,
                url: formData.url,
                icon: formData.icon || 'https://avatars.githubusercontent.com/u/199066147?v=4'
            });
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
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
                                        width={32}
                                        height={32}
                                        className="rounded border"
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
                        onClick={handleSubmit}
                        disabled={!formData.url || isLoading}
                    >
                        {isLoading ? '解析中...' : (website ? '保存' : '创建')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};