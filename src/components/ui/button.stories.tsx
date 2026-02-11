import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './button'

const meta = {
  title: 'Neumorphic/Button',
  component: Button,
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
    variant: {
      control: 'select',
      options: ['default'],
    },
    size: {
      control: 'select',
      options: [
        'default',
        'sm',
        'lg',
      ],
    },
  },
  decorators: [
    Story => (
      <div className="p-12 bg-[var(--neumo-base)]">
        <Story />
      </div>
    ),

  ],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
}

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const WithIcon: Story = {
  args: {
    children:
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        With Icon
      </>,

  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),

}

export const InteractiveDemo: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Light Background</h3>
        <div className="p-8 bg-[oklch(0.92_0_0)] rounded-2xl space-y-4">
          <Button>Default</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Dark Background</h3>
        <div className="p-8 bg-[oklch(0.22_0_0)] rounded-2xl space-y-4">
          <Button>Default</Button>
        </div>
      </div>
    </div>
  ),

}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),

}
