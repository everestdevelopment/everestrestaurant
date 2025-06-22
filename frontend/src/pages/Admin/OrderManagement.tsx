import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Truck, ShoppingBag } from 'lucide-react';

// Interfaces
interface Order {
  _id: string;
  user: { name: string; email: string; };
  orderItems: { product: { name: string }, name: string, quantity: number }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

const getStatusStyles = (status: Order['status']) => {
  switch (status) {
    case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Processing': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Pending': default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'Delivered': return <CheckCircle className="mr-2 h-4 w-4" />;
    case 'Shipped': return <Truck className="mr-2 h-4 w-4" />;
    case 'Processing': return <ShoppingBag className="mr-2 h-4 w-4" />;
    case 'Cancelled': return <XCircle className="mr-2 h-4 w-4" />;
    case 'Pending': default: return <Clock className="mr-2 h-4 w-4" />;
  }
};

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/orders');
      setOrders(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch orders.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      await apiFetch(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      toast({ title: "Success", description: "Order status updated." });
      fetchOrders();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
    }
  };
  
  if (loading) return <div>Loading orders...</div>;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text">Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <div className="font-medium">{order.user?.name || 'N/A'}</div>
                  <div className="text-sm text-gray-400">{order.user?.email || 'N/A'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.orderItems.map((item, index) => (
                      <div key={index}>{item.quantity}x {item.name}</div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusStyles(order.status)}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order._id, value as Order['status'])}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 