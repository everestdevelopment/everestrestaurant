import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Trash, Plus, Loader2, Star, Package, DollarSign, Image as ImageIcon, Upload, Link, X, Search, Filter, Grid, List, Eye, EyeOff, ShoppingCart, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

// CSS stillar
const styles = `
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .admin-section {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
  .dark .admin-section {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
  .admin-title {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .admin-button {
    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
  }
  .admin-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.4);
  }
  .admin-modal {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
  }
  .dark .admin-modal {
    background: rgba(15, 23, 42, 0.95);
  }
  .admin-form-group {
    position: relative;
  }
  .admin-form-input {
    transition: all 0.3s ease;
    border: 2px solid transparent;
    background: rgba(255, 255, 255, 0.8);
  }
  .dark .admin-form-input {
    background: rgba(30, 41, 59, 0.8);
  }
  .admin-form-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

interface Product {
  _id: string;
  nameKey: string;
  descriptionKey: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  quantity: number;
  isAvailable: boolean;
}

interface ProductFormData {
  nameKey: string;
  descriptionKey: string;
  price: string;
  image: string;
  category: string;
  rating: number;
  quantity: string;
  isAvailable: boolean;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [formData, setFormData] = useState<ProductFormData>({
    nameKey: '',
    descriptionKey: '',
    price: '',
    image: '',
    category: '',
    rating: 0,
    quantity: '',
    isAvailable: true
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Helper function to normalize category names
  const normalizeCategory = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Appetizers': 'appetizers',
      'Main Courses': 'main_courses',
      'Desserts': 'desserts',
      'Beverages': 'beverages',
      'Pizza': 'pizza',
      'Pasta': 'pasta',
      'Salads': 'salads',
      'Seafood': 'seafood',
      'Steaks': 'steaks',
      'Soups': 'soups',
      'Grilled': 'grilled',
      'Vegan': 'vegan',
      'Sushi': 'sushi',
      'Sandwiches': 'sandwiches',
      'Breakfast': 'breakfast',
      'Kids': 'kids',
      'Specials': 'specials',
      'Cocktails': 'cocktails',
      'Smoothies': 'smoothies'
    };
    
    return categoryMap[category] || category;
  };

  const categories = [
    { value: 'all', label: 'Barcha mahsulotlar', icon: '🍽️' },
    { value: 'appetizers', label: 'Aperatiflar', icon: '🥗' },
    { value: 'main_courses', label: 'Asosiy taomlar', icon: '🍖' },
    { value: 'desserts', label: 'Shirinliklar', icon: '🍰' },
    { value: 'beverages', label: 'Ichimliklar', icon: '🥤' },
    { value: 'pizza', label: 'Pitsa', icon: '🍕' },
    { value: 'pasta', label: 'Makaron', icon: '🍝' },
    { value: 'salads', label: 'Salatlar', icon: '🥬' },
    { value: 'seafood', label: 'Dengiz mahsulotlari', icon: '🐟' },
    { value: 'steaks', label: 'Steklar', icon: '🥩' },
    { value: 'soups', label: 'Shorvalar', icon: '🍲' },
    { value: 'grilled', label: 'Grill', icon: '🔥' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'sushi', label: 'Sushi', icon: '🍣' },
    { value: 'sandwiches', label: 'Sendvichlar', icon: '🥪' },
    { value: 'breakfast', label: 'Nonushta', icon: '🍳' },
    { value: 'kids', label: 'Bolalar uchun', icon: '👶' },
    { value: 'specials', label: 'Maxsus taomlar', icon: '⭐' },
    { value: 'cocktails', label: 'Kokteyllar', icon: '🍸' },
    { value: 'smoothies', label: 'Smoothielar', icon: '🥤' }
  ];

  const ratingOptions = [
    { value: 0, label: 'Reyting yo\'q', stars: 0 },
    { value: 1, label: '1 yulduz', stars: 1 },
    { value: 2, label: '2 yulduz', stars: 2 },
    { value: 3, label: '3 yulduz', stars: 3 },
    { value: 4, label: '4 yulduz', stars: 4 },
    { value: 5, label: '5 yulduz', stars: 5 }
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/products?limit=1000');
      // Handle paginated response structure
      const productsData = data.data?.docs || data.data || [];
      setProducts(productsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      toast({ title: 'Error', description: err.message || 'Failed to fetch products', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Empty dependency array - only run once on mount

  const resetForm = useCallback(() => {
    setFormData({
      nameKey: '',
      descriptionKey: '',
      price: '',
      image: '',
      category: '',
      rating: 0,
      quantity: '',
      isAvailable: true
    });
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.nameKey.trim()) {
      toast({ title: 'Xato', description: 'Mahsulot nomi bo\'sh', variant: 'destructive' });
      return false;
    }
    if (!formData.descriptionKey.trim()) {
      toast({ title: 'Xato', description: 'Mahsulot tavsifi bo\'sh', variant: 'destructive' });
      return false;
    }
    if (formData.price === '') {
      toast({ title: 'Xato', description: 'Narx bo\'sh', variant: 'destructive' });
      return false;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast({ title: 'Xato', description: 'Narx son bo\'lishi kerak', variant: 'destructive' });
      return false;
    }
    if (!formData.category) {
      toast({ title: 'Xato', description: 'Kategoriya tanlanmagan', variant: 'destructive' });
      return false;
    }
    // Quantity ixtiyoriy, agar kiritilgan bo'lsa tekshirish
    if (formData.quantity && formData.quantity.trim() !== '') {
      if (isNaN(parseInt(formData.quantity)) || parseInt(formData.quantity) < 0) {
        toast({ title: 'Xato', description: 'Miqdori manfiy bo\'lishi mumkin emas', variant: 'destructive' });
        return false;
      }
    }
    return true;
  }, [formData, toast]);

  const handleAddProduct = useCallback(async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
      };
      
      // console.log('📤 Frontend: Sending product data:', productData);
      // console.log('🖼️ Frontend: Image URL:', productData.image);
      // console.log('🖼️ Frontend: Image URL length:', productData.image.length);
      // console.log('🖼️ Frontend: Image URL type:', typeof productData.image);

      const newProduct = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });

      // console.log('📥 Frontend: Received product response:', newProduct);
      setProducts(prev => [newProduct, ...prev]);
      toast({ title: 'Muvaffaqiyatli', description: 'Mahsulot qo\'shildi' });
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('❌ Frontend: Error creating product:', err);
      toast({ title: 'Xato', description: err.message || 'Mahsulot qo\'shishda xato', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }, [formData, toast, resetForm]);

  const handleEditProduct = useCallback(async () => {
    if (!editingProduct) return;
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
      };
      
      await apiFetch(`/products/${editingProduct._id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      toast({ title: 'Muvaffaqiyatli', description: 'Mahsulot muvaffaqiyatli tahrirlandi' });
      setIsEditModalOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      toast({ title: 'Xato', description: err.message || 'Mahsulot tahrirlashda xato', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }, [editingProduct, formData, validateForm, resetForm, toast]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      await apiFetch(`/products/${productId}`, {
        method: 'DELETE'
      });
      toast({ title: 'Muvaffaqiyatli', description: 'Mahsulot muvaffaqiyatli o\'chirildi' });
      fetchProducts();
    } catch (err: any) {
      toast({ title: 'Xato', description: err.message || 'Mahsulot o\'chirishda xato', variant: 'destructive' });
    }
  }, [toast]);

  const handleImageUrlChange = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  }, []);

  // Rasm URL validation
  const validateImageUrl = useCallback((url: string) => {
    if (!url || url.trim() === '') {
      return { isValid: true, message: 'Rasm URL kiritilmagan (ixtiyoriy)' };
    }
    
    // URL bo'sh emas bo'lsa, to'g'ri deb hisoblaymiz
    return { isValid: true, message: 'Rasm URL to\'g\'ri' };
  }, []);

  const openEditModal = useCallback((product: Product) => {
    // console.log('🔍 Opening edit modal for product:', product);
    // console.log('🖼️ Product image URL:', product.image);
    // console.log('🖼️ Product image type:', typeof product.image);
    
    // Rasm URL ni to'g'ri ko'rsatish uchun
    let imageUrl = product.image || '';
    
    // Agar backend dan kelgan URL /uploads/ bilan boshlansa, uni to'g'ridan-to'g'ri ishlatamiz
    if (imageUrl.startsWith('/uploads/')) {
      // console.log('📁 Using uploaded image path:', imageUrl);
    } else if (imageUrl.startsWith('http')) {
      // console.log('🔗 Using external URL:', imageUrl);
    } else if (imageUrl.startsWith('data:image/')) {
      // console.log('📎 Using base64 image:', imageUrl.substring(0, 50) + '...');
    } else {
      // console.log('⚠️ Unknown image format:', imageUrl);
    }
    
    setEditingProduct(product);
    setFormData({
      nameKey: product.nameKey,
      descriptionKey: product.descriptionKey,
      price: product.price.toString(),
      image: imageUrl, // To'g'ri URL ni o'rnatamiz
      category: normalizeCategory(product.category),
      rating: product.rating,
      quantity: product.quantity ? product.quantity.toString() : '',
      isAvailable: product.isAvailable
    });
    // console.log('📝 Form data set with image:', imageUrl);
    setIsEditModalOpen(true);
  }, []);

  const openAddModal = useCallback(() => {
    resetForm();
    setIsAddModalOpen(true);
  }, [resetForm]);

  const getCategoryLabel = useCallback((categoryKey: string) => {
    const normalizedCategory = normalizeCategory(categoryKey);
    const category = categories.find(cat => cat.value === normalizedCategory);
    return category ? category.label : categoryKey;
  }, [categories]);

  const getRatingStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  }, []);

  // Optimized filtered products with useMemo
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      const normalizedProductCategory = normalizeCategory(product.category);
      if (selectedCategory !== 'all' && normalizedProductCategory !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = product.nameKey.toLowerCase().includes(searchLower);
        const descMatch = product.descriptionKey.toLowerCase().includes(searchLower);
        if (!nameMatch && !descMatch) {
          return false;
        }
      }
      
      // Availability filter
      if (availabilityFilter !== 'all' && product.isAvailable !== (availabilityFilter === 'available')) {
        return false;
      }
      
      return true;
    });
  }, [products, selectedCategory, searchTerm, availabilityFilter]);

  return (
    <div className="admin-section p-4 md:p-6">
      <style>{styles}</style>
      {/* Header */}
      <div className="admin-header mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="admin-title text-2xl md:text-3xl font-bold">Mahsulotlar boshqaruvi</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Mahsulotlarni qo'shish, tahrirlash va boshqarish</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddModal} className="admin-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent className="admin-modal max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Yangi mahsulot qo'shish
                </DialogTitle>
              </DialogHeader>
              <div className="admin-form space-y-6">
                {/* Mahsulot nomi */}
                <div className="admin-form-group">
                  <Label htmlFor="nameKey" className="text-sm font-semibold">Mahsulot nomi</Label>
                  <Input
                    id="nameKey"
                    value={formData.nameKey}
                    onChange={(e) => setFormData({ ...formData, nameKey: e.target.value })}
                    placeholder="Mahsulot nomini kiriting"
                    className="admin-form-input"
                  />
                </div>

                {/* Tavsif */}
                <div className="admin-form-group">
                  <Label htmlFor="descriptionKey" className="text-sm font-semibold">Tavsif</Label>
                  <Textarea
                    id="descriptionKey"
                    value={formData.descriptionKey}
                    onChange={(e) => setFormData({ ...formData, descriptionKey: e.target.value })}
                    placeholder="Mahsulot tavsifini kiriting"
                    className="admin-form-input"
                    rows={3}
                  />
                </div>

                {/* Narx va miqdori */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="admin-form-group">
                    <Label htmlFor="price" className="text-sm font-semibold">Narx (UZS)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Narxni kiriting"
                      className="admin-form-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <Label htmlFor="quantity" className="text-sm font-semibold">Miqdori (ixtiyoriy)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="Miqdori (bo'sh qoldirish mumkin)"
                      className="admin-form-input"
                    />
                    <p className="text-xs text-gray-500 mt-1">Agar kiritilmasa, menuda miqdori ko'rsatilmaydi</p>
                  </div>
                </div>

                {/* Rasm */}
                <div className="admin-form-group">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <ImageIcon className="w-4 h-4" />
                    Mahsulot rasmi (ixtiyoriy)
                  </Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="Rasm URL manzilini kiriting (ixtiyoriy)"
                    className="admin-form-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Rasm URL manzilini kiriting (ixtiyoriy, nima kiritilsa, shu saqlanadi)</p>
                  
                  {/* Rasm Preview */}
                  <div className="relative inline-block mt-3">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Mahsulot rasmi"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Rasm yuklanmadi</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Rasm yo'q</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Rasm URL Validation */}
                  {formData.image && (
                    <div className="mt-2">
                      {(() => {
                        const validation = validateImageUrl(formData.image);
                        return (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full ${validation.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
                                {validation.isValid ? 'Rasm URL to\'g\'ri' : validation.message}
                              </span>
                            </div>
                            <div className="text-xs text-blue-600">
                              💾 URL to'g'ridan-to'g'ri saqlanadi
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Kategoriya va reyting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="admin-form-group">
                    <Label htmlFor="category" className="text-sm font-semibold">Kategoriya</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="admin-form-input">
                        <SelectValue placeholder="Kategoriyani tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="admin-form-group">
                    <Label htmlFor="rating" className="text-sm font-semibold">Reyting</Label>
                    <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                      <SelectTrigger className="admin-form-input">
                        <SelectValue placeholder="Reytingni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {ratingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            <div className="flex items-center gap-2">
                              {getRatingStars(option.stars)}
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mavjudlik */}
                <div className="admin-form-group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isAvailable" className="text-sm font-semibold">Mavjud</Label>
                    <Switch
                      id="isAvailable"
                      checked={formData.isAvailable}
                      onCheckedChange={(value) => setFormData({ ...formData, isAvailable: value })}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.isAvailable ? 'Mahsulot mavjud va sotuvda' : 'Mahsulot mavjud emas'}
                  </p>
                </div>

                {/* Amallar */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddProduct} disabled={submitting} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {submitting ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                    Bekor qilish
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-lg">Filtrlash va qidirish</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Mahsulot nomi yoki tavsifi"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Barcha kategoriyalar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🍽️ Barcha kategoriyalar</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability Filter */}
          <div>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Barcha mavjudliklar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha mavjudliklar</SelectItem>
                <SelectItem value="available">
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    Mavjud
                  </span>
                </SelectItem>
                <SelectItem value="unavailable">
                  <span className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-red-600" />
                    Mavjud emas
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex-1"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex-1"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {`${filteredProducts.length} ta mahsulot / ${products.length} ta umumiy`}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchProducts}>
              <Loader2 className="w-4 h-4 mr-2" />
              Yangilash
            </Button>
          </div>
        </div>
      </div>

      {/* Mahsulotlar ro'yxati */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium">Mahsulotlar yuklanmoqda...</p>
            <p className="text-sm text-gray-500">Iltimos, kuting</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-red-500 mb-4 text-lg">{error}</div>
          <Button onClick={fetchProducts} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Qayta urinish
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Mahsulot topilmadi</h3>
          <p className="text-gray-500 mb-4">Qidiruv natijalariga mos mahsulot yo'q</p>
          <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setAvailabilityFilter('all'); }}>
            Filtrlarni tozalash
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <div key={product._id} className={viewMode === 'grid' 
              ? "bg-white dark:bg-slate-800 rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group" 
              : "bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-6 hover:shadow-lg transition-all duration-200"
            }>
              {viewMode === 'grid' ? (
                // Grid view
                <>
                  <div className="relative">
                    {product.image ? (
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.nameKey}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${product.image ? 'hidden' : ''} w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Rasm yo'q</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-slate-800/90">
                        {getCategoryLabel(product.category)}
                      </Badge>
                      <Badge variant={product.isAvailable ? "default" : "destructive"} className="text-xs">
                        {product.isAvailable ? (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Mavjud
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            Mavjud emas
                          </span>
                        )}
                      </Badge>
                    </div>
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg">Mavjud emas</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.nameKey}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.descriptionKey}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {getRatingStars(product.rating)}
                        <span className="text-xs text-gray-500">({product.rating})</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">
                          {product.price.toLocaleString()} so'm
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            {product.quantity > 0 ? `${product.quantity} dona` : 'Miqdori ko\'rsatilmagan'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(product)} className="flex-1">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="flex-1">
                            <Trash className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Mahsulotni o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{product.nameKey}" mahsulotini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product._id)}>
                              O'chirish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </>
              ) : (
                // List view
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {product.image ? (
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.nameKey}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${product.image ? 'hidden' : ''} w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center`}>
                      <div className="text-center">
                        <ImageIcon className="w-6 h-6 mx-auto text-gray-400" />
                      </div>
                    </div>
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <EyeOff className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{product.nameKey}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {product.descriptionKey}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">
                          {product.price.toLocaleString()} so'm
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" />
                            {product.quantity > 0 ? `${product.quantity} dona` : 'Miqdori ko\'rsatilmagan'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryLabel(product.category)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getRatingStars(product.rating)}
                          <span className="text-xs text-gray-500">({product.rating})</span>
                        </div>
                        <Badge variant={product.isAvailable ? "default" : "destructive"} className="text-xs">
                          {product.isAvailable ? 'Mavjud' : 'Mavjud emas'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(product)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Mahsulotni o'chirish</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{product.nameKey}" mahsulotini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProduct(product._id)}>
                                O'chirish
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="admin-modal max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Pencil className="w-5 h-5 text-blue-600" />
              Mahsulotni tahrirlash
            </DialogTitle>
          </DialogHeader>
          <div className="admin-form space-y-6">
            {/* Mahsulot nomi */}
            <div className="admin-form-group">
              <Label htmlFor="edit-nameKey" className="text-sm font-semibold">Mahsulot nomi</Label>
              <Input
                id="edit-nameKey"
                value={formData.nameKey}
                onChange={(e) => setFormData({ ...formData, nameKey: e.target.value })}
                placeholder="Mahsulot nomini kiriting"
                className="admin-form-input"
              />
            </div>

            {/* Tavsif */}
            <div className="admin-form-group">
              <Label htmlFor="edit-descriptionKey" className="text-sm font-semibold">Tavsif</Label>
              <Textarea
                id="edit-descriptionKey"
                value={formData.descriptionKey}
                onChange={(e) => setFormData({ ...formData, descriptionKey: e.target.value })}
                placeholder="Mahsulot tavsifini kiriting"
                className="admin-form-input"
                rows={3}
              />
            </div>

            {/* Narx va miqdori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="admin-form-group">
                <Label htmlFor="edit-price" className="text-sm font-semibold">Narx (UZS)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Narxni kiriting"
                  className="admin-form-input"
                />
              </div>
              <div className="admin-form-group">
                <Label htmlFor="edit-quantity" className="text-sm font-semibold">Miqdori (ixtiyoriy)</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="Miqdori (bo'sh qoldirish mumkin)"
                  className="admin-form-input"
                />
                <p className="text-xs text-gray-500 mt-1">Agar kiritilmasa, menuda miqdori ko'rsatilmaydi</p>
              </div>
            </div>

            {/* Rasm */}
            <div className="admin-form-group">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon className="w-4 h-4" />
                Mahsulot rasmi (ixtiyoriy)
              </Label>
              <Input
                value={formData.image}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="Rasm URL manzilini kiriting (ixtiyoriy)"
                className="admin-form-input"
              />
              <p className="text-xs text-gray-500 mt-1">Rasm URL manzilini kiriting (ixtiyoriy, nima kiritilsa, shu saqlanadi)</p>
              
              {/* Rasm Preview */}
              <div className="relative inline-block mt-3">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Mahsulot rasmi"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">Rasm yuklanmadi</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">Rasm yo'q</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Rasm URL Validation */}
              {formData.image && (
                <div className="mt-2">
                  {(() => {
                    const validation = validateImageUrl(formData.image);
                    return (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${validation.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
                            {validation.isValid ? 'Rasm URL to\'g\'ri' : validation.message}
                          </span>
                        </div>
                        <div className="text-xs text-blue-600">
                          💾 URL to'g'ridan-to'g'ri saqlanadi
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Kategoriya va reyting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="admin-form-group">
                <Label htmlFor="edit-category" className="text-sm font-semibold">Kategoriya</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="admin-form-input">
                    <SelectValue placeholder="Kategoriyani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="admin-form-group">
                <Label htmlFor="edit-rating" className="text-sm font-semibold">Reyting</Label>
                <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}>
                  <SelectTrigger className="admin-form-input">
                    <SelectValue placeholder="Reytingni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        <div className="flex items-center gap-2">
                          {getRatingStars(option.stars)}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mavjudlik */}
            <div className="admin-form-group">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-isAvailable" className="text-sm font-semibold">Mavjud</Label>
                <Switch
                  id="edit-isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(value) => setFormData({ ...formData, isAvailable: value })}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.isAvailable ? 'Mahsulot mavjud va sotuvda' : 'Mahsulot mavjud emas'}
              </p>
            </div>

            {/* Amallar */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleEditProduct} disabled={submitting} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                {submitting ? 'Tahrirlanmoqda...' : 'Tahrirlash'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                Bekor qilish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts; 