import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

const meta = {
  title: 'Neumorphic/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'neumo',
      values: [
        {
          name: 'neumo',
          value: 'var(--neumo-base)',
        },
      ],
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="p-12 bg-[var(--neumo-base)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">タブ1</TabsTrigger>
        <TabsTrigger value="tab2">タブ2</TabsTrigger>
        <TabsTrigger value="tab3">タブ3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm p-4">タブ1の内容です。</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm p-4">タブ2の内容です。</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm p-4">タブ3の内容です。</p>
      </TabsContent>
    </Tabs>
  ),
}

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="camera">
      <TabsList>
        <TabsTrigger value="camera">カメラ</TabsTrigger>
        <TabsTrigger value="lens">レンズ</TabsTrigger>
      </TabsList>
      <TabsContent value="camera">
        <p className="text-sm p-4">カメラ一覧</p>
      </TabsContent>
      <TabsContent value="lens">
        <p className="text-sm p-4">レンズ一覧</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithCards: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="profile">プロフィール</TabsTrigger>
        <TabsTrigger value="settings">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
            <CardDescription>ユーザー情報を表示します。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">名前: テストユーザー</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>設定</CardTitle>
            <CardDescription>アプリの設定を変更します。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">設定項目がここに表示されます。</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">有効</TabsTrigger>
        <TabsTrigger value="tab2" disabled>無効</TabsTrigger>
        <TabsTrigger value="tab3">有効</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm p-4">有効なタブの内容です。</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm p-4">3番目のタブの内容です。</p>
      </TabsContent>
    </Tabs>
  ),
}

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">ホーム</TabsTrigger>
        <TabsTrigger value="tab2">カメラ</TabsTrigger>
        <TabsTrigger value="tab3">レンズ</TabsTrigger>
        <TabsTrigger value="tab4">アクセサリー</TabsTrigger>
        <TabsTrigger value="tab5">設定</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm p-4">ホーム画面</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm p-4">カメラ一覧</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm p-4">レンズ一覧</p>
      </TabsContent>
      <TabsContent value="tab4">
        <p className="text-sm p-4">アクセサリー一覧</p>
      </TabsContent>
      <TabsContent value="tab5">
        <p className="text-sm p-4">設定画面</p>
      </TabsContent>
    </Tabs>
  ),
}
