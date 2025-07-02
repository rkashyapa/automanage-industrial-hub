
import { Calendar, User, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BOMHeader = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Vision System Alpha - BOM
            </CardTitle>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">Project ID:</span>
                <Badge variant="outline">PRJ-2024-001</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Building2 size={16} />
                <span>Manufacturing Corp</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>Created by John Smith</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Last updated: Feb 28, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-600">Total Parts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-sm text-gray-600">Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">15</div>
            <div className="text-sm text-gray-600">Ordered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">9</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BOMHeader;
