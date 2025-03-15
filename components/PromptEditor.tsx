import { useState } from 'react';
import { Button, Input, Card, Typography, Space, Row, Col } from 'antd';
import prompts from '../utils/prompts';
import { PromptName } from '@/utils/prompts';
// import { useMessage } from '@/hooks/useMessage';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface PromptEditorProps {
  onSave: (updatedPrompts: any) => void;
  onCancel: () => void;
  initialPrompts: any;
  onResetPrompt: (promptName: PromptName) => void;
}

const PromptEditor = ({ onSave, onCancel, initialPrompts, onResetPrompt }: PromptEditorProps) => {
  const [editedPrompts, setEditedPrompts] = useState(initialPrompts);
  
  // const { success, error, info, contextHolder } = useMessage();

  const handleChange = (field: string, value: string) => {
    setEditedPrompts((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!editedPrompts.brief.trim() || 
        !editedPrompts.stories.trim() || 
        !editedPrompts.design.trim()) {
      // error('All prompts must have content');
      return;
    }
    
    onSave(editedPrompts);
  };

  const handleReset = (field: PromptName) => {
    onResetPrompt(field);
    setEditedPrompts((prev: any) => ({
      ...prev,
      [field]: prompts[field as keyof typeof prompts]
    }));
    
    // info(`${field} prompt has been reset to default`);
  };

  return (
    <>
      {/* {contextHolder} */}
      <Card>
        <Title level={4}>Edit Prompts</Title>
        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
          Customize the AI prompts used for generating your app. These prompts determine how the AI interprets your requirements.
        </Text>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
              <Col>
                <Title level={5}>App Brief Prompt</Title>
              </Col>
              <Col>
                <Button size="small" onClick={() => handleReset(PromptName.APP_BRIEF)}>Reset to Default</Button>
              </Col>
            </Row>
            <TextArea
              value={editedPrompts.brief}
              onChange={(e) => handleChange('brief', e.target.value)}
              autoSize={{ minRows: 8 }}
            />
          </div>
          
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
              <Col>
                <Title level={5}>User Stories Prompt</Title>
              </Col>
              <Col>
                <Button size="small" onClick={() => handleReset(PromptName.USER_STORIES)}>Reset to Default</Button>
              </Col>
            </Row>
            <TextArea
              value={editedPrompts.stories}
              onChange={(e) => handleChange('stories', e.target.value)}
              autoSize={{ minRows: 8 }}
            />
          </div>
          
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
              <Col>
                <Title level={5}>Design Recommendations Prompt</Title>
              </Col>
              <Col>
                <Button size="small" onClick={() => handleReset(PromptName.STYLESHEET)}>Reset to Default</Button>
              </Col>
            </Row>
            <TextArea
              value={editedPrompts.design}
              onChange={(e) => handleChange('design', e.target.value)}
              autoSize={{ minRows: 8 }}
            />
          </div>
        </Space>
        
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