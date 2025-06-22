import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const ContactMessages = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/contact');
      setContacts(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch messages.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiFetch(`/contact/${id}/read`, { method: 'PUT' });
      toast({ title: "Success", description: "Message marked as read." });
      fetchContacts();
    } catch (error) {
      toast({ title: "Error", description: "Failed to mark as read.", variant: "destructive" });
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text">Contact Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact._id} className={`p-4 rounded-lg ${contact.read ? 'bg-slate-800/50' : 'bg-cyan-500/10 border border-cyan-500/30'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{contact.name}</h3>
                <p className="text-gray-400">{contact.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{new Date(contact.createdAt).toLocaleString()}</p>
                <Badge variant={contact.read ? "secondary" : "default"}>{contact.read ? 'Read' : 'New'}</Badge>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{contact.message}</p>
            {!contact.read && (
              <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(contact._id)}>
                <Eye className="w-4 h-4 mr-1" /> Mark as Read
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}; 