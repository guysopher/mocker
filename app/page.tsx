'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Canvas from '@/components/Canvas'
import AppDescriptionForm from '@/components/AppDescriptionForm'
import Header from '@/components/Header'
import { CanvasStory } from '@/types/canvas'
import { BriefItem } from '@/types/canvas'
import { CanvasElement } from '@/types/canvas'
import { PromptName } from '@/utils/prompts'

export default function Home() {
  const [appDescription, setAppDescription] = useState('')
  const [generatingContent, setGeneratingContent] = useState(false)
  const [appGenerated, setAppGenerated] = useState(false)
  const [currentView, setCurrentView] = useState('brief') // brief, design, stories
  const [buildProgress, setBuildProgress] = useState(0)
  const [building, setBuilding] = useState(false)
  const [appContent, setAppContent] = useState<{
    brief: BriefItem[];
    stories: CanvasStory[];
    sitemap: Record<string, Record<string, any>>;
  } | null>(null)
  const [generatingSection, setGeneratingSection] = useState<string | null>(null)

  const handleSubmitDescription = async (description: string, prompts: Record<PromptName, string>) => {
    setAppDescription(description)
    setGeneratingContent(true)
    setGeneratingSection('brief')
    setAppGenerated(true);

    try {
      let tempAppContent = {
        brief: [],
        stories: [],
        sitemap: {} as Record<string, Record<string, any>>
      }
      
      // Generate initial content for each section
      for (const section of Object.keys(tempAppContent)) {
        try {
          const response = await fetch(`/api/${section}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, customPrompt: prompts[section as keyof typeof prompts], ...tempAppContent }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data) {
            tempAppContent = {
              brief: section === 'brief' ? data.brief : (tempAppContent?.brief || []),
              sitemap: section === 'sitemap' ? data.sitemap : (tempAppContent?.sitemap || []),
              stories: section === 'stories' ? data.stories : (tempAppContent?.stories || [])
            };
            setAppContent(tempAppContent);
          }
        } catch (error) {
          console.error(`Error generating ${section}:`, error);
          console.error('Current tempAppContent:', tempAppContent);
          throw new Error(`Failed to generate ${section}`);
        }
      }

      // Generate layout for each page
      for (const page of Object.keys(tempAppContent.sitemap)) {
        try {
          const response = await fetch(`/api/layout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, page, customPrompt: prompts.layout, ...tempAppContent }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data) {
            tempAppContent.sitemap = {
              ...tempAppContent.sitemap,
              [page]: data.layout
            }

            // Generate components for the page
            for (const component of Object.keys(data.layout)) {
              try {
                const response = await fetch(`/api/component`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ description, page, component, customPrompt: prompts.component, ...tempAppContent }),
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data) {
                  tempAppContent.sitemap = {
                    ...tempAppContent.sitemap,
                    [page]: {
                      ...tempAppContent.sitemap[page],
                      [component]: data.code
                    }
                  }
                }
              } catch (error) {
                console.error(`Error generating component ${component} for page ${page}:`, error);
                console.error('Current page layout:', tempAppContent.sitemap[page]);
                throw new Error(`Failed to generate component ${component}`);
              }
            }
          }
        } catch (error) {
          console.error(`Error generating layout for page ${page}:`, error);
          console.error('Current sitemap:', tempAppContent.sitemap);
          throw new Error(`Failed to generate layout for page ${page}`);
        }
      }

      setGeneratingContent(false);
      setGeneratingSection(null);
    } catch (error) {
      console.error('Fatal error in app generation:', error);
      setGeneratingContent(false);
      setGeneratingSection(null);
    }
  }

  const handleBuildIt = () => {
    setBuilding(true)

    // Simulate build progress
    const interval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 800)
  }

  useEffect(() => {
    if (buildProgress >= 100) {
      // Ready to redirect to Wix
      setBuilding(false)
    }
  }, [buildProgress])

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      {!appGenerated ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-50">
          <div className="max-w-7xl w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Tell Us About Your Dream App</h1>
            </div>

            <AppDescriptionForm
              onSubmit={handleSubmitDescription}
              isGenerating={generatingContent}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <div className="flex space-x-6">
                <button
                  onClick={() => setCurrentView('brief')}
                  className={`px-4 py-2 font-medium ${currentView === 'brief'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Brief
                </button>
                <button
                  onClick={() => setCurrentView('stories')}
                  className={`px-4 py-2 font-medium ${currentView === 'stories'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  User Stories
                </button>
                <button
                  onClick={() => setCurrentView('design')}
                  className={`px-4 py-2 font-medium ${currentView === 'design'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Design
                </button>

              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleBuildIt}
                  disabled={generatingContent || building || buildProgress > 0}
                  className="px-5 py-2 bg-green-600 text-white rounded-md font-medium disabled:bg-green-300"
                >
                  Build It
                </button>

                {buildProgress === 100 && (
                  <Link
                    href="https://www.wix.com/"
                    target="_blank"
                    className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium"
                  >
                    Finish in Wix
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Canvas
              view={currentView}
              appDescription={appDescription}
              generatingSection={generatingSection}
              buildProgress={buildProgress}
              appContent={{
                brief: appContent?.brief || [],
                design: [],
                stories: appContent?.stories || []
              }}
            />
          </div>

          {building && (
            <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg max-w-md">
              <h3 className="font-semibold text-lg mb-2">Building Your App</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${buildProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {buildProgress < 30 ? 'Generating code structure...' :
                  buildProgress < 60 ? 'Implementing core functionality...' :
                    buildProgress < 90 ? 'Adding UI components...' :
                      buildProgress === 100 ? 'Ready to publish!' : 'Finalizing...'}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
