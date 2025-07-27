import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, Settings} from 'lucide-react';
import { cn } from '../../utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 px-4 space-y-2 pt-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
