'use client';

import { useState } from 'react';
import { Input, Button, Row } from 'antd';
import { EditOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useMessage } from '@/hooks/useMessage';
import PromptEditor from './PromptEditor';

interface AppFormProps {
  onGenerateApp: (description: string, customPrompts: any) => Promise<void>;
}

export default function AppForm({ onGenerateApp }: AppFormProps) {
  const [appDescription, setAppDescription] = useState('');
  const [isEditingPrompts, setIsEditingPrompts] = useState(false);
  const [customPrompts, setCustomPrompts] = useState(/* import your prompts */);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error, contextHolder } = useMessage();

  const handleGenerateApp = async () => {
    if (!appDescription) {
      error('Please enter an app description');
      return;
    }

    setIsLoading(true);
    try {
      await onGenerateApp(appDescription, customPrompts);
    } catch (err) {
      error('Failed to generate app');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrompts = (updatedPrompts: any) => {
    setCustomPrompts(updatedPrompts);
    setIsEditingPrompts(false);
    success('Your custom prompts have been saved');
  };

  return (
    <>
      {contextHolder}
      {isEditingPrompts ? (
        <PromptEditor 
          onSave={handleSavePrompts}
          onCancel={() => setIsEditingPrompts(false)}
        />
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>Describe your app</div>
            <Input.TextArea
              placeholder="Enter a detailed description of the app you want to create..."
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              rows={6}
            />
          </div>
          
          <Row justify="space-between">
            <Button 
              onClick={() => setIsEditingPrompts(true)}
              icon={<EditOutlined />}
            >
              Edit Prompts
            </Button>
            
            <Button
              type="primary"
              onClick={handleGenerateApp}
              loading={isLoading}
              icon={<ArrowRightOutlined />}
            >
              {isLoading ? 'Generating...' : 'Generate App'}
            </Button>
          </Row>
        </>
      )}
    </>
  );
} 