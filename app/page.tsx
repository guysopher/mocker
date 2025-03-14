'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Layout,
  Typography,
  Button,
  Steps,
  Menu,
  Card,
  Progress,
  notification,
  Spin,
  Tabs,
  Switch
} from 'antd'
import {
  CheckOutlined,
  BuildOutlined,
  ExportOutlined,
  FileTextOutlined,
  UserOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import Canvas from '@/components/Canvas'
import AppDescriptionForm from '@/components/AppDescriptionForm'
import Header from '@/components/Header'
import { CanvasStory } from '@/types/canvas'
import { BriefItem } from '@/types/canvas'
import { PromptName } from '@/utils/prompts'

const { Content } = Layout
const { Title, Text } = Typography
const { TabPane } = Tabs

const USE_COMPONENTS = false

export default function Home() {
  const [appDescription, setAppDescription] = useState('')
  const [generatingContent, setGeneratingContent] = useState(false)
  const [appGenerated, setAppGenerated] = useState(false)
  const [currentView, setCurrentView] = useState('brief') // brief, design, stories
  const [buildProgress, setBuildProgress] = useState(0)
  const [building, setBuilding] = useState(false)
  const [useComponents, setUseComponents] = useState(false)
  const [appContent, setAppContent] = useState<{
    brief: BriefItem[];
    stories: CanvasStory[];
    sitemap: any[];
    stylesheet: { classes: string[], stylesheet: string };
    pages: Record<string, {
      layout: string;
      components: string[];
    }>;
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
        sitemap: [],
        stylesheet: { classes: [], stylesheet: '' },
        pages: {} as Record<string, {
          layout: string;
          components: string[];
        }>
      }

      const createPromise = async (section: string) => {
        try {
          await fetch(`/api/${section}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, customPrompt: prompts[section as keyof typeof prompts], ...tempAppContent }),
          }).then(response => response.json()).then(data => {
            tempAppContent = {
              brief: section === 'brief' ? data.brief : (tempAppContent?.brief || []),
              sitemap: section === 'sitemap' ? data.sitemap : (tempAppContent?.sitemap || []),
              stories: section === 'stories' ? data.stories : (tempAppContent?.stories || []),
              pages: section === 'pages' ? data.pages : (tempAppContent?.pages || {}),
              stylesheet: section === 'stylesheet' ? data.stylesheet : (tempAppContent?.stylesheet || { classes: [], stylesheet: '' })
            };
            setAppContent(tempAppContent);
          });
        } catch (error) {
          console.error(`Error generating ${section}:`, error);
        }
      };
      await createPromise('brief');

      await Promise.all([createPromise('stories'), createPromise('stylesheet'), createPromise('sitemap')]);

      const pagePromises = tempAppContent.sitemap.map(async (page: { type: string, description: string }) => {
        try {
          if (useComponents) {
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

            tempAppContent.pages = {
              ...tempAppContent.pages,
              [page.type]: { layout: data.layout, components: [] }
            }

            console.log("Updating pages", tempAppContent.pages)

            const componentPromises = (data.layout.components).map(async (component: any) => {
              try {
                const response = await fetch(`/api/component`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ description, page, component, cssClasses: tempAppContent?.stylesheet?.classes, customPrompt: prompts.component, ...tempAppContent }),
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log("Generating component", component)

                const data = await response.json();
                if (data) {
                  if (!tempAppContent.pages) {
                    tempAppContent.pages = {};
                  }
                  if (!tempAppContent.pages[page.type]) {
                    tempAppContent.pages[page.type] = { layout: '', components: [] };
                  }
                  tempAppContent.pages[page.type].components.push(data.code);
                }
              } catch (error) {
                console.error(`Error generating component ${component} for page ${page}:`, error);
                console.error('Current page layout:', tempAppContent.sitemap);
              }
            });

            // Wait for all component requests to complete
            await Promise.all(componentPromises);
          } else {
            const pageResponse = await fetch(`/api/page`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ description, page, cssClasses: tempAppContent?.stylesheet?.classes, customPrompt: prompts.page, ...tempAppContent }),
            });

            if (!pageResponse.ok) {
              throw new Error(`HTTP error! status: ${pageResponse.status}`);
            }

            const pageData = await pageResponse.json();
            if (pageData) {
              if (!tempAppContent.pages) {
                tempAppContent.pages = {};
              }
              if (!tempAppContent.pages[page.type]) {
                tempAppContent.pages[page.type] = { layout: '', components: [] };
              }
              tempAppContent.pages[page.type].components.push(pageData.code);
            }
            setAppContent(tempAppContent);

          }

        } catch (error) {
          console.error(`Error generating layout for page ${page}:`, error);
          console.error('Current sitemap:', tempAppContent.sitemap);
        }
      });

      // Wait for all page requests to complete
      await Promise.all(pagePromises);

      setGeneratingContent(false);
      setGeneratingSection(null);
      notification.success({
        message: 'App Generated Successfully',
        description: 'Your app has been generated and is ready to view.',
        placement: 'bottomRight',
      });
    } catch (error) {
      console.error('Fatal error in app generation:', error);
      setGeneratingContent(false);
      setGeneratingSection(null);
      notification.error({
        message: 'Error Generating App',
        description: 'There was an error generating your app. Please try again.',
        placement: 'bottomRight',
      });
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
      notification.success({
        message: 'Build Complete',
        description: 'Your app is ready to be exported to Wix!',
        placement: 'bottomRight',
      });
    }
  }, [buildProgress])

  return (
    <Layout className="min-h-screen">
      <Header />

      {!appGenerated ? (
        <Content className="p-8 bg-gradient-to-b from-blue-50 to-gray-50">
          <Card
            className="max-w-7xl mx-auto shadow-lg"
            bordered={false}
          >
            <div className="text-center mb-8">
              <Title level={1} className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Tell Us About Your Dream App
              </Title>
            </div>

            <div className="flex justify-end mb-4 items-center">
              <Text className="mr-2">Use Component-Based Generation:</Text>
              <Switch
                checked={useComponents}
                onChange={setUseComponents}
                disabled={generatingContent}
              />
            </div>

            <AppDescriptionForm
              onSubmit={handleSubmitDescription}
              isGenerating={generatingContent}
            />
          </Card>
        </Content>
      ) : (
        <Layout>
          <Tabs
            activeKey={currentView}
            onChange={setCurrentView}
            size='large'
            centered
            tabBarExtraContent={
              <>
                <Button
                  type="primary"
                  size='large'
                  icon={<BuildOutlined />}
                  onClick={handleBuildIt}
                  disabled={generatingContent || building || buildProgress > 0}
                  loading={building && buildProgress < 100}
                >
                  Build It
                </Button>

                {buildProgress === 100 && (
                  <Button
                    type="primary"
                    icon={<ExportOutlined />}
                    href="https://www.wix.com/"
                    target="_blank"
                  >
                    Finish in Wix
                  </Button>
                )}
              </>
            }
          >
            <TabPane
              tab={<span>Brief</span>}
              key="brief"
            />
            <TabPane
              tab={<span>User Stories</span>}
              key="stories"
            />
            <TabPane
              tab={<span>Design</span>}
              key="pages"
            />
          </Tabs>

          <Content>
            <Card>
              <Canvas
                view={currentView}
                appDescription={appDescription}
                generatingSection={generatingSection}
                buildProgress={buildProgress}
                appContent={{
                  brief: appContent?.brief || [],
                  pages: appContent?.pages || {},
                  stories: appContent?.stories || [],
                  stylesheet: appContent?.stylesheet?.stylesheet || '',
                }}
              />
            </Card>

            {building && (
              <Card
                className="fixed bottom-6 right-6 shadow-lg max-w-md"
                size="small"
              >
                <Title level={5}>Building Your App</Title>
                <Progress percent={buildProgress} status="active" />
                <Text type="secondary">
                  {buildProgress < 30 ? 'Generating code structure...' :
                    buildProgress < 60 ? 'Implementing core functionality...' :
                      buildProgress < 90 ? 'Adding UI components...' :
                        buildProgress === 100 ? 'Ready to publish!' : 'Finalizing...'}
                </Text>
              </Card>
            )}
          </Content>
        </Layout>
      )}
    </Layout>
  )
}

