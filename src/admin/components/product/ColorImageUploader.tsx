import React, { useCallback, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Upload, Loader2 } from 'lucide-react';
import { productsApi } from '../../../lib/api';
import toast from 'react-hot-toast';

export interface ColorProductImage {
  url: string;
  public_id?: string;
}

interface ColorImageUploaderProps {
  images: ColorProductImage[];
  onChange: (images: ColorProductImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

interface SortableImageProps {
  image: ColorProductImage;
  onDelete: () => void;
  disabled?: boolean;
}

const SortableImage: React.FC<SortableImageProps> = ({ image, onDelete, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.public_id || image.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shadow-sm aspect-square ${
        isDragging ? 'z-50 opacity-90 shadow-lg' : ''
      }`}
    >
      <img
        src={image.url}
        alt="Product"
        className="w-full h-full object-cover"
      />
      {!disabled && (
        <>
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 left-2 p-1.5 rounded-md bg-white/90 shadow cursor-grab active:cursor-grabbing hover:bg-white transition-colors"
          >
            <GripVertical className="w-4 h-4 text-stone-600" />
          </div>
          <button
            type="button"
            onClick={onDelete}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-red-500/90 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

export const ColorImageUploader: React.FC<ColorImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 5,
  disabled = false,
  onUploadingChange,
}) => {
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = images.findIndex(
          (img) => (img.public_id || img.url) === active.id
        );
        const newIndex = images.findIndex(
          (img) => (img.public_id || img.url) === over.id
        );
        if (oldIndex !== -1 && newIndex !== -1) {
          onChange(arrayMove(images, oldIndex, newIndex));
        }
      }
    },
    [images, onChange]
  );

  const handleDelete = useCallback(
    (index: number) => {
      if (!window.confirm('Remove this image?')) return;
      onChange(images.filter((_, i) => i !== index));
    },
    [images, onChange]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length || images.length >= maxImages) return;

      const remaining = maxImages - images.length;
      const toUpload = Array.from(files).slice(0, remaining);

      setUploading(true);
      onUploadingChange?.(true);
      try {
        const res = await productsApi.uploadImages(toUpload);
        const newImages = (res.data.data || []) as ColorProductImage[];
        onChange([...images, ...newImages]);
        toast.success(`${newImages.length} image(s) uploaded`);
      } catch {
        toast.error('Failed to upload images');
      } finally {
        setUploading(false);
        onUploadingChange?.(false);
        e.target.value = '';
      }
    },
    [images, maxImages, onChange, onUploadingChange]
  );

  const canAddMore = images.length < maxImages && !disabled;

  return (
    <div className="space-y-3">
      {canAddMore && (
        <label className="inline-block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-jade-700 bg-jade-50 rounded-lg hover:bg-jade-100 transition-colors border border-jade-200">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Images ({images.length}/{maxImages})
              </>
            )}
          </span>
        </label>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.public_id || img.url)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {images.map((image, index) => (
              <SortableImage
                key={image.public_id || image.url}
                image={image}
                onDelete={() => handleDelete(index)}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
