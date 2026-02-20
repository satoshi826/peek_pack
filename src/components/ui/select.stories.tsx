import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'

const meta = {
  title: 'Neumorphic/Select',
  component: Select,
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
      <div className="p-12 bg-[var(--neumo-base)] min-w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="フルーツを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">りんご</SelectItem>
        <SelectItem value="banana">バナナ</SelectItem>
        <SelectItem value="orange">オレンジ</SelectItem>
        <SelectItem value="grape">ぶどう</SelectItem>
        <SelectItem value="melon">メロン</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm">
        <SelectValue placeholder="サイズ選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xs">XS</SelectItem>
        <SelectItem value="s">S</SelectItem>
        <SelectItem value="m">M</SelectItem>
        <SelectItem value="l">L</SelectItem>
        <SelectItem value="xl">XL</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="カテゴリーを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>フルーツ</SelectLabel>
          <SelectItem value="apple">りんご</SelectItem>
          <SelectItem value="banana">バナナ</SelectItem>
          <SelectItem value="orange">オレンジ</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>野菜</SelectLabel>
          <SelectItem value="carrot">にんじん</SelectItem>
          <SelectItem value="tomato">トマト</SelectItem>
          <SelectItem value="cucumber">きゅうり</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger>
        <SelectValue placeholder="無効" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item1">アイテム1</SelectItem>
        <SelectItem value="item2">アイテム2</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">りんご</SelectItem>
        <SelectItem value="banana">バナナ</SelectItem>
        <SelectItem value="orange">オレンジ</SelectItem>
        <SelectItem value="grape">ぶどう</SelectItem>
        <SelectItem value="melon">メロン</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="国を選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="jp">日本</SelectItem>
        <SelectItem value="us">アメリカ</SelectItem>
        <SelectItem value="uk">イギリス</SelectItem>
        <SelectItem value="fr">フランス</SelectItem>
        <SelectItem value="de">ドイツ</SelectItem>
        <SelectItem value="cn">中国</SelectItem>
        <SelectItem value="kr">韓国</SelectItem>
        <SelectItem value="it">イタリア</SelectItem>
        <SelectItem value="es">スペイン</SelectItem>
        <SelectItem value="ca">カナダ</SelectItem>
        <SelectItem value="au">オーストラリア</SelectItem>
        <SelectItem value="br">ブラジル</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="アイコン付き選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>ホーム</span>
        </SelectItem>
        <SelectItem value="settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>設定</span>
        </SelectItem>
        <SelectItem value="user">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>ユーザー</span>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}
