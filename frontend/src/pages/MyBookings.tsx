import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Interfaces
interface Order {
  _id: string;
  orderItems: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

interface Reservation {
  _id: string;
  date: string;
  time: string;
  guests: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

const MyBookings = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, reservationsData] = await Promise.all([
        apiFetch('/orders/myorders'),
        apiFetch('/reservations/myreservations'),
      ]);
      setOrders(ordersData || []);
      setReservations(reservationsData || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch your bookings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelOrder = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await apiFetch(`/orders/${id}/cancel`, { method: 'PUT' });
      toast({ title: "Success", description: "Order has been cancelled." });
      fetchData(); // Refresh data
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to cancel order.", variant: "destructive" });
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await apiFetch(`/reservations/${id}/cancel`, { method: 'PUT' });
      toast({ title: "Success", description: "Reservation has been cancelled." });
      fetchData(); // Refresh data
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to cancel reservation.", variant: "destructive" });
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-slate-900 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">My Bookings</h1>
        <p className="text-xl text-gray-400">View and manage your orders and reservations.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="reservations">My Reservations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="mt-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Your Orders</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {loading ? <p>Loading orders...</p> : orders.length > 0 ? orders.map(order => (
                  <div key={order._id} className="p-4 bg-slate-800/50 rounded-lg flex justify-between items-center">
                    <div>
                      <p><strong>Order ID:</strong> #{order._id.substring(0, 7)}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                      <Badge>{order.status}</Badge>
                    </div>
                    {order.status === 'Pending' && (
                      <Button variant="destructive" onClick={() => handleCancelOrder(order._id)}>Cancel Order</Button>
                    )}
                  </div>
                )) : <p>You have no orders.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="mt-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Your Reservations</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {loading ? <p>Loading reservations...</p> : reservations.length > 0 ? reservations.map(res => (
                  <div key={res._id} className="p-4 bg-slate-800/50 rounded-lg flex justify-between items-center">
                    <div>
                      <p><strong>Date:</strong> {new Date(res.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {res.time}</p>
                      <p><strong>Guests:</strong> {res.guests}</p>
                      <Badge>{res.status}</Badge>
                    </div>
                    {res.status !== 'Cancelled' && (
                       <Button variant="destructive" onClick={() => handleCancelReservation(res._id)}>Cancel Reservation</Button>
                    )}
                  </div>
                )) : <p>You have no reservations.</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default MyBookings; 