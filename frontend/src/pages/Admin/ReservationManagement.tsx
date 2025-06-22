import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

const getStatusStyles = (status: Reservation['status']) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Pending':
    default:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }
};

const getStatusIcon = (status: Reservation['status']) => {
  switch (status) {
    case 'Confirmed':
      return <CheckCircle className="mr-2 h-4 w-4" />;
    case 'Cancelled':
      return <XCircle className="mr-2 h-4 w-4" />;
    case 'Pending':
    default:
      return <Clock className="mr-2 h-4 w-4" />;
  }
};

export const ReservationManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const data = await apiFetch('/reservations');
      setReservations(data);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to fetch reservations.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: string, status: Reservation['status']) => {
    try {
      await apiFetch(`/reservations/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      toast({ title: "Success", description: "Reservation status updated." });
      fetchReservations(); // Refresh the list
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>Loading reservations...</div>;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="gradient-text">Reservation Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((res) => (
              <TableRow key={res._id}>
                <TableCell>
                  <div className="font-medium">{res.name}</div>
                  <div className="text-sm text-gray-400">{res.email}</div>
                  <div className="text-sm text-gray-400">{res.phone}</div>
                </TableCell>
                <TableCell>
                  <div>{res.guests} Guests</div>
                </TableCell>
                <TableCell>
                  <div>{new Date(res.date).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-400">{res.time}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusStyles(res.status)}>
                    {getStatusIcon(res.status)}
                    {res.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select value={res.status} onValueChange={(value) => handleStatusChange(res._id, value as Reservation['status'])}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
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