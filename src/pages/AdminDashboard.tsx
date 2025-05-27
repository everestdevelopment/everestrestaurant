import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, DollarSign, TrendingUp, LogOut, Eye, CheckCircle, XCircle, Clock, Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'appetizers',
    image: '',
    rating: '4.5'
  });

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth');
    const adminEmail = localStorage.getItem('adminEmail');
    
    if (!adminAuth || adminEmail !== 'mustafoyev7788@gmail.com') {
      navigate('/admin/login');
      return;
    }

    // Load demo data
    loadDemoData();
  }, [navigate]);

  const loadDemoData = () => {
    // Demo orders
    const demoOrders: Order[] = [
      {
        id: '001',
        customerName: 'Aziz Karimov',
        email: 'aziz@example.com',
        address: 'Tashkent, Yunusobod tumani, 123-uy',
        items: [
          { name: 'Osh', quantity: 2, price: 25000 },
          { name: 'Manti', quantity: 1, price: 15000 }
        ],
        total: 65000,
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '002',
        customerName: 'Malika Abdullayeva',
        email: 'malika@example.com',
        address: 'Samarkand, Registon ko\'chasi, 45-uy',
        items: [
          { name: 'Lagman', quantity: 1, price: 20000 },
          { name: 'Somsa', quantity: 3, price: 8000 }
        ],
        total: 44000,
        status: 'confirmed',
        createdAt: '2024-01-15T09:15:00Z'
      },
      {
        id: '003',
        customerName: 'Bobur Rahimov',
        email: 'bobur@example.com',
        address: 'Bukhara, Navoi ko\'chasi, 78-uy',
        items: [
          { name: 'Shashlik', quantity: 2, price: 30000 }
        ],
        total: 60000,
        status: 'preparing',
        createdAt: '2024-01-15T08:45:00Z'
      }
    ];

    // Demo products
    const demoProducts: Product[] = [
      {
        id: 1,
        name: "Truffle Arancini",
        description: "Crispy risotto balls with black truffle and parmesan",
        price: 24,
        category: 'appetizers',
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
        rating: 4.8
      },
      // Add more demo products
    ];

    // Demo contact messages
    const demoMessages: ContactMessage[] = [
      {
        id: '1',
        name: 'Aziz Karimov',
        email: 'aziz@example.com',
        message: 'Great food and service! Would love to make a reservation for next week.',
        createdAt: '2024-01-15T10:30:00Z',
        read: false
      },
      {
        id: '2',
        name: 'Malika Abdullayeva',
        email: 'malika@example.com',
        message: 'Do you have vegetarian options? I have dietary restrictions.',
        createdAt: '2024-01-14T15:20:00Z',
        read: true
      }
    ];
    
    setOrders(demoOrders);
    setProducts(demoProducts);
    setContactMessages(demoMessages);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin/login');
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Order updated",
      description: `Order #${orderId} status changed to ${newStatus}`,
    });
  };

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      image: productForm.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
      rating: parseFloat(productForm.rating)
    };

    setProducts([...products, newProduct]);
    setProductForm({ name: '', description: '', price: '', category: 'appetizers', image: '', rating: '4.5' });
    setShowProductForm(false);
    
    toast({
      title: "Product added",
      description: "New product has been added successfully",
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProducts(products.map(product => 
      product.id === editingProduct.id ? editingProduct : product
    ));
    setEditingProduct(null);
    
    toast({
      title: "Product updated",
      description: "Product has been updated successfully",
    });
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId));
    toast({
      title: "Product deleted",
      description: "Product has been deleted successfully",
    });
  };

  const markMessageAsRead = (messageId: string) => {
    setContactMessages(contactMessages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Kutilmoqda', color: 'bg-yellow-500' },
      confirmed: { label: 'Tasdiqlangan', color: 'bg-blue-500' },
      preparing: { label: 'Tayyorlanmoqda', color: 'bg-orange-500' },
      delivered: { label: 'Yetkazilgan', color: 'bg-green-500' },
      cancelled: { label: 'Bekor qilingan', color: 'bg-red-500' }
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white">Admin Panel</h1>
              <p className="text-sm text-gray-400">Restaurant Management</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-gray-300 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
            className="neon-glow"
          >
            <Package className="w-4 h-4 mr-2" />
            Orders
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className="neon-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Products
          </Button>
          <Button
            variant={activeTab === 'messages' ? 'default' : 'outline'}
            onClick={() => setActiveTab('messages')}
            className="neon-glow"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Jami buyurtmalar</p>
                    <p className="text-2xl font-bold text-white">{orders.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Bajarilgan</p>
                    <p className="text-2xl font-bold text-white">{completedOrders}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Jami daromad</p>
                    <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString()} so'm</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">O'rtacha buyurtma</p>
                    <p className="text-2xl font-bold text-white">
                      {orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString() : 0} so'm
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="glass-card">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-display font-bold text-white">Orders List</h2>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">ID</TableHead>
                      <TableHead className="text-gray-300">Mijoz</TableHead>
                      <TableHead className="text-gray-300">Manzil</TableHead>
                      <TableHead className="text-gray-300">Jami</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Vaqt</TableHead>
                      <TableHead className="text-gray-300">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-white/10">
                        <TableCell className="text-white font-mono">#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{order.customerName}</p>
                            <p className="text-gray-400 text-sm">{order.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          {order.address}
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {order.total.toLocaleString()} so'm
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedOrder(order)}
                              className="text-gray-300 hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            {order.status === 'pending' && (
                              <Button 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                Tasdiqlash
                              </Button>
                            )}
                            
                            {order.status === 'confirmed' && (
                              <Button 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                              >
                                Tayyorlash
                              </Button>
                            )}
                            
                            {order.status === 'preparing' && (
                              <Button 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Yetkazildi
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-white">Product Management</h2>
              <Button
                onClick={() => setShowProductForm(true)}
                className="bg-gradient-to-r from-green-400 to-green-500 text-slate-900 hover:from-green-500 hover:to-green-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="glass-card p-6">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                  <p className="text-yellow-400 font-bold mb-4">${product.price}</p>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="glass-card">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-display font-bold text-white">Contact Messages</h2>
            </div>
            
            <div className="divide-y divide-white/10">
              {contactMessages.map((message) => (
                <div key={message.id} className={`p-6 ${!message.read ? 'bg-yellow-400/5' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                    <div className="flex items-center space-x-2">
                      {!message.read && (
                        <Badge className="bg-yellow-500 text-black">New</Badge>
                      )}
                      <span className="text-gray-400 text-sm">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-2">{message.email}</p>
                  <p className="text-gray-300 mb-4">{message.message}</p>
                  
                  {!message.read && (
                    <Button
                      size="sm"
                      onClick={() => markMessageAsRead(message.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {(showProductForm || editingProduct) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-display font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <Input
                placeholder="Product Name"
                value={editingProduct ? editingProduct.name : productForm.name}
                onChange={(e) => editingProduct 
                  ? setEditingProduct({...editingProduct, name: e.target.value})
                  : setProductForm({...productForm, name: e.target.value})
                }
                className="bg-white/5 border-white/10 text-white"
              />
              
              <Textarea
                placeholder="Description"
                value={editingProduct ? editingProduct.description : productForm.description}
                onChange={(e) => editingProduct 
                  ? setEditingProduct({...editingProduct, description: e.target.value})
                  : setProductForm({...productForm, description: e.target.value})
                }
                className="bg-white/5 border-white/10 text-white"
              />
              
              <Input
                type="number"
                placeholder="Price"
                value={editingProduct ? editingProduct.price : productForm.price}
                onChange={(e) => editingProduct 
                  ? setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})
                  : setProductForm({...productForm, price: e.target.value})
                }
                className="bg-white/5 border-white/10 text-white"
              />
              
              <Input
                placeholder="Image URL"
                value={editingProduct ? editingProduct.image : productForm.image}
                onChange={(e) => editingProduct 
                  ? setEditingProduct({...editingProduct, image: e.target.value})
                  : setProductForm({...productForm, image: e.target.value})
                }
                className="bg-white/5 border-white/10 text-white"
              />
              
              <div className="flex space-x-4">
                <Button
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-bold text-white">
                  Buyurtma tafsilotlari #{selectedOrder.id}
                </h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Mijoz ma'lumotlari</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300"><span className="text-gray-400">Ism:</span> {selectedOrder.customerName}</p>
                    <p className="text-gray-300"><span className="text-gray-400">Email:</span> {selectedOrder.email}</p>
                    <p className="text-gray-300"><span className="text-gray-400">Manzil:</span> {selectedOrder.address}</p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Status:</span> {getStatusBadge(selectedOrder.status)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Buyurtma ma'lumotlari</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Vaqt:</span> {new Date(selectedOrder.createdAt).toLocaleString('uz-UZ')}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Jami:</span> {selectedOrder.total.toLocaleString()} so'm
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Buyurtma tarkibi</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                      <div>
                        <span className="text-white">{item.name}</span>
                        <span className="text-gray-400 ml-2">× {item.quantity}</span>
                      </div>
                      <span className="text-white font-medium">
                        {(item.price * item.quantity).toLocaleString()} so'm
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
