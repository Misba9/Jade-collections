import React, { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import { ColorSection, type ColorVariant } from './ColorSection';

export type { ColorVariant };
import { ColorProductImage } from './ColorImageUploader';
import toast from 'react-hot-toast';

interface ColorImageManagerProps {
  colors: ColorVariant[];
  onChange: (colors: ColorVariant[]) => void;
  maxImagesPerColor?: number;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export const ColorImageManager: React.FC<ColorImageManagerProps> = ({
  colors,
  onChange,
  maxImagesPerColor = 5,
  disabled = false,
  onUploadingChange,
}) => {
  const [newColorName, setNewColorName] = useState('');

  const addColor = useCallback(() => {
    const name = newColorName.trim();
    if (!name) {
      toast.error('Enter a color name');
      return;
    }
    if (colors.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Color already exists');
      return;
    }
    onChange([...colors, { name, images: [] }]);
    setNewColorName('');
    toast.success(`Added ${name}`);
  }, [colors, newColorName, onChange]);

  const removeColor = useCallback(
    (index: number) => {
      onChange(colors.filter((_, i) => i !== index));
      toast.success('Color removed');
    },
    [colors, onChange]
  );

  const updateColorName = useCallback(
    (index: number, name: string) => {
      const next = [...colors];
      next[index] = { ...next[index], name };
      onChange(next);
    },
    [colors, onChange]
  );

  const updateColorImages = useCallback(
    (index: number, images: ColorProductImage[]) => {
      const next = [...colors];
      next[index] = { ...next[index], images };
      onChange(next);
    },
    [colors, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label className="block text-sm font-medium text-stone-700">
          Color-wise Images
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            placeholder="e.g. Red, Blue"
            disabled={disabled}
            className="px-3 py-2 text-sm border border-stone-300 rounded-lg w-36 focus:outline-none focus:ring-2 focus:ring-jade-500"
          />
          <button
            type="button"
            onClick={addColor}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-jade-700 bg-jade-50 rounded-lg hover:bg-jade-100 transition-colors border border-jade-200"
          >
            <Plus className="w-4 h-4" /> Add Color
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {colors.map((color, index) => (
          <ColorSection
            key={`${color.name}-${index}`}
            color={color}
            index={index}
            onNameChange={updateColorName}
            onImagesChange={updateColorImages}
            onRemove={removeColor}
            maxImagesPerColor={maxImagesPerColor}
            disabled={disabled}
            onUploadingChange={onUploadingChange}
          />
        ))}
      </div>

      {colors.length === 0 && (
        <p className="text-sm text-stone-500 py-6 text-center border border-dashed border-stone-200 rounded-xl bg-stone-50">
          Add colors above to manage images per color variant.
        </p>
      )}
    </div>
  );
};
