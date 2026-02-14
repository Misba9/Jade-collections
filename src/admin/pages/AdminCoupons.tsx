import { useEffect, useState } from 'react';
import { couponsApi } from '../../lib/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { Button } from '../../components/ui/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  minPurchase: number;
  expiryDate: string;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
}

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    minPurchase: '',
    expiryDate: '',
    usageLimit: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = () => {
    couponsApi
      .list()
      .then((res) => setCoupons(res.data.data || []))
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreate = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountPercentage: '',
      minPurchase: '',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      usageLimit: '',
      isActive: true,
    });
    setModalOpen(true);
    setError('');
  };

  const openEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountPercentage: String(c.discountPercentage),
      minPurchase: String(c.minPurchase || 0),
      expiryDate: new Date(c.expiryDate).toISOString().slice(0, 10),
      usageLimit: c.usageLimit ? String(c.usageLimit) : '',
      isActive: c.isActive,
    });
    setModalOpen(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountPercentage: parseFloat(formData.discountPercentage) || 0,
        minPurchase: parseFloat(formData.minPurchase) || 0,
        expiryDate: formData.expiryDate,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit, 10) : null,
        isActive: formData.isActive,
      };
      if (editingCoupon) {
        await couponsApi.update(editingCoupon._id, payload);
      } else {
        await couponsApi.create(payload);
      }
      setModalOpen(false);
      fetchCoupons();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await couponsApi.delete(id);
      fetchCoupons();
    } catch {
      alert('Failed to delete');
    }
  };

  const columns = [
    { key: 'code', header: 'Code', render: (c: Coupon) => <span className="font-mono font-medium">{c.code}</span> },
    { key: 'discountPercentage', header: 'Discount', render: (c: Coupon) => `${c.discountPercentage}%` },
    { key: 'minPurchase', header: 'Min Purchase', render: (c: Coupon) => `₹${c.minPurchase}` },
    {
      key: 'expiryDate',
      header: 'Expires',
      render: (c: Coupon) => {
        const exp = new Date(c.expiryDate);
        const expired = exp < new Date();
        return <span className={expired ? 'text-red-600' : ''}>{exp.toLocaleDateString()}</span>;
      },
    },
    { key: 'usedCount', header: 'Used' },
    {
      key: 'isActive',
      header: 'Status',
      render: (c: Coupon) => (
        <span className={c.isActive ? 'text-emerald-600' : 'text-stone-400'}>
          {c.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (c: Coupon) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-stone-100 text-stone-600">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-semibold text-stone-900">Coupons</h1>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Coupon
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        keyExtractor={(c) => c._id}
        isLoading={loading}
        emptyMessage="No coupons yet"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Add Coupon'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="coupon-form" isLoading={submitting}>
              {editingCoupon ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="coupon-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <FormField
            label="Code"
            name="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
            placeholder="SUMMER20"
            disabled={!!editingCoupon}
          />
          <FormField
            label="Discount (%)"
            name="discountPercentage"
            type="number"
            value={formData.discountPercentage}
            onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
            required
            min={1}
            max={100}
          />
          <FormField
            label="Minimum Purchase (₹)"
            name="minPurchase"
            type="number"
            value={formData.minPurchase}
            onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
            min={0}
          />
          <FormField
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            required
          />
          <FormField
            label="Usage Limit (optional)"
            name="usageLimit"
            type="number"
            value={formData.usageLimit}
            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
            placeholder="Leave empty for unlimited"
            min={1}
          />
          <FormField
            label="Active"
            name="isActive"
            type="checkbox"
            value={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: (e.target as HTMLInputElement).checked })}
            placeholder="Coupon is valid"
          />
        </form>
      </Modal>
    </div>
  );
};
