import React from 'react';
import { type LucideIcon } from 'lucide-react'; // Import LucideIcon type

export interface CategoryInfo {
  id: string;
  name: string;
  icon: LucideIcon; 
}

interface SettingsSidebarProps {
    categories: CategoryInfo[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-64 border-r bg-muted/40 p-4">
            <nav className="space-y-1">
            {categories.map(category => {
                const Icon = category.icon;
                return (
                <button
                    key={category.id}
                    className={`w-full text-sm font-medium flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedCategory === category.id 
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => onSelectCategory(category.id)}
                >
                    <Icon className="h-5 w-5" />
                    <span>{category.name}</span>
                </button>
                );
            })}
            </nav>
        </div>
    );
};

export default SettingsSidebar;
