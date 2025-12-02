# DataTable Component Guide

**Last Updated:** December 2, 2025

This guide covers the reusable `DataTable` component and its related utilities for building consistent, feature-rich data tables throughout the Round Dashboard.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Basic Usage](#basic-usage)
4. [Advanced Features](#advanced-features)
5. [Column Visibility Management](#column-visibility-management)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

---

## Overview

The `DataTable` component is a fully-featured, reusable table implementation built on TanStack React Table v8. It provides:

- **Sorting** - Click column headers to sort
- **Pagination** - Navigate through large datasets
- **Row Selection** - Select single or multiple rows
- **Column Visibility** - Show/hide columns dynamically
- **Search/Filtering** - Filter data by text search
- **Row Actions** - Click handlers for row interactions
- **Loading States** - Built-in loading UI
- **Responsive Design** - Works on all screen sizes
- **Minimal Scrollbar** - Thin, styled horizontal scrollbar

**Location:** `src/shared/ui/DataTable/`

---

## Core Components

### DataTable

The main table component with all features.

**Path:** `src/shared/ui/DataTable/DataTable.tsx`

```tsx
import { DataTable } from '@/shared/ui/DataTable/DataTable'
```

### SortableHeader

Reusable sortable column header with arrow indicators.

**Path:** `src/shared/ui/DataTable/SortableHeader.tsx`

```tsx
import { SortableHeader } from '@/shared/ui/DataTable/DataTable'
```

### ColumnVisibilityToggle

Standalone dropdown for controlling column visibility.

**Path:** Exported from `DataTable.tsx`

```tsx
import { ColumnVisibilityToggle } from '@/shared/ui/DataTable/DataTable'
```

### DataTableSelectColumn

Helper for adding a selection checkbox column.

**Path:** Exported from `DataTable.tsx`

```tsx
import { DataTableSelectColumn } from '@/shared/ui/DataTable/DataTable'
```

---

## Basic Usage

### Minimal Example

```tsx
import { DataTable } from '@/shared/ui/DataTable/DataTable'
import type { ColumnDef } from '@tanstack/react-table'

interface User {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
]

function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      data={users}
      columns={columns}
      isLoading={false}
    />
  )
}
```

### With Sortable Headers

```tsx
import { DataTable, SortableHeader } from '@/shared/ui/DataTable/DataTable'

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <SortableHeader column={column}>Email</SortableHeader>
    ),
    cell: ({ row }) => row.original.email,
  },
]
```

### With Row Click Handler

```tsx
<DataTable
  data={users}
  columns={columns}
  onRowClick={(user) => navigate(`/users/${user.id}`)}
/>
```

---

## Advanced Features

### Row Selection

Enable row selection with checkboxes:

```tsx
import { DataTable, DataTableSelectColumn } from '@/shared/ui/DataTable/DataTable'

const [selectedIds, setSelectedIds] = useState<string[]>([])

const columns: ColumnDef<User>[] = [
  DataTableSelectColumn<User>(),
  // ... other columns
]

<DataTable
  data={users}
  columns={columns}
  enableRowSelection={true}
  // Selection is managed internally by TanStack Table
/>
```

### Custom Cell Rendering

```tsx
{
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.original.status
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    )
  }
}
```

### Non-Hideable Columns

Mark essential columns that should always be visible:

```tsx
{
  accessorKey: 'id',
  header: 'ID',
  enableHiding: false, // ← Cannot be hidden
}
```

### Actions Column

Add a dropdown menu for row actions:

```tsx
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'

{
  id: 'actions',
  header: () => <div className="text-right">Actions</div>,
  cell: ({ row }) => {
    const item = row.original
    return (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(item)}>
              <Edit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(item)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
  enableSorting: false,
  enableHiding: false, // Actions should always be visible
}
```

---

## Column Visibility Management

### Internal Column Visibility (Simple)

For simple tables, use the built-in column visibility toggle:

```tsx
<DataTable
  data={users}
  columns={columns}
  showColumnVisibility={true} // Shows column toggle button in table
  initialColumnVisibility={{
    email: true,
    phoneNumber: false, // Hidden by default
  }}
/>
```

### External Column Visibility (Advanced)

For tables integrated with `SearchFilterToolbar`, manage visibility externally:

```tsx
import { useState } from 'react'
import { DataTable, ColumnVisibilityToggle } from '@/shared/ui/DataTable/DataTable'
import { SearchFilterToolbar } from '@/shared/widgets/SearchFilterToolbar'
import type { VisibilityState } from '@/shared/ui/DataTable/DataTable'

function AdvancedTable() {
  // 1. Manage column visibility state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true,
    name: true,
    email: true,
    phoneNumber: false,
    createdDate: false,
  })

  // 2. Create column definitions for the toggle (exclude non-hideable columns)
  const columnDefinitions = [
    { id: 'email', visible: columnVisibility.email !== false },
    { id: 'phoneNumber', visible: columnVisibility.phoneNumber !== false },
    { id: 'createdDate', visible: columnVisibility.createdDate !== false },
  ]

  const handleColumnToggle = (columnId: string, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [columnId]: visible }))
  }

  return (
    <>
      <SearchFilterToolbar
        {/* ... other props */}
        columnsToggle={
          <ColumnVisibilityToggle
            columns={columnDefinitions}
            onToggle={handleColumnToggle}
          />
        }
      />

      <DataTable
        data={users}
        columns={columns}
        showColumnVisibility={false} // Managed externally
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
    </>
  )
}
```

**When to use external column visibility:**
- Tables integrated with `SearchFilterToolbar`
- Need column visibility alongside other toolbar controls
- Want consistent positioning with other action buttons

---

## Best Practices

### 1. **Column Configuration**

```tsx
// ✅ GOOD: Clear, semantic column definitions
const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground font-mono">
        {row.original.id}
      </div>
    ),
    enableHiding: false, // Always visible
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => row.original.name,
    enableHiding: false, // Always visible
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
    cell: ({ row }) => row.original.email,
    // Hideable - user can toggle this column
  },
]

// ❌ BAD: All columns hideable, no sorting
const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'id',
    header: 'ID', // No sorting capability
  },
]
```

### 2. **Essential Columns**

Always mark these as `enableHiding: false`:
- **ID/Primary Key** - User needs to identify records
- **Name/Title** - Main descriptor of the entity
- **Actions** - User needs to interact with rows

### 3. **Loading States**

```tsx
// ✅ GOOD: Pass loading state to DataTable
<DataTable
  data={customers}
  columns={columns}
  isLoading={loading || fetchingMore}
/>
```

### 4. **Empty States**

```tsx
// ✅ GOOD: Custom empty message
<DataTable
  data={customers}
  columns={columns}
  emptyMessage="No customers found. Try adjusting your filters."
/>
```

### 5. **Performance**

```tsx
// ✅ GOOD: Memoize columns to prevent re-creation
const columns = useMemo<ColumnDef<Customer>[]>(() => [
  // ... column definitions
], []) // Empty deps since columns don't change

// ❌ BAD: Columns recreated on every render
const columns: ColumnDef<Customer>[] = [
  // ... column definitions
]
```

### 6. **Pagination**

```tsx
// ✅ GOOD: Appropriate page size
<DataTable
  data={customers}
  columns={columns}
  pageSize={12} // Good default
  showPagination={true}
/>
```

### 7. **Scrollbar Styling**

The DataTable automatically applies minimal scrollbar styling via the `scrollbar-thin` class:

```css
/* Automatically applied in index.css */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
```

---

## Examples

### CustomerTable (Production Example)

The Customers page demonstrates all advanced features:

**File:** `src/features/customers/components/CustomerTable.tsx`

Features demonstrated:
- ✅ Sortable columns with `SortableHeader`
- ✅ Row selection for bulk operations
- ✅ Row click navigation
- ✅ Non-hideable essential columns (ID, Customer, Actions)
- ✅ Custom cell rendering (Badges, Avatars)
- ✅ Actions dropdown (Edit, Duplicate, Delete)
- ✅ External column visibility management
- ✅ Integration with `SearchFilterToolbar`
- ✅ 17 total columns with smart defaults

### Complete Working Example

```tsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2, MoreHorizontal } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import {
  DataTable,
  DataTableSelectColumn,
  SortableHeader,
  ColumnVisibilityToggle,
  type VisibilityState,
} from '@/shared/ui/DataTable/DataTable'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu'
import { SearchFilterToolbar } from '@/shared/widgets/SearchFilterToolbar'

interface Product {
  id: string
  name: string
  price: number
  status: 'active' | 'inactive'
  category: string
}

function ProductsTable({ products, isLoading }: {
  products: Product[]
  isLoading: boolean
}) {
  const navigate = useNavigate()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true,
    name: true,
    price: true,
    status: true,
    category: false, // Hidden by default
  })

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    // ID - Always visible
    {
      accessorKey: 'id',
      header: ({ column }) => <SortableHeader column={column}>ID</SortableHeader>,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground font-mono">
          {row.original.id}
        </div>
      ),
      enableHiding: false,
    },
    // Name - Always visible
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
      enableHiding: false,
    },
    // Price - Hideable
    {
      accessorKey: 'price',
      header: ({ column }) => <SortableHeader column={column}>Price</SortableHeader>,
      cell: ({ row }) => (
        <div className="text-sm">${row.original.price.toFixed(2)}</div>
      ),
    },
    // Status - Hideable
    {
      accessorKey: 'status',
      header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    // Category - Hideable
    {
      accessorKey: 'category',
      header: ({ column }) => <SortableHeader column={column}>Category</SortableHeader>,
      cell: ({ row }) => row.original.category,
    },
    // Actions - Always visible
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/products/${product.id}/edit`)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ], [navigate])

  const columnDefinitions = [
    { id: 'price', visible: columnVisibility.price !== false },
    { id: 'status', visible: columnVisibility.status !== false },
    { id: 'category', visible: columnVisibility.category !== false },
  ]

  const handleColumnToggle = (columnId: string, visible: boolean) => {
    setColumnVisibility(prev => ({ ...prev, [columnId]: visible }))
  }

  return (
    <div className="space-y-4">
      <SearchFilterToolbar
        searchQuery=""
        onSearchChange={() => {}}
        showFilters={false}
        onToggleFilters={() => {}}
        columnsToggle={
          <ColumnVisibilityToggle
            columns={columnDefinitions}
            onToggle={handleColumnToggle}
          />
        }
      />

      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        onRowClick={(product) => navigate(`/products/${product.id}`)}
        showPagination={true}
        showSearch={false}
        showColumnVisibility={false}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        pageSize={12}
      />
    </div>
  )
}
```

---

## API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData>[]` | **Required** | Column definitions |
| `data` | `TData[]` | **Required** | Array of data to display |
| `searchKey` | `string` | - | Key to use for global search |
| `searchPlaceholder` | `string` | `'Search...'` | Placeholder for search input |
| `pageSize` | `number` | `10` | Number of rows per page |
| `showPagination` | `boolean` | `true` | Show pagination controls |
| `showSearch` | `boolean` | `true` | Show search input |
| `enableRowSelection` | `boolean` | `false` | Enable row selection checkboxes |
| `onRowClick` | `(row: TData) => void` | - | Callback when row is clicked |
| `isLoading` | `boolean` | `false` | Show loading state |
| `className` | `string` | - | Custom className for container |
| `emptyMessage` | `string` | `'No results found.'` | Message when no data |
| `showColumnVisibility` | `boolean` | `false` | Show internal column toggle |
| `initialColumnVisibility` | `VisibilityState` | `{}` | Initial column visibility (uncontrolled) |
| `columnVisibility` | `VisibilityState` | - | Controlled column visibility |
| `onColumnVisibilityChange` | `(visibility: VisibilityState) => void` | - | Callback when visibility changes |

### SortableHeader Props

| Prop | Type | Description |
|------|------|-------------|
| `column` | `{ toggleSorting, getIsSorted }` | TanStack Table column object |
| `children` | `React.ReactNode` | Column header text/content |
| `className` | `string` | Optional custom className |

### ColumnVisibilityToggle Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `Array<{ id: string; visible: boolean }>` | Column definitions |
| `onToggle` | `(columnId: string, visible: boolean) => void` | Toggle callback |

---

## Related Documentation

- [UI Standards](./UI_STANDARDS.md) - General UI/UX standards
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Code quality standards
- [TanStack Table Docs](https://tanstack.com/table/latest) - Official library docs
