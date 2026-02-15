import { useEffect, useState, useCallback } from 'react';
import { productsApi, categoriesApi } from '../../lib/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';
import { ColorImageManager, ColorVariant } from '../components/product/ColorImageManager';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  isDeleted?: boolean;
  category?: { _id: string; name: string };
  sizes?: string[];
  colors?: ColorVariant[] | string[];
  description?: string;
  isFeatured?: boolean;
}

interface Category {
  _id: string;
  name: string;
}

const normalizeColors = (colors: ColorVariant[] | string[] | undefined): ColorVariant[] => {
  if (!colors?.length) return [];
  return colors.map((c) =>
    typeof c === 'string'
      ? { name: c, images: [] }
      : { name: c.name || '', images: c.images || [] }
  );
};

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: '',
    sizes: '',
    isActive: true,
    isFeatured: false,
  });
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    productsApi
      .listAdmin({ limit: 200, isActive: 'all' })
      .then((res) => {
        const data = res.data.data || [];
        setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const fetchActiveCategories = useCallback(() => {
    categoriesApi
      .list({ isActive: true })
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchActiveCategories();
  }, [fetchProducts, fetchActiveCategories]);

  useEffect(() => {
    if (modalOpen) fetchActiveCategories();
  }, [modalOpen, fetchActiveCategories]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      discountPrice: '',
      stock: '',
      sizes: '',
      isActive: true,
      isFeatured: false,
    });
    setColorVariants([]);
    setModalOpen(true);
    setError('');
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      description: p.description || '',
      category: p.category?._id || '',
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : '',
      stock: String(p.stock),
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : '',
      isActive: p.isActive,
      isFeatured: p.isFeatured ?? false,
    });
    setColorVariants(normalizeColors(p.colors));
    setModalOpen(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category || undefined,
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
        stock: parseInt(formData.stock, 10) || 0,
        sizes: formData.sizes ? formData.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
        colors: colorVariants,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct._id, payload);
      } else {
        await productsApi.create(payload);
      }
      setModalOpen(false);
      fetchProducts();
      toast.success(editingProduct ? 'Product updated' : 'Product created');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const errMsg = axiosErr?.response?.data?.error || 'Failed to save';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (p: Product) => {
    setProductToDelete(p);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await productsApi.delete(productToDelete._id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
      toast.success('Product deleted');
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setDeleteError(res?.error || 'Failed to delete');
      toast.error(res?.error || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (p: Product) => {
    setTogglingId(p._id);
    try {
      await productsApi.update(p._id, { isActive: !p.isActive } as Record<string, unknown>);
      fetchProducts();
      toast.success(p.isActive ? 'Product deactivated' : 'Product activated');
    } catch {
      toast.error('Failed to toggle');
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    { key: 'title', header: 'Product' },
    {
      key: 'category',
      header: 'Category',
      render: (p: Product) => (
        <span className="text-stone-600">{p.category?.name ?? '-'}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (p: Product) => (
        <span>
          ₹{p.price}
          {p.discountPrice && <span className="text-stone-500 ml-1">(₹{p.discountPrice})</span>}
        </span>
      ),
    },
    { key: 'stock', header: 'Stock' },
    {
      key: 'isActive',
      header: 'Status',
      render: (p: Product) => (
        <button
          type="button"
          onClick={() => handleToggleActive(p)}
          disabled={togglingId === p._id || p.isDeleted}
          className={`relative inline-flex h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-jade-500 focus:ring-offset-2 ${
            p.isActive ? 'bg-emerald-500' : 'bg-stone-300'
          } ${p.isDeleted ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={p.isActive ? 'Deactivate' : 'Activate'}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              p.isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Product) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(p)}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => openDeleteConfirm(p)}
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-serif font-semibold text-stone-900">Products</h1>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(p) => p._id}
          isLoading={loading}
          emptyMessage="No products yet"
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="product-form"
              isLoading={submitting}
              disabled={uploading}
            >
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div>
            <FormField
              label="Category"
              name="category"
              type="select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
            />
            {categories.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                Create a category first in the Categories page.
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              min={0}
            />
            <FormField
              label="Discount Price (₹)"
              name="discountPrice"
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              min={0}
            />
          </div>
          <FormField
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
            min={0}
          />
          <FormField
            label="Sizes (comma-separated)"
            name="sizes"
            value={formData.sizes}
            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
            placeholder="S, M, L"
          />

          <div className="border-t border-stone-200 pt-6">
            <ColorImageManager
              colors={colorVariants}
              onChange={setColorVariants}
              maxImagesPerColor={5}
              onUploadingChange={setUploading}
            />
          </div>

          <div className="border-t border-stone-200 pt-6 flex gap-6">
            <FormField
              label="Active"
              name="isActive"
              type="checkbox"
              value={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: (e.target as HTMLInputElement).checked })
              }
              placeholder="Product is visible in store"
            />
            <FormField
              label="Featured"
              name="isFeatured"
              type="checkbox"
              value={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: (e.target as HTMLInputElement).checked })
              }
              placeholder="Show on homepage"
            />
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
          setDeleteError('');
        }}
        onConfirm={handleDelete}
        title="Delete Product"
        message={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.title}"? This cannot be undone.`
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
