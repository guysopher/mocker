'use client'

import { useState, useEffect } from 'react'
import { Form, Input, Button, Spin, Modal, Space } from 'antd'
import { SendOutlined, SettingOutlined } from '@ant-design/icons'
import PromptEditor from './PromptEditor'
import { PromptName } from '@/utils/prompts'
import defaultPrompts from '@/utils/prompts'
const { TextArea } = Input

interface AppDescriptionFormProps {
  onSubmit: (description: string, prompts: Record<PromptName, string>) => void
  isGenerating: boolean
  appDescription: string
}

// Storage keys
const STORAGE_KEY_DESCRIPTION = 'app_description'
const STORAGE_KEY_PROMPTS = 'app_prompts'

export default function AppDescriptionForm({ onSubmit, isGenerating, appDescription }: AppDescriptionFormProps) {
  const defaultDescription = "a dead simple todo list app - one page only with a list of todos and a button - nothing else!"
  
  // Initialize state with values from localStorage or defaults
  const [description, setDescription] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_DESCRIPTION) || defaultDescription
    }
    return defaultDescription
  })
  
  useEffect(() => {
    setDescription(appDescription)
  }, [appDescription])

  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false)
  
  const [prompts, setPrompts] = useState<Record<PromptName, string>>(() => {
    if (typeof window !== 'undefined') {
      const savedPrompts = localStorage.getItem(STORAGE_KEY_PROMPTS)
      return savedPrompts ? JSON.parse(savedPrompts) : defaultPrompts
    }
    return defaultPrompts
  })

  const handleSubmit = () => {
    if (description.trim() && !isGenerating) {
      // Save to localStorage only when Generate App is clicked
      localStorage.setItem(STORAGE_KEY_DESCRIPTION, description)
      localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(prompts))
      
      onSubmit(description, prompts)
    }
  }
  
  const handleSavePrompts = (updatedPrompts: Record<PromptName, string>) => {
    setPrompts(updatedPrompts)
    localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(updatedPrompts))
    setIsPromptEditorOpen(false)
  }
  
  const handleResetPrompt = (promptName: PromptName) => {
    const updatedPrompts = {
      ...prompts,
      [promptName]: defaultPrompts[promptName]
    }
    setPrompts(updatedPrompts)
    
    // When a prompt is reset, remove it from localStorage
    if (typeof window !== 'undefined') {
      const savedPrompts = localStorage.getItem(STORAGE_KEY_PROMPTS)
      if (savedPrompts) {
        const parsedPrompts = JSON.parse(savedPrompts)
        delete parsedPrompts[promptName]
        localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(parsedPrompts))
      }
    }
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
              placeholder="Describe the features and functionality you want in your app..."
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
          <div className="flex justify-between space-x-2">
            <Button
              type="default"
              onClick={() => {
                // Reset prompts to default
                setPrompts(defaultPrompts);
                // Remove prompts from localStorage but keep description
                if (typeof window !== 'undefined') {
                  localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(defaultPrompts));
                }
              }}
              disabled={isGenerating}
            >
              Reset Prompts to Default
            </Button>
            <div className="flex space-x-2">
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
                loading={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate App'}
              </Button>
            </div>
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
          onResetPrompt={handleResetPrompt}
          editedPrompts={prompts}
          setEditedPrompts={setPrompts}
        />
      </Modal>
    </>
  )
}