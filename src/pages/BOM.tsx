
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
  quantity: number;
  vendors: Array<{
    name: string;
    price: number;
    leadTime: string;
    availability: string;
  }>;
  status: 'not-ordered' | 'ordered' | 'received';
  expectedDelivery?: string;
  poNumber?: string;
  finalizedVendor?: { name: string; price: number; leadTime: string; availability: string };
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
      name: 'Optical parts',
      isExpanded: true,
      items: [
        {
          id: '1',
          name: 'Sony XYZ',
          partId: 'OPT001',
          description: '• Resolution: 4096x3000 px\n• Type: Area scan\n• Model Number: ABC1234\n• Make: VisionTech',
          category: 'Optical parts',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
        {
          id: '2',
          name: 'Lens',
          partId: 'OPT002',
          description: 'High quality lens for camera',
          category: 'Optical parts',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
        {
          id: '3',
          name: 'Gigi cable',
          partId: 'OPT003',
          description: 'GigE interface cable for camera',
          category: 'Optical parts',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
        {
          id: '4',
          name: 'Hyres cable',
          partId: 'OPT004',
          description: 'High resolution cable for camera',
          category: 'Optical parts',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
      ],
    },
    {
      name: 'Mechanical parts',
      isExpanded: true,
      items: [
        {
          id: '5',
          name: 'Mounting bracket',
          partId: 'MECH001',
          description: 'Bracket for mounting camera and accessories',
          category: 'Mechanical parts',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
      ],
    },
    {
      name: 'Electrical parts',
      isExpanded: true,
      items: [
        {
          id: '6',
          name: 'Power adapter 24V',
          partId: 'ELEC001',
          description: '24V DC power adapter',
          category: 'Electrical parts',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
        {
          id: '7',
          name: 'Touch panel 10 inch',
          partId: 'ELEC002',
          description: '10 inch industrial touch panel',
          category: 'Electrical parts',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
      ],
    },
    {
      name: 'Computing hardware',
      isExpanded: true,
      items: [
        {
          id: '8',
          name: 'Dell desktop',
          partId: 'COMP001',
          description: 'Dell desktop computer for system control',
          category: 'Computing hardware',
          quantity: 1,
          vendors: [],
          status: 'not-ordered',
        },
      ],
    },
  ]);
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const handleUploadDocs = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedDocs(Array.from(e.target.files));
    }
  };

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

  const handleQuantityChange = (partId: string, newQuantity: number) => {
    setCategories(prev => 
      prev.map(category => ({
        ...category,
        items: category.items.map(item => 
          item.id === partId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      }))
    );
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const [addPartOpen, setAddPartOpen] = useState(false);
  const [newPart, setNewPart] = useState({ name: '', partId: '', quantity: 1, descriptionKV: [{ value: '', key: '' }] });
  const [categoryForPart, setCategoryForPart] = useState<string | null>(null);

  const handleAddPart = () => {
    if (!categoryForPart) return;
    // Build description string from key-value pairs
    const descriptionString = newPart.descriptionKV
      .filter(kv => kv.value.trim() && kv.key.trim())
      .map(kv => `• ${kv.value}: ${kv.key}`)
      .join('\n');
    setCategories(categories.map(cat =>
      cat.name === categoryForPart
        ? { ...cat, items: [...cat.items, { id: Date.now().toString(), name: newPart.name, partId: newPart.partId, description: descriptionString, descriptionKV: newPart.descriptionKV, category: categoryForPart, quantity: newPart.quantity, vendors: [], status: 'not-ordered' }] }
        : cat
    ));
    setNewPart({ name: '', partId: '', quantity: 1, descriptionKV: [{ value: '', key: '' }] });
    setAddPartOpen(false);
    setCategoryForPart(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* BOM Header */}
        <BOMHeader />

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search parts by name, ID, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="ml-2" onClick={() => setAddPartOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Part
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Filter
            </Button>
            <label>
              <input type="file" multiple className="hidden" onChange={handleUploadDocs} />
              <Button asChild variant="outline" size="sm">
                <span><Upload size={16} className="mr-2" />Upload Document(s)</span>
              </Button>
            </label>
            {uploadedDocs.length > 0 && (
              <ul className="text-xs mt-2 ml-1">
                {uploadedDocs.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
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

        {/* Add Part Dialog */}
        {addPartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded shadow-lg p-6 min-w-[350px] text-center">
              <div className="mb-4 text-lg font-semibold">Add Part</div>
              <select className="w-full border rounded p-2 mb-2" value={categoryForPart ?? ''} onChange={e => setCategoryForPart(e.target.value)}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {categoryForPart && (
                <div className="mb-2 text-left">
                  <div className="font-semibold text-sm mb-1">Parts in {categoryForPart}:</div>
                  <ul className="border rounded p-2 bg-gray-50 max-h-32 overflow-y-auto text-xs">
                    {categories.find(cat => cat.name === categoryForPart)?.items.map(part => (
                      <li key={part.id}>{part.name} ({part.partId})</li>
                    ))}
                    {categories.find(cat => cat.name === categoryForPart)?.items.length === 0 && (
                      <li className="text-gray-400">No parts yet.</li>
                    )}
                  </ul>
                </div>
              )}
              <input className="w-full border rounded p-2 mb-2" value={newPart.name} onChange={e => setNewPart({ ...newPart, name: e.target.value, descriptionKV: newPart.descriptionKV })} placeholder="Part name" />
              <input className="w-full border rounded p-2 mb-2" value={newPart.partId} onChange={e => setNewPart({ ...newPart, partId: e.target.value, descriptionKV: newPart.descriptionKV })} placeholder="Part ID" />
              {/* Description Key-Value Inputs */}
              <div className="mb-2">
                <div className="font-semibold text-sm mb-1 text-left">Description</div>
                {newPart.descriptionKV.map((kv, idx) => (
                  <div key={idx} className="flex gap-2 mb-1">
                    <input
                      className="border rounded p-2 font-bold w-1/2"
                      placeholder="Value (bold, left)"
                      value={kv.value}
                      onChange={e => setNewPart({
                        ...newPart,
                        descriptionKV: newPart.descriptionKV.map((item, i) => i === idx ? { ...item, value: e.target.value } : item)
                      })}
                    />
                    <input
                      className="border rounded p-2 w-1/2"
                      placeholder="Key (right)"
                      value={kv.key}
                      onChange={e => setNewPart({
                        ...newPart,
                        descriptionKV: newPart.descriptionKV.map((item, i) => i === idx ? { ...item, key: e.target.value } : item)
                      })}
                    />
                    <button
                      className="text-red-500 px-2"
                      onClick={e => {
                        e.preventDefault();
                        setNewPart({
                          ...newPart,
                          descriptionKV: newPart.descriptionKV.length > 1 ? newPart.descriptionKV.filter((_, i) => i !== idx) : newPart.descriptionKV
                        });
                      }}
                      disabled={newPart.descriptionKV.length === 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="text-blue-600 text-xs mt-1"
                  onClick={e => {
                    e.preventDefault();
                    setNewPart({
                      ...newPart,
                      descriptionKV: [...newPart.descriptionKV, { value: '', key: '' }]
                    });
                  }}
                >
                  + Add Row
                </button>
              </div>
              <input className="w-full border rounded p-2 mb-4" type="number" min={1} value={newPart.quantity} onChange={e => setNewPart({ ...newPart, quantity: Number(e.target.value), descriptionKV: newPart.descriptionKV })} placeholder="Quantity" />
              <div className="flex justify-center gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleAddPart} disabled={!categoryForPart || !newPart.name.trim() || !newPart.partId.trim()}>Add</button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={() => setAddPartOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BOM Categories List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredCategories.map((category) => (
              <BOMCategoryCard
                key={category.name}
                category={category}
                onToggle={() => toggleCategory(category.name)}
                onPartClick={handlePartClick}
                onQuantityChange={handleQuantityChange}
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
            <BOMPartDetails
              part={selectedPart}
              onClose={() => setSelectedPart(null)}
              onUpdatePart={(updatedPart) => {
                setCategories(prev => prev.map(cat => ({
                  ...cat,
                  items: cat.items.map(item =>
                    item.id === updatedPart.id ? { ...item, ...updatedPart } : item
                  )
                })));
                setSelectedPart(updatedPart);
              }}
              onDeletePart={(id) => {
                setCategories(prev => prev.map(cat => ({
                  ...cat,
                  items: cat.items.filter(item => item.id !== id)
                })));
                setSelectedPart(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BOM;
