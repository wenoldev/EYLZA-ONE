
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';

const AdminStores = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/api/v1/stores?limit=100');
        if (response.data?.data?.stores) {
          setStores(response.data.data.stores);
        }
      } catch (error) {
        console.error('Failed to fetch stores', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Stores Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No stores found.
                  </TableCell>
                </TableRow>
              )}
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.slug}</TableCell>
                  <TableCell className="capitalize">{store.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => navigate(`${store.id}`)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStores;
