import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';
import { toast } from 'sonner';
import Loader from '@/components/common/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]); // Assuming we have an API to list users
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // Assuming /api/v1/users lists all users for admin
      const response = await api.get('/api/v1/users');
      if (response.data?.data?.users) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId: string, action: 'ban' | 'unban' | 'reset_password' | 'delete') => {
    try {
      let method = 'patch';
      let data: any = { action };

      if (action === 'delete') {
        method = 'delete';
        data = undefined;
      } else if (action === 'ban') {
        data.ban_duration = 3153600000; // 100 years in seconds (approx)
      }

      const response = await (api as any)[method](`/api/v1/admin/users/${userId}`, data, {
      });

      if (response.status === 200 || response.status === 204) {
        toast.success(`Action ${action} successful`);
        fetchUsers();
      } else {
        toast.error(`Error: ${response.data.error?.message}`);
      }
    } catch (error: any) {
      console.error('Failed to perform action', error);
      toast.error(`Error: ${error.response?.data?.error?.message || error.message}`);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">User Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.status === 'banned' ? 'Banned' : 
                     user.status === 'inactive' ? 'Inactive' : 'Active'}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleAction(user.id, 'reset_password')}>
                      Reset Password
                    </Button>
                    {user.status === 'banned' ? (
                      <Button variant="outline" size="sm" onClick={() => handleAction(user.id, 'unban')}>
                        Unban
                      </Button>
                    ) : (
                      <Button variant="destructive" size="sm" onClick={() => handleAction(user.id, 'ban')}>
                        Ban
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                          handleAction(user.id, 'delete');
                        }
                      }}
                    >
                      Delete
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

export default AdminUsers;
