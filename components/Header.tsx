'use client'

import { Layout, Menu, Button, Avatar, Space, Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout
const { Title, Text } = Typography

export default function Header() {
  return (
    <AntHeader className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-full">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute -top-6 -right-1 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
          </div>
          <Title level={4} className="!m-0 text-gray-800">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;App Creator</Title>
          <Text className="text-xs text-gray-500">AI-powered app design</Text>
        </div>

        <Space size="middle">
          <Tooltip title="Help">
            <Button type="text" icon={<QuestionCircleOutlined />}>
              Help
            </Button>
          </Tooltip>
          <Tooltip title="Settings">
            <Button type="text" icon={<SettingOutlined />}>
              Settings
            </Button>
          </Tooltip>
          <Avatar
            icon={<UserOutlined />}
            className="cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200"
          />
        </Space>
      </div>
    </AntHeader>
  )
}