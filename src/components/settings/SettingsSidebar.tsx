
import React from 'react';
import { CATEGORIES } from './constants';

interface SettingsSidebarProps {
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-1/4 border-t border-border bg-muted/50 rounded-xl m-3 mt-0">
            <div className="p-4 space-y-1">
            {CATEGORIES.map(category => {
                const Icon = category.icon;
                return (
                <button
                    key={category.id}
                    className={`w-full text-sm flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                    selectedCategory === category.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => onSelectCategory(category.id)}
                >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                </button>
                );
            })}
            </div>
        </div>
    );
};

export default SettingsSidebar;
