import { useEffect, useState } from 'react';
import { categoriesApi } from '../../lib/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
}

export const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    categoriesApi
      .list({ isActive: 'all' })
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '', isActive: true });
    setModalOpen(true);
    setError('');
  };

  const openEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({ name: c.name, image: c.image || '', isActive: c.isActive });
    setModalOpen(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory._id, {
          name: formData.name.trim(),
          image: formData.image?.trim() || undefined,
          isActive: formData.isActive,
        });
      } else {
        await categoriesApi.create({
          name: formData.name.trim(),
          image: formData.image?.trim() || undefined,
          isActive: formData.isActive,
        });
      }
      setModalOpen(false);
      fetchCategories();
      toast.success(editingCategory ? 'Category updated' : 'Category created');
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setError(res?.error || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (c: Category) => {
    setCategoryToDelete(c);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await categoriesApi.delete(categoryToDelete._id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
      toast.success('Category deleted');
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setDeleteError(res?.error || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (c: Category) => <span className="font-medium">{c.name}</span> },
    { key: 'slug', header: 'Slug', render: (c: Category) => <span className="text-stone-500 font-mono text-sm">{c.slug}</span> },
    {
      key: 'isActive',
      header: 'Status',
      render: (c: Category) => (
        <span className={c.isActive ? 'text-emerald-600' : 'text-stone-400'}>
          {c.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (c: Category) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(c)}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => openDeleteConfirm(c)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-semibold text-stone-900">Categories</h1>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(c) => c._id}
        isLoading={loading}
        emptyMessage="No categories yet"
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="category-form" isLoading={submitting}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
          <FormField
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g. Ladies Suits"
          />
          <FormField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />
          <FormField
            label="Active"
            name="isActive"
            type="checkbox"
            value={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: (e.target as HTMLInputElement).checked })}
            placeholder="Category is visible in product dropdown"
          />
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setCategoryToDelete(null); setDeleteError(''); }}
        onConfirm={handleDelete}
        title="Delete Category"
        message={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleting}
        error={deleteError}
      />
    </div>
  );
};
