import { useEffect, useState } from 'react';
import { bannersApi } from '../../lib/api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { FormField } from '../components/FormField';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';

interface Banner {
  _id: string;
  title?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
  autoRotate: boolean;
  createdAt?: string;
}

export const AdminBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    isActive: true,
    order: 0,
    autoRotate: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const fetchBanners = () => {
    setLoading(true);
    bannersApi
      .list({ isActive: 'all' })
      .then((res) => setBanners(res.data.data || []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      image: '',
      link: '',
      isActive: true,
      order: 0,
      autoRotate: true,
    });
    setImageFile(null);
    setModalOpen(true);
    setError('');
  };

  const openEdit = (b: Banner) => {
    setEditingBanner(b);
    setFormData({
      title: b.title || '',
      image: b.image,
      link: b.link || '',
      isActive: b.isActive,
      order: b.order ?? 0,
      autoRotate: b.autoRotate ?? true,
    });
    setImageFile(null);
    setModalOpen(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        fd.append('title', formData.title);
        fd.append('link', formData.link);
        fd.append('isActive', String(formData.isActive));
        fd.append('order', String(formData.order));
        fd.append('autoRotate', String(formData.autoRotate));
        if (editingBanner) {
          await bannersApi.update(editingBanner._id, fd);
        } else {
          await bannersApi.create(fd);
        }
      } else {
        const payload = {
          title: formData.title || undefined,
          image: formData.image || undefined,
          link: formData.link || undefined,
          isActive: formData.isActive,
          order: formData.order,
          autoRotate: formData.autoRotate,
        };
        if (editingBanner) {
          await bannersApi.update(editingBanner._id, payload);
        } else {
          if (!formData.image?.trim()) {
            setError('Image URL or file upload is required');
            setSubmitting(false);
            return;
          }
          await bannersApi.create(payload);
        }
      }
      setModalOpen(false);
      fetchBanners();
      toast.success(editingBanner ? 'Banner updated' : 'Banner created');
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setError(res?.error || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (b: Banner) => {
    setBannerToDelete(b);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await bannersApi.delete(bannerToDelete._id);
      setDeleteModalOpen(false);
      setBannerToDelete(null);
      fetchBanners();
      toast.success('Banner deleted');
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { error?: string } } })?.response?.data;
      setDeleteError(res?.error || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'image',
      header: 'Preview',
      render: (b: Banner) => (
        <div className="w-16 h-10 rounded overflow-hidden bg-stone-100">
          <img
            src={b.image}
            alt={b.title || 'Banner'}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (b: Banner) => (
        <span className="font-medium">{b.title || '(No title)'}</span>
      ),
    },
    {
      key: 'link',
      header: 'Link',
      render: (b: Banner) => (
        <span className="text-stone-500 text-sm truncate max-w-[120px] block">
          {b.link || '-'}
        </span>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      render: (b: Banner) => <span className="text-stone-600">{b.order ?? 0}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (b: Banner) => (
        <span className={b.isActive ? 'text-emerald-600' : 'text-stone-400'}>
          {b.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (b: Banner) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(b)}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => openDeleteConfirm(b)}
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
        <h1 className="text-2xl font-serif font-semibold text-stone-900">Banners</h1>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={banners}
        keyExtractor={(b) => b._id}
        isLoading={loading}
        emptyMessage="No banners yet. Add banners to display on the homepage hero."
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBanner ? 'Edit Banner' : 'Add Banner'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="banner-form" isLoading={submitting}>
              {editingBanner ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form id="banner-form" onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Banner title (optional)"
          />
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500"
                  disabled={!!imageFile}
                />
                <p className="text-xs text-stone-500 mt-1">Or upload a file below</p>
              </div>
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center hover:border-jade-500 transition-colors">
                  {imageFile ? (
                    <span className="text-xs text-jade-600 truncate px-2">
                      {imageFile.name}
                    </span>
                  ) : formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-stone-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    setImageFile(f || null);
                    if (f) setFormData((prev) => ({ ...prev, image: '' }));
                  }}
                />
                <span className="text-xs text-stone-500">Upload</span>
              </label>
            </div>
          </div>
          <FormField
            label="Link URL"
            name="link"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://..."
          />
          <FormField
            label="Display Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
            }
            min={0}
          />
          <FormField
            label="Active"
            name="isActive"
            type="checkbox"
            value={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: (e.target as HTMLInputElement).checked })
            }
            placeholder="Banner is visible on homepage"
          />
          <FormField
            label="Auto Rotate"
            name="autoRotate"
            type="checkbox"
            value={formData.autoRotate}
            onChange={(e) =>
              setFormData({ ...formData, autoRotate: (e.target as HTMLInputElement).checked })
            }
            placeholder="Include in hero slider rotation"
          />
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBannerToDelete(null);
          setDeleteError('');
        }}
        onConfirm={handleDelete}
        title="Delete Banner"
        message={
          bannerToDelete
            ? `Are you sure you want to delete this banner?`
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
