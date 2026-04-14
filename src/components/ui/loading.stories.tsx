import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Loading } from './loading'

const meta = {
  title: 'Neumorphic/Loading',
  component: Loading,
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
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: 'text',
    },
  },
  decorators: [
    Story => (
      <div className="p-12 bg-(--neumo-base)">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: {
    label: 'ギアを読み込み中...',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    label: '読み込み中...',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    label: '読み込み中...',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-12">
      <Loading size="sm" label="sm" />
      <Loading size="md" label="md" />
      <Loading size="lg" label="lg" />
    </div>
  ),
}
