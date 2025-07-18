export interface Website {
    id: number;
    name: string;
    url: string;
    icon: string;
}

export interface ContextMenuPosition {
    x: number;
    y: number;
}

export interface WebsiteContextMenu extends ContextMenuPosition {
    website: Website;
}