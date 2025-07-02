
import { useState } from 'react';
import { Upload, Plus, Search, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BOMHeader from '@/components/BOM/BOMHeader';
import BOMCategoryCard from '@/components/BOM/BOMCategoryCard';
import BOMPartDetails from '@/components/BOM/BOMPartDetails';

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

const BOM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState<BOMItem | null>(null);
  const [categories, setCategories] = useState<BOMCategory[]>([
    {
      name: 'Camera',
      isExpanded: false,
      items: [
        {
          id: '1',
          name: 'Sony XYZ Industrial Camera',
          partId: 'CAM001',
          description: 'High-resolution machine vision camera with USB3 interface',
          category: 'Camera',
          vendors: [
            { name: 'Vision Systems Inc', price: 1250, leadTime: '2 weeks', availability: 'In Stock' },
            { name: 'Industrial Components Ltd', price: 1180, leadTime: '3 weeks', availability: 'Limited' }
          ],
          status: 'not-ordered',
          expectedDelivery: '2024-03-15'
        },
        {
          id: '2',
          name: 'Lens ABC 25mm',
          partId: 'CAM002',
          description: '25mm fixed focal length lens for industrial applications',
          category: 'Camera',
          vendors: [
            { name: 'Optics Direct', price: 320, leadTime: '1 week', availability: 'In Stock' }
          ],
          status: 'ordered',
          expectedDelivery: '2024-03-10',
          poNumber: 'PO-2024-001'
        }
      ]
    },
    {
      name: 'Camera Accessories',
      isExpanded: true,
      items: [
        {
          id: '3',
          name: 'Mount Bracket',
          partId: 'ACC001',
          description: 'Adjustable camera mounting bracket',
          category: 'Camera Accessories',
          vendors: [
            { name: 'Mounting Solutions', price: 85, leadTime: '5 days', availability: 'In Stock' }
          ],
          status: 'received',
          expectedDelivery: '2024-02-28'
        },
        {
          id: '4',
          name: 'Power Adapter 24V',
          partId: 'ACC002',
          description: '24V DC power adapter for camera system',
          category: 'Camera Accessories',
          vendors: [
            { name: 'Power Systems Co', price: 45, leadTime: '3 days', availability: 'In Stock' },
            { name: 'Electronics Supply', price: 42, leadTime: '1 week', availability: 'In Stock' }
          ],
          status: 'not-ordered'
        }
      ]
    },
    {
      name: 'HMI',
      isExpanded: false,
      items: [
        {
          id: '5',
          name: 'Touch Panel 10 inch',
          partId: 'HMI001',
          description: 'Industrial touchscreen HMI panel',
          category: 'HMI',
          vendors: [
            { name: 'HMI Solutions', price: 850, leadTime: '4 weeks', availability: 'Custom Order' }
          ],
          status: 'not-ordered'
        }
      ]
    }
  ]);

  const toggleCategory = (categoryName: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.name === categoryName 
          ? { ...cat, isExpanded: !cat.isExpanded }
          : cat
      )
    );
  };

  const handlePartClick = (part: BOMItem) => {
    setSelectedPart(part);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* BOM Header */}
        <BOMHeader />

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search parts by name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Upload size={16} className="mr-2" />
              Upload BOM
            </Button>
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-2" />
              Add Category
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BOM Categories List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredCategories.map((category) => (
              <BOMCategoryCard
                key={category.name}
                category={category}
                onToggle={() => toggleCategory(category.name)}
                onPartClick={handlePartClick}
              />
            ))}
            
            {filteredCategories.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No parts found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Part Details Side Panel */}
          <div className="lg:col-span-1">
            <BOMPartDetails part={selectedPart} onClose={() => setSelectedPart(null)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BOM;
