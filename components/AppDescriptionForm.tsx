'use client'

import { useState, useEffect } from 'react'
import { Form, Input, Button, Spin, Modal, Space, Divider } from 'antd'
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
              rows={20}
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

        <Form.Item className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setDescription(
                "A second-hand marketplace where users can buy and sell used items. Features include: product listings with images and descriptions, search and filter functionality, user profiles, messaging system between buyers and sellers, rating system, and secure payment integration. The homepage should show featured items and recent listings."
              )}
              disabled={isGenerating}
            >
              Second-hand Marketplace
            </Button>
            <Button
              onClick={() => setDescription(
                "An online bookstore with a clean, modern interface. Features include: book catalog with cover images, descriptions, and reviews, search by title/author/genre, user accounts with reading lists and purchase history, recommendation system, and shopping cart functionality. Include a featured books section and new releases on the homepage."
              )}
              disabled={isGenerating}
            >
              Book Store
            </Button>
            <Button
              onClick={() => setDescription(
                "A self-moderated YouTube-style platform where content is curated by community voting. Features include: video upload and playback, upvote/downvote system, comment threads, user profiles, content tags, and trending videos section. Videos below a certain score are automatically hidden. Users can earn reputation points for good contributions."
              )}
              disabled={isGenerating}
            >
              Self-moderated YouTube Channel
            </Button>
            <Button
              onClick={() => setDescription(
                "An interactive black hole simulator that visualizes gravitational effects and light bending. Features include: 3D visualization of a black hole, adjustable parameters (mass, rotation, viewing angle), particle simulation showing matter falling in, gravitational lensing effects, and an educational mode with explanations of the physics involved."
              )}
              disabled={isGenerating}
            >
              Black Hole Simulator
            </Button>
          </div>
        </Form.Item>
        
        <Divider />
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