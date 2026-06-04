import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

interface UploadCategory {
  title: string;
  subtitle: string;
  items: CategoryItem[];
}

interface ImagingUploadGridProps {
  uploadCategories: UploadCategory[];
  loadingCards: Record<string, boolean>;
  uploadedImages: Record<string, boolean>;
  imagePreviewUrls: Record<string, string>;
  onImageUpload: (id: string) => void;
  onRemoveImage: (id: string, e: React.MouseEvent) => void;
}

interface UploadCardProps {
  item: CategoryItem;
  isLoading: boolean;
  isUploaded: boolean;
  previewUrl?: string;
  onUpload: (id: string) => void;
  onRemove: (id: string, e: React.MouseEvent) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({
  item,
  isLoading,
  isUploaded,
  previewUrl,
  onUpload,
  onRemove,
}) => {
  const cardClassName = `group cursor-pointer transition-all duration-200 hover:shadow-lg border rounded-xl ${isLoading
    ? "border-blue-300 bg-blue-50 shadow-md animate-pulse"
    : isUploaded
      ? "border-emerald-300 bg-emerald-50 shadow-md"
      : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
    }`;

  const imageContainerClassName = `w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 ${isLoading
    ? "bg-blue-100 border border-blue-200"
    : isUploaded
      ? "bg-emerald-100 border border-emerald-200"
      : "bg-transparent"
    }`;

  return (
    <Card
      className={cardClassName}
      onClick={() => !isLoading && onUpload(item.id)}
    >
      <CardContent className="p-5 text-center relative">
        {/* Status Indicator & Remove Button */}
        {isUploaded && (
          <div className="absolute top-3 right-3 flex items-center space-x-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <button
              onClick={(e) => onRemove(item.id, e)}
              className="w-5 h-5 bg-gray-300 hover:bg-red-400 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Thumbnail Image / Icon */}
        <div className={imageContainerClassName}>
          {isLoading ? (
            <Upload className="w-8 h-8 text-blue-500 animate-spin" />
          ) : isUploaded && previewUrl ? (
            <img
              src={previewUrl}
              alt={item.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <img
              src={item.icon}
              alt={item.name}
              className="w-16 h-16 object-contain drop-shadow-sm"
            />
          )}
        </div>

        {/* Info Label & Status Badge */}
        <div className="text-center">
          <h5 className="text-sm font-semibold text-gray-500 mb-3">
            {item.name}
          </h5>
          {isLoading ? (
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium">
              <Upload className="w-3 h-3 mr-1 animate-spin" />
              Processing...
            </Badge>
          ) : isUploaded ? (
            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Ready
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium">
              <Upload className="w-3 h-3 mr-1" />
              Click to Load
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const ImagingUploadGrid: React.FC<ImagingUploadGridProps> = ({
  uploadCategories,
  loadingCards,
  uploadedImages,
  imagePreviewUrls,
  onImageUpload,
  onRemoveImage,
}) => {
  return (
    <div className="flex-1 space-y-10">
      {uploadCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-6">
          {/* Category Header */}
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">
                  {category.title}
                </h4>
                <p className="text-sm text-gray-600 font-medium">
                  {category.subtitle}
                </p>
              </div>
            </div>
            <div className="h-px bg-gray-200 ml-7"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.items.map((item) => (
              <UploadCard
                key={item.id}
                item={item}
                isLoading={!!loadingCards[item.id]}
                isUploaded={!!uploadedImages[item.id]}
                previewUrl={imagePreviewUrls[item.id]}
                onUpload={onImageUpload}
                onRemove={onRemoveImage}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
