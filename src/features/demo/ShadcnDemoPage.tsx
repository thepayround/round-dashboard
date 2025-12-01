import { User, Mail, Lock, Calendar, Search, X } from 'lucide-react'
import { useState } from 'react'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { SimpleSelect } from '@/shared/ui/SimpleSelect'
import { Alert } from '@/shared/ui/shadcn/alert'
import { Avatar } from '@/shared/ui/shadcn/avatar'
import { Badge } from '@/shared/ui/shadcn/badge'
import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Separator } from '@/shared/ui/shadcn/separator'
import { Skeleton } from '@/shared/ui/shadcn/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table'
import { Textarea } from '@/shared/ui/shadcn/textarea'

export const ShadcnDemoPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <DashboardLayout>
      <div className="p-8 space-y-12 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground mb-2">
            Shadcn UI Components
          </h1>
          <p className="text-muted-foreground">
            Explore all the installed Shadcn components with your custom dark theme
          </p>
        </div>

        <Separator />

        {/* Buttons Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Buttons</h2>
            <p className="text-sm text-muted-foreground">
              Different button variants and sizes
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Sizes</h3>
              <div className="flex items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">With Icons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button variant="secondary">
                  <Lock className="mr-2 h-4 w-4" />
                  Secure
                </Button>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Inputs Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Inputs</h2>
            <p className="text-sm text-muted-foreground">
              Form inputs with labels and various states
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="search" placeholder="Search..." className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disabled">Disabled</Label>
              <Input id="disabled" placeholder="Disabled input" disabled />
            </div>
          </div>

          <div className="space-y-2 max-w-2xl">
            <Label htmlFor="textarea">Message</Label>
            <Textarea
              id="textarea"
              placeholder="Type your message here..."
              rows={4}
            />
          </div>
        </section>

        <Separator />

        {/* Select Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Select</h2>
            <p className="text-sm text-muted-foreground">
              Dropdown select component
            </p>
          </div>

          <div className="max-w-xs space-y-2">
            <Label htmlFor="select">Choose an option</Label>
            <SimpleSelect
              id="select"
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
                { value: 'option4', label: 'Option 4' }
              ]}
              value=""
              onChange={() => {}}
              placeholder="Select an option"
            />
          </div>
        </section>

        <Separator />

        {/* Cards Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Cards</h2>
            <p className="text-sm text-muted-foreground">
              Card components with different layouts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Card Title</h3>
                <p className="text-sm text-muted-foreground">
                  Card description goes here. This is a simple card component.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">User Name</h3>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Badge>Active</Badge>
                  <Badge variant="secondary">Pro</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Statistics</h3>
                  <Badge variant="outline">Live</Badge>
                </div>
                <div className="text-3xl font-medium">1,234</div>
                <p className="text-sm text-muted-foreground">
                  +12.5% from last month
                </p>
              </div>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Badges Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Badges</h2>
            <p className="text-sm text-muted-foreground">
              Status indicators and labels
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        <Separator />

        {/* Alerts Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Alerts</h2>
            <p className="text-sm text-muted-foreground">
              Informational alert messages
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <Alert>
              <User className="h-4 w-4" />
              <div>
                <h4 className="font-medium">Information</h4>
                <p className="text-sm text-muted-foreground">
                  This is an informational alert message.
                </p>
              </div>
            </Alert>

            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <div>
                <h4 className="font-medium">Error</h4>
                <p className="text-sm text-muted-foreground">
                  This is an error alert message.
                </p>
              </div>
            </Alert>
          </div>
        </section>

        <Separator />

        {/* Dialog Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Dialog</h2>
            <p className="text-sm text-muted-foreground">
              Modal dialog component
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a dialog description. You can put any content here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-dialog">Email</Label>
                  <Input id="email-dialog" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <Separator />

        {/* Table Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Table</h2>
            <p className="text-sm text-muted-foreground">
              Data table with rows and columns
            </p>
          </div>

          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">John Doe</TableCell>
                  <TableCell>
                    <Badge>Active</Badge>
                  </TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Jane Smith</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Pending</Badge>
                  </TableCell>
                  <TableCell>jane@example.com</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bob Johnson</TableCell>
                  <TableCell>
                    <Badge>Active</Badge>
                  </TableCell>
                  <TableCell>bob@example.com</TableCell>
                  <TableCell className="text-right">$350.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>

        <Separator />

        {/* Skeleton Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">Skeleton</h2>
            <p className="text-sm text-muted-foreground">
              Loading state placeholders
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => setIsLoading(!isLoading)}>
              {isLoading ? 'Hide Loading State' : 'Show Loading State'}
            </Button>
          </div>

          {isLoading && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Card>
          )}
        </section>

        <Separator />

        {/* Color System */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium tracking-tight mb-2">
              Design Tokens
            </h2>
            <p className="text-sm text-muted-foreground">
              All components use your custom dark theme color variables
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="h-16 bg-background rounded-lg border mb-2"></div>
              <div className="text-xs font-medium">background</div>
              <div className="text-xs text-muted-foreground">--bg (black)</div>
            </Card>

            <Card className="p-4">
              <div className="h-16 bg-primary rounded-lg mb-2"></div>
              <div className="text-xs font-medium">primary</div>
              <div className="text-xs text-muted-foreground">--primary (blue)</div>
            </Card>

            <Card className="p-4">
              <div className="h-16 bg-secondary rounded-lg mb-2"></div>
              <div className="text-xs font-medium">secondary</div>
              <div className="text-xs text-muted-foreground">--secondary (cyan)</div>
            </Card>

            <Card className="p-4">
              <div className="h-16 bg-accent rounded-lg mb-2"></div>
              <div className="text-xs font-medium">accent</div>
              <div className="text-xs text-muted-foreground">--accent (purple)</div>
            </Card>

            <Card className="p-4">
              <div className="h-16 bg-destructive rounded-lg mb-2"></div>
              <div className="text-xs font-medium">destructive</div>
              <div className="text-xs text-muted-foreground">Error red</div>
            </Card>

            <Card className="p-4">
              <div className="h-16 bg-muted rounded-lg border mb-2"></div>
              <div className="text-xs font-medium">muted</div>
              <div className="text-xs text-muted-foreground">--bg-subtle</div>
            </Card>

            <Card className="p-4">
              <div className="h-16 bg-card rounded-lg border mb-2"></div>
              <div className="text-xs font-medium">card</div>
              <div className="text-xs text-muted-foreground">Card background</div>
            </Card>

            <Card className="p-4">
              <div className="h-16 bg-input rounded-lg border mb-2"></div>
              <div className="text-xs font-medium">input</div>
              <div className="text-xs text-muted-foreground">Input background</div>
            </Card>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
