import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  X, 
  Upload, 
  Image as ImageIcon,
  UtensilsCrossed,
  FileText,
  Settings,
  Tag
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiFetch } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebaseConfig';
import { useTranslation } from 'react-i18next';

interface ProductType {
  name: string;
  price: number;
  description?: string;
}

interface Ingredient {
  name: string;
  description?: string;
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
  fullDescription: string;
  types: ProductType[];
  ingredients: Ingredient[];
  preparationMethod: string;
  preparationTime: string;
  calories: string;
  allergens: string[];
  tags: string[];
  additionalImages: string[];
  metaTitle: string;
  metaDescription: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProductFormData>({
    nameKey: '',
    descriptionKey: '',
    price: '',
    image: '',
    category: '',
    rating: 4.5,
    quantity: '',
    isAvailable: true,
    fullDescription: '',
    types: [],
    ingredients: [],
    preparationMethod: '',
    preparationTime: '15',
    calories: '',
    allergens: [],
    tags: [],
    additionalImages: [],
    metaTitle: '',
    metaDescription: '',
    ...initialData
  });

  const [uploading, setUploading] = useState(false);
  const [newAdditionalImage, setNewAdditionalImage] = useState('');

  const categories = [
    { value: 'appetizers', label: t('menu_category_appetizers') },
    { value: 'main_courses', label: t('menu_category_main_courses') },
    { value: 'desserts', label: t('menu_category_desserts') },
    { value: 'beverages', label: t('menu_category_beverages') },
    { value: 'pizza', label: t('menu_category_pizza') },
    { value: 'pasta', label: t('menu_category_pasta') },
    { value: 'salads', label: t('menu_category_salads') },
    { value: 'seafood', label: t('menu_category_seafood') },
    { value: 'steaks', label: t('menu_category_steaks') },
    { value: 'soups', label: t('menu_category_soups') },
    { value: 'grilled', label: t('menu_category_grilled') },
    { value: 'vegan', label: t('menu_category_vegan') },
    { value: 'sushi', label: t('menu_category_sushi') },
    { value: 'sandwiches', label: t('menu_category_sandwiches') },
    { value: 'breakfast', label: t('menu_category_breakfast') },
    { value: 'kids', label: t('menu_category_kids') },
    { value: 'specials', label: t('menu_category_specials') },
    { value: 'cocktails', label: t('menu_category_cocktails') },
    { value: 'smoothies', label: t('menu_category_smoothies') }
  ];

  const allergenOptions = [
    { value: 'gluten', label: t('admin.products.form.allergens.gluten') },
    { value: 'dairy', label: t('admin.products.form.allergens.dairy') },
    { value: 'nuts', label: t('admin.products.form.allergens.nuts') },
    { value: 'eggs', label: t('admin.products.form.allergens.eggs') },
    { value: 'soy', label: t('admin.products.form.allergens.soy') },
    { value: 'fish', label: t('admin.products.form.allergens.fish') },
    { value: 'shellfish', label: t('admin.products.form.allergens.shellfish') },
    { value: 'wheat', label: t('admin.products.form.allergens.wheat') },
    { value: 'peanuts', label: t('admin.products.form.allergens.peanuts') },
    { value: 'tree_nuts', label: t('admin.products.form.allergens.tree_nuts') }
  ];

