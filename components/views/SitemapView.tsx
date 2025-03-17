import React from 'react';
import { Skeleton, Descriptions, Tag } from 'antd';

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

    const renderPageContent = (pageData: any) => {
    try {
      const data = typeof pageData === 'string' ? JSON.parse(pageData) : pageData;
      
      return (
        <div className="font-medium">
          <div className="font-bold mb-2">{data.type || 'Page'}</div>
          <Descriptions size="small" column={1}>
            {data.description && (
              <Descriptions.Item label="Description" className="text-sm">
                {data.description}
              </Descriptions.Item>
            )}
            {data.design && (
              <Descriptions.Item label="Design" className="text-sm">
                {data.design}
              </Descriptions.Item>
            )}
            {data.components && (
              <Descriptions.Item label="Components">
                <div className="flex flex-wrap gap-1">
                  {data.components.map((component: string, idx: number) => (
                    <Tag key={idx} color="blue">{component}</Tag>
                  ))}
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      );
    } catch (e) {
      // Fallback to string if JSON parsing fails
      return <div className="font-medium">{String(pageData)}</div>;
    }
  };

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-6">Site Map</h2>
      <div className="grid grid-cols-1 gap-4">
        {elements.map((page, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              activeElement === page ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onElementClick(page)}
          >
            <div className="flex items-center">
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