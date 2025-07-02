
import { X, FileText, Calendar, Building2, DollarSign, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

interface BOMPartDetailsProps {
  part: BOMItem | null;
  onClose: () => void;
}

const BOMPartDetails = ({ part, onClose }: BOMPartDetailsProps) => {
  if (!part) {
    return (
      <Card className="h-fit">
        <CardContent className="p-8 text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Select a part to view details</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800 border-green-200';
      case 'ordered': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'not-ordered': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{part.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{part.partId}</Badge>
              <Badge className={getStatusColor(part.status)}>
                {part.status.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-600">{part.description}</p>
        </div>
        
        <Separator />
        
        {/* Key Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Key Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{part.category}</span>
            </div>
            {part.expectedDelivery && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Calendar size={14} />
                  Expected Delivery:
                </span>
                <span className="font-medium">{part.expectedDelivery}</span>
              </div>
            )}
            {part.poNumber && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">PO Number:</span>
                <span className="font-medium text-blue-600">{part.poNumber}</span>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Vendor Comparison */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Vendor Comparison</h4>
          <div className="space-y-3">
            {part.vendors.map((vendor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">{vendor.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {vendor.availability}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <DollarSign size={14} />
                    <span>${vendor.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    <span>{vendor.leadTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Documents */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText size={14} className="mr-2" />
              Datasheet.pdf
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText size={14} className="mr-2" />
              Quote_VendorA.pdf
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText size={14} className="mr-2" />
              Installation_Guide.pdf
            </Button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button className="w-full">
            Create Purchase Order
          </Button>
          <Button variant="outline" className="w-full">
            Edit Part Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BOMPartDetails;
