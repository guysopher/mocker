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
  Switch,
  Col,
  Modal
} from 'antd'
import {
  CheckOutlined,
  BuildOutlined,
  ExportOutlined,
  FileTextOutlined,
  UserOutlined,
  AppstoreOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import Canvas from '@/components/Canvas'
import AppDescriptionForm from '@/components/AppDescriptionForm'
import Header from '@/components/Header'
import { CanvasStory } from '@/types/canvas'
import { BriefItem } from '@/types/canvas'
import prompts, { PromptName } from '@/utils/prompts'
import Chat from '@/components/Chat'

const { Content } = Layout
const { Title, Text } = Typography

const USE_COMPONENTS = false

type AppContent = {
  brief: BriefItem[];
  stories: CanvasStory[];
  sitemap: any[];
  stylesheet: { classes: string[], stylesheet: string };
  pages: Record<string, {
    order: number;
    layout: string;
    components: string[];
  }>;
};

type AppContentSection = 'brief' | 'stories' | 'sitemap' | 'stylesheet' | 'pages' | 'change';

export default function Home() {
  const [appDescription, setAppDescription] = useState('')
  const [generatingContent, setGeneratingContent] = useState(false)
  const [appGenerated, setAppGenerated] = useState(false)
  const [currentView, setCurrentView] = useState('brief') // brief, design, stories
  const [buildProgress, setBuildProgress] = useState(0)
  const [building, setBuilding] = useState(false)
  const [useComponents, setUseComponents] = useState(false)
  const [appContent, setAppContent] = useState<AppContent | null>(null)
  const [generatingSection, setGeneratingSection] = useState<string | null>(null)

  let tempAppContent: AppContent | null = null;

  const createPromise = async (section: AppContentSection, description: string, prompts: Record<PromptName, string>, changeRequest?: string) => {
    try {
      const _section = changeRequest ? 'change' : section
      await fetch(`/api/${_section}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, customPrompt: prompts[_section as keyof typeof prompts], changeRequest, ...tempAppContent, section, result: JSON.stringify(appContent?.[section as keyof AppContent]) }),
      }).then(response => response.json()).then(data => {
        if (changeRequest) {
          data = data.change;
          console.log("Change request", data)
        }
        tempAppContent = {
          brief: appContent?.brief || tempAppContent?.brief || [],
          stories: appContent?.stories || tempAppContent?.stories || [],
          sitemap: appContent?.sitemap || tempAppContent?.sitemap || [],
          stylesheet: { classes: appContent?.stylesheet?.classes || tempAppContent?.stylesheet?.classes || [], stylesheet: appContent?.stylesheet?.stylesheet || tempAppContent?.stylesheet?.stylesheet || '' },
          pages: appContent?.pages || tempAppContent?.pages || {}
        };

        if (section !== 'change' && data[section]) {
          tempAppContent[section] = data[section] || [];
        }

        setAppContent(tempAppContent);
      });
    } catch (error) {
      console.error(`Error generating ${section}:`, error);
    }
  };

  const createPagePromise = async (page: { type: string, description: string }, idx: number, changeRequest?: string) => {
    try {
      setGeneratingSection('Page (' + page.type + ')')
      const target = changeRequest ? 'change' : 'page'
      const pageResponse = await fetch(`/api/${target}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, customPrompt: prompts[target as keyof typeof prompts], ...tempAppContent, result: JSON.stringify(appContent?.pages?.[page.type]?.components?.[0]), changeRequest, section: 'page' }),
      });

      if (!pageResponse.ok) {
        throw new Error(`HTTP error! status: ${pageResponse.status}`);
      }

      let pageData = await pageResponse.json();

      if (changeRequest) {
        pageData = pageData.change;
        console.log("Change request", pageData)
      }

      if (pageData) {
        tempAppContent = {
          brief: appContent?.brief || tempAppContent?.brief || [],
          stories: appContent?.stories || tempAppContent?.stories || [],
          sitemap: appContent?.sitemap || tempAppContent?.sitemap || [],
          stylesheet: { classes: appContent?.stylesheet?.classes || tempAppContent?.stylesheet?.classes || [], stylesheet: appContent?.stylesheet?.stylesheet || tempAppContent?.stylesheet?.stylesheet || '' },
          pages: appContent?.pages || tempAppContent?.pages || {}
        };
        if (!tempAppContent.pages) {
          tempAppContent.pages = appContent?.pages || {};
        }
        if (!tempAppContent.pages[page.type] || (tempAppContent.pages[page.type])?.components?.length === 0) {
          tempAppContent.pages[page.type] = appContent?.pages?.[page.type] || { order: idx, layout: '', components: [] };
        }
        tempAppContent.pages[page.type].components = [(pageData.code)];
      }
      setAppContent(tempAppContent);

    } catch (error) {
      console.error(`Error generating layout for page ${page}:`, error);
      if (tempAppContent) {
        console.error('Current sitemap:', tempAppContent.sitemap);
      }
    }
  }

  const handleChangeRequest = async (changeRequest: string, context: any) => {
    const { section, pageName } = context;
    console.log("Change request", context)

    tempAppContent = appContent ? { ...appContent } : {
      brief: [],
      stories: [],
      sitemap: [],
      stylesheet: { classes: [], stylesheet: '' },
      pages: {}
    };

    if (section === 'brief') {
      await createPromise('brief', appDescription, prompts, changeRequest)
    } else if (section === 'stories') {
      await createPromise('stories', appDescription, prompts, changeRequest)
    } else if (section === 'sitemap') {
      await createPromise('sitemap', appDescription, prompts, changeRequest)
      if (tempAppContent) {
        const pagePromises = tempAppContent.sitemap.map((page, idx) => createPagePromise(page, idx, changeRequest));
        await Promise.all(pagePromises);
      }
    } else if (section === 'page' && pageName) {
      const pageIdx = appContent?.sitemap?.findIndex(page => page.type === pageName);
      if (pageIdx !== undefined && pageIdx >= 0) {
        createPagePromise(appContent?.sitemap?.[pageIdx], pageIdx, changeRequest)
      } else {
        await handleSubmitDescription(appDescription, prompts, changeRequest)
      }
    } else {
      await handleSubmitDescription(appDescription, prompts, changeRequest)
    }
    setGeneratingContent(false);
  }

  const handleSubmitDescription = async (description: string, prompts: Record<PromptName, string>, changeRequest?: string) => {
    setAppDescription(description)
    setGeneratingContent(true)
    setGeneratingSection('Brief')
    setAppGenerated(true);

    try {
      await createPromise('brief', description, prompts, changeRequest);

      setGeneratingSection('Stories & Sitemap')
      await Promise.all([createPromise('stories', description, prompts, changeRequest), createPromise('sitemap', description, prompts, changeRequest)]);

      if (tempAppContent && tempAppContent.sitemap) {
        const pagePromises = tempAppContent.sitemap.map((page, idx) => createPagePromise(page, idx, changeRequest));
        await Promise.all(pagePromises);
      }

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

  const handleBuildIt = async () => {
    setBuilding(true)
    const mentalModelData = { description: appDescription, brief: appContent?.brief, stories: appContent?.stories, sitemap: appContent?.sitemap };
    console.log("Mental model data", mentalModelData)
    
    try {
      // Add options with token if needed for local development
      const response = await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(mentalModelData),
      });
      const data = await response.json();
      const url = data.url;
      // Show a modal with the url
      Modal.info({
        title: 'App Generated Successfully',
        content: <div>Your app has been generated and is ready to view. <a href={url} target="_blank">View App</a></div>,
        onOk: () => {
          window.open(url, '_blank')
        }
      });
      
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
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      notification.error({
        message: 'Upload Failed',
        description: 'There was an error uploading your app data. Please try again.',
        placement: 'bottomRight',
      });
      setBuilding(false);
    }
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
      {!appGenerated ? (
        <Content className="p-8 bg-gradient-to-b from-blue-50 to-gray-50">
          <Card
            className="max-w-7xl mx-auto shadow-lg"
          >
            <Layout>
              <Content className="flex">
                <Col span={12} className="p-0 border-r bg-white">
                  {/* <Title level={3}>Tell Me About Your App...</Title> */}
                  <div className="rounded-lg p-0 overflow-y-auto" style={{ height: 'calc(100vh - 130px)', width: '100%' }}>
                    <Chat onSummaryCreated={setAppDescription} getCurrentDescription={() => appDescription} prompts={prompts} />
                  </div>
                </Col>
                <Col span={12} className="p-6">
                  <Title level={3}>Your App Description</Title>
                  <AppDescriptionForm
                    appDescription={appDescription}
                    onSubmit={handleSubmitDescription}
                    isGenerating={generatingContent}
                  />
                </Col>
              </Content>
            </Layout>
          </Card>
        </Content>
      ) : (
        <Layout
          style={{ width: 'calc(100vw - 100px)', minWidth: '1105px', overflowX: 'hidden', margin: '20px auto' }}
        >
          <Tabs
            activeKey={currentView}
            onChange={setCurrentView}
            size='large'
            centered
            tabBarGutter={50}
            tabBarExtraContent={{
              right: (
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
              ),
              left: (
                generatingContent ? (
                  <span className="mr-4 flex items-center bg-red-50 px-4 py-2 rounded-full">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#f5222d' }} spin />} />
                    <Text strong className="ml-2 text-red-600">Generating {generatingSection}...</Text>
                  </span>
                ) : null
              )
            }}
            items={[
              {
                key: 'brief',
                label: <span>Brief</span>,
              },
              {
                key: 'stories',
                label: <span>User Stories</span>,
              },
              {
                key: 'sitemap',
                label: <span>Sitemap</span>,
              },
              {
                key: 'pages',
                label: <span>Prototype</span>,
              }
            ]}
          />

          <Content>
            <Card style={{ backgroundColor: 'white', maxWidth: '1200px', margin: '0 auto' }}>
              <Canvas
                view={currentView}
                appDescription={appDescription}
                generatingSection={generatingSection}
                buildProgress={buildProgress}
                setGeneratingContent={setGeneratingContent}
                onChangeRequest={handleChangeRequest}
                appContent={{
                  brief: appContent?.brief || [],
                  pages: appContent?.pages || {},
                  stories: appContent?.stories || [],
                  stylesheet: appContent?.stylesheet?.stylesheet || '',
                  sitemap: appContent?.sitemap || [],
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

