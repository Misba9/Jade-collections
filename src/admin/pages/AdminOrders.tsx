import { useEffect, useState } from 'react';
import { ordersApi } from '../../lib/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { Button } from '../../components/ui/Button';

interface Order {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  user?: { name: string; email: string };
  shippingAddress?: { street: string; city: string; state?: string; zip?: string; country: string };
  orderItems?: Array<{ product?: { title: string }; quantity: number; price: number }>;
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    ordersApi
      .list({ orderStatus: statusFilter || undefined, limit: 50 })
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      await ordersApi.updateStatus(selectedOrder._id, newStatus);
      setModalOpen(false);
      fetchOrders();
    } catch {
      alert('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'order',
      header: 'Order',
      render: (o: Order) => (
        <div>
          <p className="font-medium">{o.user?.name || 'Guest'}</p>
          <p className="text-xs text-stone-500">{o.user?.email}</p>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (o: Order) => `₹${o.totalAmount.toLocaleString()}`,
    },
    {
      key: 'orderStatus',
      header: 'Status',
      render: (o: Order) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            o.orderStatus === 'delivered'
              ? 'bg-emerald-100 text-emerald-700'
              : o.orderStatus === 'cancelled'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {o.orderStatus}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (o: Order) => (
        <span className={o.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-stone-500'}>
          {o.paymentStatus}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (o: Order) => new Date(o.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      render: (o: Order) => (
        <Button size="sm" variant="outline" onClick={() => openStatusModal(o)}>
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-serif font-semibold text-stone-900">Orders</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500 w-full sm:w-48"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        keyExtractor={(o) => o._id}
        isLoading={loading}
        emptyMessage="No orders found"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Update Order Status"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} isLoading={submitting}>
              Update
            </Button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p className="text-sm text-stone-600">
              Order #{selectedOrder._id.slice(-8)} • ₹{selectedOrder.totalAmount.toLocaleString()}
            </p>
            <FormField
              label="Status"
              name="orderStatus"
              type="select"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
