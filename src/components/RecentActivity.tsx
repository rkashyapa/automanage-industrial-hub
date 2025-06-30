
import { Clock, Package, ShoppingCart, FileText, AlertTriangle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'order' | 'material' | 'bom' | 'alert' | 'time';
  title: string;
  description: string;
  time: string;
  user?: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'Purchase Order #PO-2024-001 Approved',
    description: 'Vision system components for Project Alpha',
    time: '2 hours ago',
    user: 'John Smith'
  },
  {
    id: '2',
    type: 'material',
    title: 'Material Shortage Alert',
    description: 'Industrial cameras low stock (5 remaining)',
    time: '4 hours ago'
  },
  {
    id: '3',
    type: 'bom',
    title: 'BOM Updated',
    description: 'Project Beta BOM v2.1 published',
    time: '6 hours ago',
    user: 'Sarah Johnson'
  },
  {
    id: '4',
    type: 'time',
    title: 'Time Entry Submitted',
    description: '8.5 hours logged for Project Gamma',
    time: '1 day ago',
    user: 'Mike Chen'
  },
  {
    id: '5',
    type: 'alert',
    title: 'Budget Alert',
    description: 'Project Delta exceeding 85% of budget',
    time: '1 day ago'
  }
];

const RecentActivity = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={16} className="text-blue-500" />;
      case 'material':
        return <Package size={16} className="text-amber-500" />;
      case 'bom':
        return <FileText size={16} className="text-green-500" />;
      case 'time':
        return <Clock size={16} className="text-purple-500" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {activity.description}
              </p>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <span>{activity.time}</span>
                {activity.user && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{activity.user}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View All Activity
      </button>
    </div>
  );
};

export default RecentActivity;
