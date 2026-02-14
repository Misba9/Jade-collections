import { useEffect, useState } from 'react';
import { adminEndpoints } from '../../lib/api';
import { DataTable } from '../components/DataTable';
import { Button } from '../../components/ui/Button';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export const AdminCustomers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    setLoading(true);
    adminEndpoints
      .users({ page, limit: 20, search: appliedSearch || undefined })
      .then((res) => {
        setUsers(res.data.data || []);
        setPagination(res.data.pagination || { total: 0, pages: 1 });
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [page, appliedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search);
    setPage(1);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (u: User) => (
        <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-jade-100 text-jade-700' : 'bg-stone-100 text-stone-600'}`}>
          {u.role}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (u: User) => new Date(u.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-serif font-semibold text-stone-900">Customers</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500 w-48 sm:w-64"
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u._id}
        isLoading={loading}
        emptyMessage="No customers found"
      />

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-stone-600">
            Page {page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
