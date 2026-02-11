import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Card } from './card'
import { Typography } from './typography'

const meta = {
  title: 'Foundation/CSS Variables',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const ColorSwatch = ({ name, variable }: { name: string
  variable: string; }) => (
  <div className="flex items-center gap-3 p-3 rounded-md border">
    <div
      className="size-12 rounded-md border shadow-sm shrink-0"
      style={{ backgroundColor: `var(${variable})` }}
    />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium truncate">{name}</p>
      <p className="text-xs text-muted-foreground font-mono truncate">{variable}</p>
    </div>
  </div>
)

const RadiusSwatch = ({ name, variable }: { name: string
  variable: string; }) => (
  <div className="flex items-center gap-3 p-3 rounded-md border">
    <div
      className="size-12 bg-primary shrink-0"
      style={{ borderRadius: `var(${variable})` }}
    />
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium truncate">{name}</p>
      <p className="text-xs text-muted-foreground font-mono truncate">{variable}</p>
    </div>
  </div>
)

export const ColorTokens: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-4">Color Tokens</Typography>
        <Typography variant="muted" className="mb-6">
          デザインシステムで使用されている全てのカラートークンの一覧です。
        </Typography>
      </div>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Base Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Background" variable="--background" />
          <ColorSwatch name="Foreground" variable="--foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Card Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Card" variable="--card" />
          <ColorSwatch name="Card Foreground" variable="--card-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Popover Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Popover" variable="--popover" />
          <ColorSwatch name="Popover Foreground" variable="--popover-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Primary Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Primary" variable="--primary" />
          <ColorSwatch name="Primary Foreground" variable="--primary-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Secondary Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Secondary" variable="--secondary" />
          <ColorSwatch name="Secondary Foreground" variable="--secondary-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Muted Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Muted" variable="--muted" />
          <ColorSwatch name="Muted Foreground" variable="--muted-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Accent Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Accent" variable="--accent" />
          <ColorSwatch name="Accent Foreground" variable="--accent-foreground" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Destructive Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Destructive" variable="--destructive" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Border & Input</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Border" variable="--border" />
          <ColorSwatch name="Input" variable="--input" />
          <ColorSwatch name="Ring" variable="--ring" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Chart Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Chart 1" variable="--chart-1" />
          <ColorSwatch name="Chart 2" variable="--chart-2" />
          <ColorSwatch name="Chart 3" variable="--chart-3" />
          <ColorSwatch name="Chart 4" variable="--chart-4" />
          <ColorSwatch name="Chart 5" variable="--chart-5" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Sidebar Colors</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ColorSwatch name="Sidebar" variable="--sidebar" />
          <ColorSwatch name="Sidebar Foreground" variable="--sidebar-foreground" />
          <ColorSwatch name="Sidebar Primary" variable="--sidebar-primary" />
          <ColorSwatch name="Sidebar Primary Foreground" variable="--sidebar-primary-foreground" />
          <ColorSwatch name="Sidebar Accent" variable="--sidebar-accent" />
          <ColorSwatch name="Sidebar Accent Foreground" variable="--sidebar-accent-foreground" />
          <ColorSwatch name="Sidebar Border" variable="--sidebar-border" />
          <ColorSwatch name="Sidebar Ring" variable="--sidebar-ring" />
        </div>
      </Card>
    </div>
  ),

}

export const BorderRadius: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-4">Border Radius Tokens</Typography>
        <Typography variant="muted" className="mb-6">
          デザインシステムで使用されている全てのボーダーラディウストークンの一覧です。
        </Typography>
      </div>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Radius Scales</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <RadiusSwatch name="Small (--radius - 4px)" variable="--radius-sm" />
          <RadiusSwatch name="Medium (--radius - 2px)" variable="--radius-md" />
          <RadiusSwatch name="Large (--radius)" variable="--radius-lg" />
          <RadiusSwatch name="Extra Large (--radius + 4px)" variable="--radius-xl" />
          <RadiusSwatch name="2XL (--radius + 8px)" variable="--radius-2xl" />
          <RadiusSwatch name="3XL (--radius + 12px)" variable="--radius-3xl" />
          <RadiusSwatch name="4XL (--radius + 16px)" variable="--radius-4xl" />
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Visual Comparison</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'SM',
              var: '--radius-sm' },
            { label: 'MD',
              var: '--radius-md' },
            { label: 'LG',
              var: '--radius-lg' },
            { label: 'XL',
              var: '--radius-xl' },
            { label: '2XL',
              var: '--radius-2xl' },
            { label: '3XL',
              var: '--radius-3xl' },
            { label: '4XL',
              var: '--radius-4xl' },
          ].map(({ label, 'var': variable }) => (
            <div key={label} className="text-center">
              <div
                className="w-full aspect-square bg-primary mb-2"
                style={{ borderRadius: `var(${variable})` }}
              />
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground font-mono">{variable}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  ),

}

export const AllTokens: Story = {
  render: () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Typography variant="h2" className="mb-4">All Design Tokens</Typography>
        <Typography variant="muted" className="mb-6">
          デザインシステムで使用されている全てのデザイントークンの概要です。
        </Typography>
      </div>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Colors</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            '--background',
            '--foreground',
            '--card',
            '--card-foreground',
            '--popover',
            '--popover-foreground',
            '--primary',
            '--primary-foreground',
            '--secondary',
            '--secondary-foreground',
            '--muted',
            '--muted-foreground',
            '--accent',
            '--accent-foreground',
            '--destructive',
            '--border',
            '--input',
            '--ring',
          ].map(variable => (
            <div key={variable} className="text-center">
              <div
                className="w-full aspect-square rounded-md border shadow-sm mb-1"
                style={{ backgroundColor: `hsl(var(${variable}))` }}
              />
              <p className="text-xs font-mono truncate" title={variable}>
                {variable.replace(
                  '--',
                  '',
                )}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <Typography variant="h3" className="mb-4">Border Radius</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            '--radius-sm',
            '--radius-md',
            '--radius-lg',
            '--radius-xl',
            '--radius-2xl',
            '--radius-3xl',
            '--radius-4xl',
          ].map(variable => (
            <div key={variable} className="text-center">
              <div
                className="w-full aspect-square bg-primary mb-1"
                style={{ borderRadius: `var(${variable})` }}
              />
              <p className="text-xs font-mono truncate" title={variable}>
                {variable.replace(
                  '--radius-',
                  '',
                )}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  ),

}
