import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Button } from './button'

const meta = {
  title: 'Neumorphic/Card',
  component: Card,
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
      <div className="p-12 bg-(--neumo-base)">
        <Story />
      </div>
    ),

  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),

}

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>A card without footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card demonstrates the layout without a footer section.</p>
      </CardContent>
    </Card>
  ),

}

export const WithList: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Features</CardTitle>
        <CardDescription>Key features of this product</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          <li>Feature one</li>
          <li>Feature two</li>
          <li>Feature three</li>
        </ul>
      </CardContent>
    </Card>
  ),

}

export const Inset: Story = {
  render: () => (
    <Card variant="inset" className="w-[350px]">
      <CardHeader>
        <CardTitle>Inset Card</CardTitle>
        <CardDescription>窪んだカード</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card appears recessed into the surface.</p>
      </CardContent>
    </Card>
  ),

}

export const RaisedVsInset: Story = {
  render: () => (
    <div className="flex gap-8">
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Raised</CardTitle>
          <CardDescription>デフォルト（凸）</CardDescription>
        </CardHeader>
        <CardContent>
          <p>浮き出たカード</p>
        </CardContent>
      </Card>
      <Card variant="inset" className="w-[250px]">
        <CardHeader>
          <CardTitle>Inset</CardTitle>
          <CardDescription>窪み（凹）</CardDescription>
        </CardHeader>
        <CardContent>
          <p>窪んだカード</p>
        </CardContent>
      </Card>
    </div>
  ),

}

export const MultipleCards: Story = {
  render: () => (
    <div className="flex gap-6">
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the first card.</p>
        </CardContent>
      </Card>
      <Card className="w-[250px]">
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the second card.</p>
        </CardContent>
      </Card>
    </div>
  ),

}
