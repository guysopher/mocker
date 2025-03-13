'use client'

import { useState } from 'react'
import { Form, Input, Button, Spin, Modal, Space } from 'antd'
import { SendOutlined, SettingOutlined } from '@ant-design/icons'
import PromptEditor from './PromptEditor'

const { TextArea } = Input

interface AppDescriptionFormProps {
  onSubmit: (description: string, prompts: {brief: string, stories: string, design: string}) => void
  isGenerating: boolean
}

export default function AppDescriptionForm({ onSubmit, isGenerating }: AppDescriptionFormProps) {
  const defaultDescription = "Create a marketplace app for buying and selling second-hand items. Features should include user profiles, item listings with photos and descriptions, search and filter functionality, in-app messaging between buyers and sellers, secure payment processing, and a review system."
  const [description, setDescription] = useState(defaultDescription)
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false)
  const [prompts, setPrompts] = useState({
    brief: '',
    stories: '',
    design: ''
  })
  const handleSubmit = () => {
    if (description.trim() && !isGenerating) {
      onSubmit(description, prompts)
    }
  }
  
  const handleSavePrompts = (prompts: any) => {
    // Here you would handle saving the updated prompts
    console.log('Saving prompts:', prompts)
    setPrompts(prompts)
    setIsPromptEditorOpen(false)
  }
  
  return (
    <>
      <Form 
        onFinish={handleSubmit} 
        className="w-full max-w-5xl mx-auto"
        layout="vertical"
      >
        <Form.Item className="mb-6">        
          <div className="relative">
            <TextArea
              rows={10}
              placeholder="Describe the features and functionality you want in your marketplace app..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isGenerating}
              className="text-lg"
              style={{ resize: 'none' }}
            />
            
            {isGenerating && (
              <div className="absolute inset-0 bg-white bg-opacity-70 rounded-md flex items-center justify-center">
                <Spin tip="Generating..." />
              </div>
            )}
          </div>
        </Form.Item>
        
        <Form.Item>
          <div className="flex justify-end space-x-2">
            <Button
              type="default"
              icon={<SettingOutlined />}
              onClick={() => setIsPromptEditorOpen(true)}
              disabled={isGenerating}
            >
              Edit Prompts
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!description.trim() || isGenerating}
              icon={<SendOutlined />}
              size="large"
              loading={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate App'}
            </Button>
          </div>
        </Form.Item>
      </Form>

      <Modal
        title="Edit Default Prompts"
        open={isPromptEditorOpen}
        onCancel={() => setIsPromptEditorOpen(false)}
        footer={null}
        width={800}
      >
        <PromptEditor 
          onSave={handleSavePrompts} 
          onCancel={() => setIsPromptEditorOpen(false)} 
        />
      </Modal>
    </>
  )
}