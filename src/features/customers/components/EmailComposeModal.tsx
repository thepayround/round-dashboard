import {
  Send,
  Paperclip,
  Type,
  Bold,
  Italic,
  Link as LinkIcon,
  Mail,
  FileText,
} from 'lucide-react'

import { useEmailComposeModalController } from '../hooks/useEmailComposeModalController'

import { Button } from '@/shared/ui/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/shadcn/dialog'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Textarea } from '@/shared/ui/shadcn/textarea'


interface EmailComposeModalProps {
  isOpen: boolean
  onClose: () => void
  customerEmail: string
  customerName: string
  customerId: string
}

export const EmailComposeModal = ({
  isOpen,
  onClose,
  customerEmail,
  customerName,
  customerId,
}: EmailComposeModalProps) => {
  const {
    formData,
    isSending,
    templates,
    handleInputChange,
    handleToggleHtml,
    handleInsertTemplate,
    handleSend,
    handleCancel,
  } = useEmailComposeModalController({
    customerId,
    customerEmail,
    customerName,
    onClose,
  })

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Compose Email</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Send email to {customerName}</p>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">To</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email-to"
                  type="email"
                  value={formData.to}
                  onChange={event => handleInputChange('to', event.target.value)}
                  placeholder="customer@example.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-subject">
                Subject<span className="text-destructive"> *</span>
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email-subject"
                  value={formData.subject}
                  onChange={event => handleInputChange('subject', event.target.value)}
                  placeholder="Enter email subject..."
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Templates</Label>
            <div className="flex flex-wrap gap-2">
              {templates.map(template => (
                <Button
                  key={template.key}
                  type="button"
                  onClick={() => handleInsertTemplate(template.key)}
                  variant="ghost"
                  size="sm"
                >
                  {template.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message-textarea">
                Message<span className="text-destructive"> *</span>
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleToggleHtml}
                  variant={formData.isHtml ? 'default' : 'ghost'}
                  size="sm"
                  className={formData.isHtml ? 'bg-secondary/20 text-secondary border-secondary/30' : ''}
                >
                  <Type className="mr-2 h-4 w-4" />
                  HTML
                </Button>
                {formData.isHtml && (
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" aria-label="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" aria-label="Insert link">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Textarea
              id="message-textarea"
              value={formData.message}
              onChange={event => handleInputChange('message', event.target.value)}
              rows={12}
              placeholder="Write your message..."
              className="resize-none"
              required
            />
          </div>

          <div>
            <Button type="button" variant="ghost">
              <Paperclip className="mr-2 h-4 w-4" />
              Add Attachment
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                This email will be logged in the customer&apos;s activity history
              </div>
              <div className="flex items-center space-x-3">
                <Button type="button" onClick={handleCancel} disabled={isSending} variant="ghost">
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending || !formData.subject.trim() || !formData.message.trim()}
                >
                  {isSending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
