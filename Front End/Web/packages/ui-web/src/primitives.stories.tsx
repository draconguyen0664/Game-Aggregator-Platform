import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inbox } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Select,
  Skeleton,
  Table,
} from "./primitives";

const meta = {
  title: "Foundation/Primitives",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  args: { children: "Create game" },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
    </div>
  ),
};

export const FormControls: Story = {
  args: { children: "Create game" },
  render: () => (
    <div className="grid max-w-sm gap-4">
      <Input label="Game name" placeholder="Enter a name" />
      <Input label="Slug" value="Invalid slug!" error="Use lowercase letters and hyphens." readOnly />
      <Select
        label="Environment"
        defaultValue="development"
        options={[
          { label: "Development", value: "development", description: "Local and shared development workloads" },
          { label: "Staging", value: "staging", description: "Pre-production verification" },
          { label: "Production", value: "production", description: "Customer-facing traffic" },
        ]}
        hint="Changing environments updates the active workspace."
      />
      <Select
        label="Tenant"
        placeholder="Select a tenant"
        options={[
          { label: "Northwind Games", value: "northwind" },
          { label: "Atlas Publishing", value: "atlas" },
          { label: "Archived tenant", value: "archived", disabled: true },
        ]}
        error="Select a tenant to continue."
      />
    </div>
  ),
};

export const DataDisplay: Story = {
  args: { children: "Create game" },
  render: () => (
    <div className="grid gap-6">
      <div className="flex gap-2">
        <Badge>Draft</Badge>
        <Badge tone="success">Active</Badge>
        <Badge tone="warning">Review</Badge>
        <Badge tone="danger">Blocked</Badge>
      </div>
      <Table>
        <thead><tr><th>Game</th><th>Status</th></tr></thead>
        <tbody><tr><td>Aurora Run</td><td><Badge tone="success">Live</Badge></td></tr></tbody>
      </Table>
      <Skeleton className="w-64" />
      <EmptyState
        icon={<Inbox size={24} />}
        title="No releases"
        description="Create a release to begin deployment."
        action={<Button size="sm">Create release</Button>}
      />
    </div>
  ),
};
