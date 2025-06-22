import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from 'lucide-react';

// Interfaces
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

const initialProductForm = { name: '', description: '', price: '', category: 'main-courses', image: '', rating: '4.5' };

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(initialProductForm);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/products');
      setProducts(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch products.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductForm({ ...productForm, [e.target.id]: e.target.value });
  };
  
  const handleSelectChange = (value: string) => {
    setProductForm({ ...productForm, category: value });
  };
  
  const resetForm = () => {
    setProductForm(initialProductForm);
    setEditingProduct(null);
    setShowProductForm(false);
  };
  
  const handleAddProduct = async () => {
    try {
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({ ...productForm, price: parseFloat(productForm.price), rating: parseFloat(productForm.rating) }),
      });
      toast({ title: "Success", description: "Product added successfully." });
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to add product.", variant: "destructive" });
    }
  };
  
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      image: product.image,
      rating: String(product.rating),
    });
    setShowProductForm(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await apiFetch(`/products/${editingProduct._id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...productForm, price: parseFloat(productForm.price), rating: parseFloat(productForm.rating) }),
      });
      toast({ title: "Success", description: "Product updated successfully." });
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update product.", variant: "destructive" });
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      toast({ title: "Success", description: "Product deleted." });
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete product.", variant: "destructive" });
    }
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold gradient-text">Manage Products</h2>
        <Button onClick={() => setShowProductForm(true)}><Plus className="w-4 h-4 mr-2" />Add Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="glass-card">
            <CardContent className="p-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-cyan-400">${product.price}</span>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product._id)}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showProductForm || !!editingProduct} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="gradient-text">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" value={productForm.name} onChange={handleFormChange}/></div>
            <div className="grid gap-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={productForm.description} onChange={handleFormChange} /></div>
            <div className="grid gap-2"><Label htmlFor="price">Price</Label><Input id="price" type="number" value={productForm.price} onChange={handleFormChange} /></div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={productForm.category} onValueChange={handleSelectChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizers">Appetizers</SelectItem>
                  <SelectItem value="main-courses">Main Courses</SelectItem>
                  <SelectItem value="desserts">Desserts</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label htmlFor="image">Image URL</Label><Input id="image" value={productForm.image} onChange={handleFormChange}/></div>
            <div className="grid gap-2"><Label htmlFor="rating">Rating</Label><Input id="rating" type="number" value={productForm.rating} onChange={handleFormChange} /></div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct}>{editingProduct ? 'Update' : 'Add'} Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 