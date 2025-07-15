
import { X, FileText, Calendar, Building2, DollarSign, Clock, Package, Pencil, Plus, Check, Trash2, Upload as UploadIcon } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { useToast } from '@/components/ui/use-toast';

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
  descriptionKV?: Array<{ key: string; value: string }>;
  documents?: string[];
}

interface BOMPartDetailsProps {
  part: BOMItem | null;
  onClose: () => void;
  onUpdatePart?: (updated: BOMItem) => void;
  onDeletePart?: (id: string) => void;
}

const BOMPartDetails = ({ part, onClose, onUpdatePart, onDeletePart }: BOMPartDetailsProps) => {
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

  // Extract camera specs from description (simple regex for demo)
  let resMatch = part.description.match(/Resolution: ([^\n]*)/);
  let typeMatch = part.description.match(/Type: ([^\n]*)/);
  let modelMatch = part.description.match(/Model Number: ([^\n]*)/);
  let makeMatch = part.description.match(/Make: ([^\n]*)/);
  let colorMatch = part.description.match(/(Monochrome|RGB)/i);

  const [editOpen, setEditOpen] = useState(false);
  const [resolution, setResolution] = useState(resMatch ? resMatch[1].trim() : '');
  const [type, setType] = useState(typeMatch ? typeMatch[1].trim() : 'Area scan');
  const [model, setModel] = useState(modelMatch ? modelMatch[1].trim() : '');
  const [make, setMake] = useState(makeMatch ? makeMatch[1].trim() : '');
  const [color, setColor] = useState(colorMatch ? colorMatch[0].toLowerCase().includes('rgb') ? 'RGB' : 'Monochrome' : '');
  const [qty, setQty] = useState(part.quantity);
  const [partName, setPartName] = useState(part.name);
  const [addVendorOpen, setAddVendorOpen] = useState(false);
  const [pan, setPan] = useState('');
  const [gst, setGst] = useState('');
  const [bank, setBank] = useState('');
  const [po, setPo] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorLeadTime, setVendorLeadTime] = useState('');
  const [vendorCost, setVendorCost] = useState('');
  type Vendor =
    | { name: string; price: number; leadTime: string; availability: string }
    | { name: string; pan?: string; gst?: string; bank?: string; po?: string };
  const [vendors, setVendors] = useState<Vendor[]>(part.vendors || []);
  const [partState, setPartState] = useState(part);

  useEffect(() => {
    setPartState(part);
    // Optionally reset other related state here if needed
  }, [part]);

  // Edit vendor state and handlers
  const [editVendorIdx, setEditVendorIdx] = useState<number | undefined>(undefined);
  const [editVendorName, setEditVendorName] = useState('');
  const [editPan, setEditPan] = useState('');
  const [editGst, setEditGst] = useState('');
  const [editBank, setEditBank] = useState('');
  const [editPo, setEditPo] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Expose finalized vendor to parent (BOMPartRow) if needed
  // You may want to use a callback or context to sync this state with the left tab
  const [finalizedVendorIdx, setFinalizedVendorIdx] = useState<number | null>(null);
  const [showDeletePartConfirm, setShowDeletePartConfirm] = useState(false);
  const [docDeleteMode, setDocDeleteMode] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  // Use partState.documents for per-part documents
  const documents = partState?.documents || [];
  const setDocuments = (docs: string[]) => {
    setPartState(prev => prev ? { ...prev, documents: docs } : prev);
    if (typeof onUpdatePart === 'function' && partState) {
      onUpdatePart({ ...partState, documents: docs });
    }
  };
  const { toast } = useToast();
  // Handle file upload for this part
  const handleUploadDocs = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocs = [...documents, ...Array.from(e.target.files).map(f => f.name)];
      setDocuments(newDocs);
      toast({ title: 'Upload Successful', description: `${e.target.files.length} document(s) uploaded.` });
    }
  };
  // Description edit dialog state
  const [editDescOpen, setEditDescOpen] = useState(false);
  const [descKVEdit, setDescKVEdit] = useState<Array<{ value: string; key: string }>>(partState?.descriptionKV ? [...partState.descriptionKV] : [{ value: '', key: '' }]);

  const handleSave = () => {
    if (!partState) return;
    const newDescription =
      `• Resolution: ${resolution}\n` +
      `• Type: ${type}\n` +
      `• Model Number: ${model}\n` +
      `• Make: ${make}`;
    const updated: BOMItem = {
      ...partState,
      name: partName,
      description: newDescription,
      quantity: qty,
    };
    setPartState(updated);
    if (typeof onUpdatePart === 'function') onUpdatePart(updated);
    setEditOpen(false);
  };

  const handleAddVendor = () => {
    if (!vendorName.trim()) return;
    setVendors([
      ...vendors,
      {
        name: vendorName,
        pan,
        gst,
        bank,
        po,
        leadTime: vendorLeadTime,
        price: vendorCost ? Number(vendorCost) : undefined,
      },
    ]);
    setVendorName('');
    setVendorLeadTime('');
    setVendorCost('');
    setPan('');
    setGst('');
    setBank('');
    setPo('');
    setAddVendorOpen(false);
  };

  const handleEditVendorOpen = (idx: number) => {
    setEditVendorIdx(idx);
    const v = vendors[idx];
    setEditVendorName(v.name || '');
    setEditPan('pan' in v ? v.pan || '' : '');
    setEditGst('gst' in v ? v.gst || '' : '');
    setEditBank('bank' in v ? v.bank || '' : '');
    setEditPo('po' in v ? v.po || '' : '');
  };
  const handleEditVendorSave = () => {
    if (editVendorIdx === undefined) return;
    setVendors(vendors.map((v, i) => i === editVendorIdx ? { ...v, name: editVendorName, pan: editPan, gst: editGst, bank: editBank, po: editPo } : v));
    setEditVendorIdx(undefined);
  };

  const handleFinalizeVendor = (idx: number) => {
    setFinalizedVendorIdx(idx);
    if (partState && typeof onUpdatePart === 'function') {
      const finalizedVendor = vendors[idx];
      onUpdatePart({ ...partState, finalizedVendor, quantity: partState.quantity });
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{partState?.name}
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <button className="ml-2 p-1 text-gray-500 hover:text-blue-600 align-middle" style={{verticalAlign: 'middle'}} aria-label="Edit part specs">
                    <Pencil size={14} />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Camera Specifications</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Part Name</label>
                      <input className="w-full border rounded p-2" value={partName} onChange={e => setPartName(e.target.value)} placeholder="e.g. Basler acA2040-90um" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity</label>
                      <input type="number" min={1} className="w-full border rounded p-2" value={qty} onChange={e => setQty(Number(e.target.value))} />
                    </div>
                  </form>
                  <DialogFooter className="mt-4 flex gap-2">
                    <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave}>Save</button>
                    <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={() => setEditOpen(false)}>Cancel</button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{partState?.partId}</Badge>
              <Badge className={getStatusColor(partState?.status || '')}>
                {partState?.status.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quantity Info */}
        <div className="flex items-center justify-between mb-2 mt-1">
          <span className="text-gray-600 font-medium text-sm">Quantity:</span>
          <span className="font-medium text-base">{partState?.quantity}</span>
        </div>
        {/* Description */}
        <div>
          <div className="flex items-center mb-2">
            <h4 className="font-medium text-gray-900 mr-2">Description</h4>
            <button className="p-1 text-gray-500 hover:text-blue-600 align-middle" aria-label="Edit description" onClick={() => {
              setDescKVEdit(Array.isArray(partState?.descriptionKV) && partState.descriptionKV.length > 0 ? [...partState.descriptionKV] : [{ value: '', key: '' }]);
              setEditDescOpen(true);
            }}>
              <Pencil size={15} />
            </button>
          </div>
          {Array.isArray(partState?.descriptionKV) && partState.descriptionKV.length > 0 ? (
            <dl className="text-sm text-gray-700 space-y-1">
              {partState.descriptionKV.map((kv, idx) => (
                <div className="flex gap-2 items-center" key={idx}>
                  <dt className="w-24 font-bold text-left">{kv.value}</dt>
                  <dd className="flex-1 text-left">{kv.key}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="text-gray-400 italic text-sm">No description available.</div>
          )}
          {/* Edit Description Dialog */}
          <Dialog open={editDescOpen} onOpenChange={setEditDescOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Description</DialogTitle>
              </DialogHeader>
              <form className="space-y-3">
                {descKVEdit.map((kv, idx) => (
                  <div key={idx} className="flex gap-2 mb-1 items-center">
                    <input
                      className="border rounded p-2 font-bold w-1/2"
                      placeholder="Value (bold, left)"
                      value={kv.value}
                      onChange={e => setDescKVEdit(descKVEdit.map((item, i) => i === idx ? { ...item, value: e.target.value } : item))}
                    />
                    <input
                      className="border rounded p-2 w-1/2"
                      placeholder="Key (right)"
                      value={kv.key}
                      onChange={e => setDescKVEdit(descKVEdit.map((item, i) => i === idx ? { ...item, key: e.target.value } : item))}
                    />
                    <button
                      className="text-red-500 px-2"
                      onClick={e => {
                        e.preventDefault();
                        setDescKVEdit(descKVEdit.length > 1 ? descKVEdit.filter((_, i) => i !== idx) : descKVEdit);
                      }}
                      disabled={descKVEdit.length === 1}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="text-blue-600 text-xs mt-1"
                  onClick={e => {
                    e.preventDefault();
                    setDescKVEdit([...descKVEdit, { value: '', key: '' }]);
                  }}
                >
                  + Add Row
                </button>
              </form>
              <DialogFooter className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => {
                    // Save changes to partState and notify parent
                    setPartState(prev => prev ? { ...prev, descriptionKV: descKVEdit } : prev);
                    if (typeof onUpdatePart === 'function' && partState) {
                      onUpdatePart({ ...partState, descriptionKV: descKVEdit });
                    }
                    setEditDescOpen(false);
                  }}
                >Save</button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                  onClick={() => setEditDescOpen(false)}
                >Cancel</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Separator />
        
        {/* Vendor Section with Add Vendor Popup */}
        <div>
          <div className="flex items-center mb-3">
            <h4 className="font-medium text-gray-900 mr-2">Vendor</h4>
            <button className="p-1 text-gray-500 hover:text-blue-600 align-middle" style={{verticalAlign: 'middle'}} aria-label="Add vendor" onClick={() => setAddVendorOpen(true)}>
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {vendors.map((vendor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900 flex items-center gap-1">
                    {vendor.name}
                    <button className="p-1 text-gray-500 hover:text-blue-600 align-middle" style={{verticalAlign: 'middle'}} aria-label="Edit vendor" onClick={() => handleEditVendorOpen(index)}>
                      <Pencil size={13} />
                    </button>
                    <button className={`p-1 ml-1 ${finalizedVendorIdx === index ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`} aria-label="Finalize vendor" onClick={() => handleFinalizeVendor(index)}>
                      <Check size={15} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {'leadTime' in vendor && vendor.leadTime && (
                    <div><span className="font-semibold">Lead Time:</span> {vendor.leadTime}</div>
                  )}
                  {'price' in vendor && vendor.price !== undefined && (
                    <div><span className="font-semibold">Cost:</span> ${vendor.price}</div>
                  )}
                </div>
              </div>
            ))}
            {/* Edit Vendor Dialog */}
            <Dialog open={editVendorIdx !== undefined} onOpenChange={v => { if (!v) setEditVendorIdx(undefined); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Vendor</DialogTitle>
                </DialogHeader>
                <form className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Vendor Name</label>
                    <input className="w-full border rounded p-2" value={editVendorName} onChange={e => setEditVendorName(e.target.value)} placeholder="Enter vendor name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PAN Number</label>
                    <input className="w-full border rounded p-2" value={editPan} onChange={e => setEditPan(e.target.value)} placeholder="Enter PAN number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GST No</label>
                    <input className="w-full border rounded p-2" value={editGst} onChange={e => setEditGst(e.target.value)} placeholder="Enter GST number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Details</label>
                    <input className="w-full border rounded p-2" value={editBank} onChange={e => setEditBank(e.target.value)} placeholder="Enter bank details" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PO Number</label>
                    <input className="w-full border rounded p-2" value={editPo} onChange={e => setEditPo(e.target.value)} placeholder="Enter PO number" />
                  </div>
                </form>
                <DialogFooter className="mt-4 flex gap-2">
                  <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleEditVendorSave} disabled={!editVendorName.trim()}>Save</button>
                  <button type="button" className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => setShowDeleteConfirm(true)}>Delete Vendor</button>
                  <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={() => setEditVendorIdx(undefined)}>Cancel</button>
                </DialogFooter>
                {/* Delete confirmation dialog */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded shadow-lg p-6 min-w-[250px] text-center">
                      <div className="mb-4 text-gray-800">Are you sure you want to delete this vendor?</div>
                      <div className="flex justify-center gap-4">
                        <button className="px-4 py-1 bg-red-600 text-white rounded" onClick={() => {
                          if (editVendorIdx !== undefined) setVendors(vendors.filter((_, i) => i !== editVendorIdx));
                          setEditVendorIdx(undefined);
                          setShowDeleteConfirm(false);
                        }}>Yes</button>
                        <button className="px-4 py-1 bg-gray-200 text-gray-700 rounded" onClick={() => setShowDeleteConfirm(false)}>No</button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
          {/* Add Vendor Popup */}
          <Dialog open={addVendorOpen} onOpenChange={setAddVendorOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vendor</DialogTitle>
              </DialogHeader>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input className="w-full border rounded p-2" value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="Enter company name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price per unit</label>
                  <input className="w-full border rounded p-2" type="number" min="0" value={vendorCost} onChange={e => setVendorCost(e.target.value)} placeholder="Enter price per unit" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Time</label>
                  <input className="w-full border rounded p-2" value={vendorLeadTime} onChange={e => setVendorLeadTime(e.target.value)} placeholder="Enter lead time" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Status</label>
                  <select className="w-full border rounded p-2" value={color} onChange={e => setColor(e.target.value)}>
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </form>
              <DialogFooter className="mt-4">
                <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded mr-2" onClick={handleAddVendor} disabled={!vendorName.trim()}>Save</button>
                <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={() => setAddVendorOpen(false)}>Cancel</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Separator />
        
        {/* Documents Dropdown with Delete Option */}
        <div className="relative mb-3">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <div className="flex w-full items-center justify-between font-medium text-gray-900 px-0 py-2 bg-transparent border-none cursor-pointer">
                <span>Documents</span>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input type="file" multiple className="hidden" onChange={handleUploadDocs} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 px-3 py-1.5 border-blue-600 text-blue-700 hover:bg-blue-50 hover:border-blue-700 focus:ring-2 focus:ring-blue-200"
                      asChild
                    >
                      <span><UploadIcon size={16} className="mr-1" />Upload Document(s)</span>
                    </Button>
                  </label>
                  <button
                    className={`p-1 rounded-full ${docDeleteMode ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                    style={{ minWidth: 32, minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title={docDeleteMode ? 'Cancel' : 'Delete'}
                    onClick={e => {
                      e.stopPropagation();
                      setDocDeleteMode(mode => !mode);
                      setSelectedDocs([]);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-2">
                {documents.length === 0 && (
                  <div className="text-gray-400 text-sm italic flex items-center gap-2 p-2"><FileText size={16} />No documents uploaded yet.</div>
                )}
                {documents.map(doc => (
                  <div key={doc} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1 border border-gray-200">
                    {docDeleteMode && (
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc)}
                        onChange={e => setSelectedDocs(prev =>
                          e.target.checked
                            ? [...prev, doc]
                            : prev.filter(d => d !== doc)
                        )}
                      />
                    )}
                    <FileText size={16} className="text-blue-600 mr-1" />
                    <span className="flex-1 text-left text-gray-800 text-sm truncate" title={doc}>{doc}</span>
                  </div>
                ))}
                {docDeleteMode && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    disabled={selectedDocs.length === 0}
                    onClick={() => {
                      setDocuments(documents.filter(doc => !selectedDocs.includes(doc)));
                      setSelectedDocs([]);
                      setDocDeleteMode(false);
                    }}
                  >
                    Delete Selected
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
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
