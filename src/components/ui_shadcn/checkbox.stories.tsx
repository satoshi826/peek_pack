import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta = {
  title: 'Shadcn/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Checkbox />,
}

export const Checked: Story = {
  render: () => <Checkbox defaultChecked />,
}

export const Disabled: Story = {
  render: () => <Checkbox disabled />,
}

export const DisabledChecked: Story = {
  render: () => <Checkbox disabled defaultChecked />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),

}

export const Invalid: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="invalid" aria-invalid />
      <Label htmlFor="invalid">This field is required</Label>
    </div>
  ),

}
