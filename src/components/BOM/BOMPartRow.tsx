
import { Calendar, ChevronDown, Building2, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface BOMPartRowProps {
  part: BOMItem;
  onClick: () => void;
}

const BOMPartRow = ({ part, onClick }: BOMPartRowProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Received</Badge>;
      case 'ordered':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Ordered</Badge>;
      case 'not-ordered':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Not Ordered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{part.name}</h4>
                <Badge variant="outline" className="text-xs">{part.partId}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{part.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                {part.expectedDelivery && (
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Expected: {part.expectedDelivery}</span>
                  </div>
                )}
                {part.poNumber && (
                  <div className="flex items-center gap-1">
                    <LinkIcon size={12} />
                    <span>PO: {part.poNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {part.vendors.length} vendor{part.vendors.length !== 1 ? 's' : ''}
            </div>
            {part.vendors.length > 0 && (
              <div className="text-xs text-gray-500">
                From ${Math.min(...part.vendors.map(v => v.price))}
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" size="sm">
                <Building2 size={14} className="mr-1" />
                Vendors
                <ChevronDown size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {part.vendors.map((vendor, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start p-3">
                  <div className="font-medium">{vendor.name}</div>
                  <div className="text-sm text-gray-600">
                    ${vendor.price} • {vendor.leadTime}
                  </div>
                  <div className="text-xs text-gray-500">{vendor.availability}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {getStatusBadge(part.status)}
        </div>
      </div>
    </div>
  );
};

export default BOMPartRow;