  const tagOptions = [
    { value: 'spicy', label: t('admin.products.form.tags.spicy') },
    { value: 'vegetarian', label: t('admin.products.form.tags.vegetarian') },
    { value: 'vegan', label: t('admin.products.form.tags.vegan') },
    { value: 'gluten_free', label: t('admin.products.form.tags.gluten_free') },
    { value: 'dairy_free', label: t('admin.products.form.tags.dairy_free') },
    { value: 'organic', label: t('admin.products.form.tags.organic') },
    { value: 'local', label: t('admin.products.form.tags.local') },
    { value: 'seasonal', label: t('admin.products.form.tags.seasonal') },
    { value: 'chef_special', label: t('admin.products.form.tags.chef_special') },
    { value: 'popular', label: t('admin.products.form.tags.popular') },
    { value: 'new', label: t('admin.products.form.tags.new') }
  ];

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'additionalImages') => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/products/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.url) {
        if (field === 'image') {
          handleInputChange('image', data.url);
        } else {
          handleInputChange('additionalImages', [...formData.additionalImages, data.url]);
        }
        toast({
          title: t('admin.products.form.toast.successTitle'),
          description: t('admin.products.form.toast.imageUploadSuccess'),
        });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: t('admin.products.form.toast.errorTitle'),
        description: t('admin.products.form.toast.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const addProductType = () => {
    const newType: ProductType = { name: '', price: 0 };
    handleInputChange('types', [...formData.types, newType]);
  };

  const updateProductType = (index: number, field: keyof ProductType, value: any) => {
    const updatedTypes = [...formData.types];
    updatedTypes[index] = { ...updatedTypes[index], [field]: value };
    handleInputChange('types', updatedTypes);
  };

  const removeProductType = (index: number) => {
    handleInputChange('types', formData.types.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = { name: '' };
    handleInputChange('ingredients', [...formData.ingredients, newIngredient]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    handleInputChange('ingredients', updatedIngredients);
  };

  const removeIngredient = (index: number) => {
    handleInputChange('ingredients', formData.ingredients.filter((_, i) => i !== index));
  };

  const toggleAllergen = (allergen: string) => {
    const updated = formData.allergens.includes(allergen)
      ? formData.allergens.filter(a => a !== allergen)
      : [...formData.allergens, allergen];
    handleInputChange('allergens', updated);
  };

  const toggleTag = (tag: string) => {
    const updated = formData.tags.includes(tag)
      ? formData.tags.filter(t => t !== tag)
      : [...formData.tags, tag];
    handleInputChange('tags', updated);
  };

  const removeAdditionalImage = (index: number) => {
    handleInputChange('additionalImages', formData.additionalImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nameKey || !formData.descriptionKey || !formData.price || !formData.image || !formData.category) {
      toast({
        title: t('admin.products.form.toast.errorTitle'),
        description: t('admin.products.form.toast.errorDescription'),
        variant: 'destructive'
      });
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
      preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
      calories: formData.calories ? parseInt(formData.calories) : undefined
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">{t('admin.products.form.tabs.basic')}</TabsTrigger>
          <TabsTrigger value="description">{t('admin.products.form.tabs.description')}</TabsTrigger>
          <TabsTrigger value="ingredients">{t('admin.products.form.tabs.ingredients')}</TabsTrigger>
          <TabsTrigger value="preparation">{t('admin.products.form.tabs.preparation')}</TabsTrigger>
          <TabsTrigger value="info">{t('admin.products.form.tabs.info')}</TabsTrigger>
        </TabsList>

        {/* Asosiy ma'lumotlar */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('admin.products.form.sections.basic')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nameKey">{t('admin.products.form.fields.name')}</Label>
                  <Input
                    id="nameKey"
                    value={formData.nameKey}
                    onChange={(e) => handleInputChange('nameKey', e.target.value)}
                    placeholder={t('admin.products.form.placeholders.name')}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">{t('admin.products.form.fields.category')}</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.products.form.placeholders.category')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descriptionKey">{t('admin.products.form.fields.shortDescription')}</Label>
                <Textarea
                  id="descriptionKey"
                  value={formData.descriptionKey}
                  onChange={(e) => handleInputChange('descriptionKey', e.target.value)}
                  placeholder={t('admin.products.form.placeholders.shortDescription')}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">{t('admin.products.form.fields.price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder={t('admin.products.form.placeholders.price')}
                    min="0"
                    step="100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">{t('admin.products.form.fields.rating')}</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                    placeholder={t('admin.products.form.placeholders.rating')}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">{t('admin.products.form.fields.quantity')}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder={t('admin.products.form.placeholders.quantity')}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onCheckedChange={(checked) => handleInputChange('isAvailable', checked)}
                />
                <Label htmlFor="isAvailable">{t('admin.products.form.fields.isAvailable')}</Label>
              </div>

              {/* Asosiy rasm */}
              <div>
                <Label>{t('admin.products.form.fields.mainImage')}</Label>
                <div className="mt-2">
                  {formData.image ? (
                    <div className="relative inline-block">
                      <img
                        src={getImageUrl(formData.image)}
                        alt="Asosiy rasm"
                        className="w-32 h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2"
                        onClick={() => handleInputChange('image', '')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <Label htmlFor="main-image" className="cursor-pointer text-blue-600 hover:text-blue-700">
                        {t('admin.products.form.actions.uploadImage')}
                      </Label>
                      <input
                        id="main-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Label htmlFor="image-url">{t('admin.products.form.fields.imageUrl')}</Label>
                  <Input
                    id="image-url"
                    value={typeof formData.image === 'string' ? formData.image : ''}
                    onChange={e => handleInputChange('image', e.target.value)}
                    placeholder={t('admin.products.form.placeholders.imageUrl')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tavsif */}
        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('admin.products.form.sections.fullDescription')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullDescription">{t('admin.products.form.fields.fullDescription')}</Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                  placeholder={t('admin.products.form.placeholders.fullDescription')}
                  rows={6}
                />
              </div>

              {/* Mahsulot turlari */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>{t('admin.products.form.fields.types')}</Label>
                  <Button type="button" size="sm" onClick={addProductType}>
                    <Plus className="w-4 h-4 mr-1" />
                    {t('admin.products.form.actions.add')}
                  </Button>
                </div>
                {formData.types.map((type, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder={t('admin.products.form.placeholders.typeName')}
                      value={type.name}
                      onChange={(e) => updateProductType(index, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder={t('admin.products.form.placeholders.typePrice')}
                      value={type.price}
                      onChange={(e) => updateProductType(index, 'price', parseFloat(e.target.value))}
                      min="0"
                    />
                    <Button type="button" size="sm" variant="destructive" onClick={() => removeProductType(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Qo'shimcha rasmlar */}
              <div>
                <Label>{t('admin.products.form.fields.additionalImages')}</Label>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <Label htmlFor="additional-images" className="cursor-pointer text-blue-600 hover:text-blue-700">
                      {t('admin.products.form.actions.uploadAdditionalImage')}
                    </Label>
                    <input
                      id="additional-images"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'additionalImages')}
                      className="hidden"
                    />
                  </div>
                </div>
                
                {formData.additionalImages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.additionalImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={getImageUrl(image)}
                          alt={t('admin.products.form.placeholders.additionalImageAlt', { index: index + 1 })}
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-1 -right-1 w-6 h-6 p-0"
                          onClick={() => removeAdditionalImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  value={newAdditionalImage || ''}
                  onChange={e => setNewAdditionalImage(e.target.value)}
                  placeholder={t('admin.products.form.placeholders.additionalImageUrl')}
                />
                <Button type="button" onClick={() => {
                  if (newAdditionalImage) {
                    handleInputChange('additionalImages', [...formData.additionalImages, newAdditionalImage]);
                    setNewAdditionalImage('');
                  }
                }}>{t('admin.products.form.actions.add')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ingredientlar */}
        <TabsContent value="ingredients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5" />
                {t('admin.products.form.sections.ingredients')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('admin.products.form.fields.ingredientsList')}</Label>
                <Button type="button" size="sm" onClick={addIngredient}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t('admin.products.form.actions.add')}
                </Button>
              </div>
              
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={t('admin.products.form.placeholders.ingredientName')}
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder={t('admin.products.form.placeholders.ingredientDescription')}
                    value={ingredient.description || ''}
                    onChange={(e) => updateIngredient(index, 'description', e.target.value)}
                  />
                  <Button type="button" size="sm" variant="destructive" onClick={() => removeIngredient(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tayyorlash */}
        <TabsContent value="preparation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('admin.products.form.sections.preparation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preparationTime">{t('admin.products.form.fields.preparationTime')}</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => handleInputChange('preparationTime', e.target.value)}
                    placeholder={t('admin.products.form.placeholders.preparationTime')}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="calories">{t('admin.products.form.fields.calories')}</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => handleInputChange('calories', e.target.value)}
                    placeholder={t('admin.products.form.placeholders.calories')}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preparationMethod">{t('admin.products.form.fields.preparationMethod')}</Label>
                <Textarea
                  id="preparationMethod"
                  value={formData.preparationMethod}
                  onChange={(e) => handleInputChange('preparationMethod', e.target.value)}
                  placeholder={t('admin.products.form.placeholders.preparationMethod')}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ma'lumot */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                {t('admin.products.form.sections.info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Allergenlar */}
              <div>
                <Label className="mb-2 block">{t('admin.products.form.fields.allergens')}</Label>
                <div className="flex flex-wrap gap-2">
                  {allergenOptions.map((allergen) => (
                    <Badge
                      key={allergen.value}
                      variant={formData.allergens.includes(allergen.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleAllergen(allergen.value)}
                    >
                      {allergen.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Taglar */}
              <div>
                <Label className="mb-2 block">{t('admin.products.form.fields.tags')}</Label>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <Badge
                      key={tag.value}
                      variant={formData.tags.includes(tag.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.value)}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* SEO ma'lumotlari */}
              <div className="border-t pt-4">
                <Label className="text-lg font-semibold mb-4 block">{t('admin.products.form.sections.seo')}</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">{t('admin.products.form.fields.metaTitle')}</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                      placeholder={t('admin.products.form.placeholders.metaTitle')}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="metaDescription">{t('admin.products.form.fields.metaDescription')}</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      placeholder={t('admin.products.form.placeholders.metaDescription')}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('admin.products.form.actions.cancel')}
        </Button>
        <Button type="submit" disabled={loading || uploading}>
          {loading ? t('admin.products.form.actions.saving') : t('admin.products.form.actions.save')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm; 