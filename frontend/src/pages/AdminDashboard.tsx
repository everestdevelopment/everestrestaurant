import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, ShoppingBag, Users, MessageSquare, Utensils, Calendar } from "lucide-react";
import { Overview } from "./Admin/Overview";
import { ProductManagement } from "./Admin/ProductManagement";
import { OrderManagement } from "./Admin/OrderManagement";
import { ContactMessages } from "./Admin/ContactMessages";
import { ReservationManagement } from "./Admin/ReservationManagement";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-950/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-slate-800 sticky top-0 z-50">
        <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
        <a href="/" className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors">
          <Home className="mr-2 h-5 w-5" />
          <span>Home</span>
        </a>
      </header>

      <main className="p-4 md:p-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="overview"><Users className="mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="products"><Utensils className="mr-2" /> Products</TabsTrigger>
            <TabsTrigger value="orders"><ShoppingBag className="mr-2" /> Orders</TabsTrigger>
            <TabsTrigger value="reservations"><Calendar className="mr-2" /> Reservations</TabsTrigger>
            <TabsTrigger value="messages"><MessageSquare className="mr-2" /> Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Overview />
          </TabsContent>
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
          <TabsContent value="reservations">
            <ReservationManagement />
          </TabsContent>
          <TabsContent value="messages">
            <ContactMessages />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
