
import { ChevronDown, ChevronRight, Package } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import BOMPartRow from './BOMPartRow';

interface BOMItem {
  id: string;
  name: string;
  partId: string;
  description: string;
  category: string;
  vendors: Array<{
    name: string;
    price: number;
    leadTime: string;
    availability: string;
  }>;
  status: 'not-ordered' | 'ordered' | 'received';
  expectedDelivery?: string;
  poNumber?: string;
}

interface BOMCategory {
  name: string;
  items: BOMItem[];
  isExpanded: boolean;
}

interface BOMCategoryCardProps {
  category: BOMCategory;
  onToggle: () => void;
  onPartClick: (part: BOMItem) => void;
}

const BOMCategoryCard = ({ category, onToggle, onPartClick }: BOMCategoryCardProps) => {
  const getStatusCount = (status: string) => {
    return category.items.filter(item => item.status === status).length;
  };

  return (
    <Card>
      <Collapsible open={category.isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {category.isExpanded ? (
                  <ChevronDown className="text-gray-500" size={20} />
                ) : (
                  <ChevronRight className="text-gray-500" size={20} />
                )}
                <Package className="text-blue-500" size={20} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.items.length} parts</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  {getStatusCount('received')} received
                </Badge>
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  {getStatusCount('ordered')} ordered
                </Badge>
                <Badge variant="outline" className="text-red-600 border-red-200">
                  {getStatusCount('not-ordered')} pending
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {category.items.map((item) => (
                <BOMPartRow
                  key={item.id}
                  part={item}
                  onClick={() => onPartClick(item)}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default BOMCategoryCard;
