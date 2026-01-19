
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import Loader from '@/components/common/Loader';

const AdminStoreDetails = () => {
  const { id } = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await api.get(`/api/v1/admin/stores/${id}`);
        if (response.data?.data?.store) {
          setStore(response.data.data.store);
        }
      } catch (error) {
        console.error('Failed to fetch store details', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStoreDetails();
  }, [id]);

  if (loading) return <Loader />;
  if (!store) return <div className="flex items-center justify-center h-[400px] text-muted-foreground">Store not found</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">{store.name} Details</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: store.currency || 'USD' }).format(store.stats?.revenue || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.stats?.products || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.stats?.users || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.stats?.orders || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Slug</dt>
              <dd className="mt-1 text-sm text-gray-900">{store.slug}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{store.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{store.contact_email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{store.country}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStoreDetails;
