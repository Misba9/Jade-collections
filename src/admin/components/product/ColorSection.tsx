import React from 'react';
import { Trash2 } from 'lucide-react';
import { ColorImageUploader, ColorProductImage } from './ColorImageUploader';

export interface ColorVariant {
  name: string;
  images: ColorProductImage[];
}

interface ColorSectionProps {
  color: ColorVariant;
  index: number;
  onNameChange: (index: number, name: string) => void;
  onImagesChange: (index: number, images: ColorProductImage[]) => void;
  onRemove: (index: number) => void;
  maxImagesPerColor?: number;
  disabled?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export const ColorSection: React.FC<ColorSectionProps> = ({
  color,
  index,
  onNameChange,
  onImagesChange,
  onRemove,
  maxImagesPerColor = 5,
  disabled = false,
  onUploadingChange,
}) => {
  const handleRemove = () => {
    if (!window.confirm(`Remove color "${color.name}" and its images?`)) return;
    onRemove(index);
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <input
          type="text"
          value={color.name}
          onChange={(e) => onNameChange(index, e.target.value)}
          placeholder="Color name (e.g. Red, Blue)"
          disabled={disabled}
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleRemove}
          disabled={disabled}
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors shrink-0"
          title="Remove color"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <ColorImageUploader
        images={color.images}
        onChange={(imgs) => onImagesChange(index, imgs)}
        maxImages={maxImagesPerColor}
        disabled={disabled}
        onUploadingChange={onUploadingChange}
      />
    </div>
  );
};
