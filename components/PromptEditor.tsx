import { useState, useEffect } from 'react';
import { Button, Input, Card, Typography, Space, Row, Col, Tabs } from 'antd';
import prompts from '../utils/prompts';
import { PromptName } from '@/utils/prompts';
// import { useMessage } from '@/hooks/useMessage';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface PromptEditorProps {
  onSave: (updatedPrompts: any) => void;
  onCancel: () => void;
  onResetPrompt: (promptName: PromptName) => void;
  editedPrompts: any;
  setEditedPrompts: (updatedPrompts: any) => void;
}

// Mapping between PromptName enum and the keys used in the editedPrompts state
const PromptEditor = ({ onSave, onCancel, onResetPrompt, editedPrompts, setEditedPrompts }: PromptEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>(PromptName.APP_BRIEF);
  
  // const { success, error, info, contextHolder } = useMessage();

  const handleChange = (field: string, value: string) => {
    setEditedPrompts((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(editedPrompts);
  };

  const handleReset = (field: PromptName) => {
    onResetPrompt(field);
    
    setEditedPrompts((prev: any) => ({
      ...prev,
      [field]: prompts[field]
    }));
    
    // info(`${field} prompt has been reset to default`);
  };

  const renderTabContent = (promptName: PromptName, title: string) => {
    const promptKey = promptName;
    return (
      <div>
        <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
          <Col>
            <Title level={5}>{title.toUpperCase()}</Title>
          </Col>
          <Col>
            <Button size="small" onClick={() => handleReset(promptName)}>Reset to Default</Button>
          </Col>
        </Row>
        <TextArea
          value={editedPrompts?.[promptKey] || ''}
          onChange={(e) => handleChange(promptKey, e.target.value)}
          autoSize={{ minRows: 16 }}
        />
      </div>
    );
  };

  // Show loading state while prompts are being fetched
  if (!editedPrompts) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading prompts...
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* {contextHolder} */}
      <Card>
        <Title level={4}>Edit Prompts</Title>
        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
          Customize the AI prompts used for generating your app. These prompts determine how the AI interprets your requirements.
        </Text>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ marginBottom: 24 }}
          items={Object.keys(prompts).map((promptName) => ({
            key: promptName,
            label: promptName.toUpperCase(),
            children: renderTabContent(promptName as PromptName, promptName)
          }))}
        />
        
        <Row justify="end" style={{ marginTop: 24 }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save & Continue</Button>
          </Space>
        </Row>
      </Card>
    </>
  );
};

export default PromptEditor; 