import React from 'react';
import { Skeleton } from 'antd';

interface SitemapViewProps {
  elements: string[];
  onElementClick: (elementId: string) => void;
  activeElement: string | null;
  showProgress: string | null;
  isGenerating: boolean;
}

export const SitemapView: React.FC<SitemapViewProps> = ({
  elements,
  onElementClick,
  activeElement,
  showProgress,
  isGenerating
}) => {
  if (isGenerating) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton active paragraph={{ rows: 8 }} className="w-full max-w-4xl" />
      </div>
    );
  }

  const renderPageContent = (page: string) => {
    try {
      const pageData = JSON.parse(page);
      return (
        <div className="font-medium">
          <div className="font-bold">{pageData.type || 'Page'}</div>
          {pageData.description && (
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
              {typeof pageData.description === 'string' 
                ? pageData.description 
                : JSON.stringify(pageData.description)}
            </div>
          )}
        </div>
      );
    } catch (e) {
      // Fallback to string if JSON parsing fails
      return <div className="font-medium">{String(page)}</div>;
    }
  };

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-6">Site Map</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {elements.map((page, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              activeElement === page ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onElementClick(page)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                {index + 1}
              </div>
              {renderPageContent(page)}
            </div>
            {showProgress === page && (
              <div className="mt-2 text-sm text-green-600">Processing feedback...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 