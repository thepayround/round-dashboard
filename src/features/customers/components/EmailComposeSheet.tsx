import { Bold, Italic, Link as LinkIcon, Mail, Paperclip, Type } from 'lucide-react'

import { useEmailComposeModalController } from '../hooks/useEmailComposeModalController'

import { FormSheet } from '@/shared/ui/FormSheet'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { Textarea } from '@/shared/ui/shadcn/textarea'

interface EmailComposeSheetProps {
  isOpen: boolean
  onClose: () => void
  customerEmail: string
  customerName: string
  customerId: string
}

export const EmailComposeSheet = ({
  isOpen,
  onClose,
  customerEmail,
  customerName,
  customerId,
}: EmailComposeSheetProps) => {
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

  const isValid = formData.subject.trim() && formData.message.trim()

  return (
    <FormSheet
      open={isOpen}
      onOpenChange={handleCancel}
      title="Compose Email"
      description={`Send email to ${customerName}`}
      size="lg"
      submitLabel="Send Email"
      onSubmit={handleSend}
      isSubmitting={isSending}
      isSubmitDisabled={!isValid}
    >
      <div className="space-y-6">
        {/* To Field */}
        <div className="space-y-2">
          <Label htmlFor="email-to">To</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email-to"
              type="email"
              value={formData.to}
              onChange={e => handleInputChange('to', e.target.value)}
              placeholder="customer@example.com"
              className="pl-10"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="email-subject">
            Subject<span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="email-subject"
            value={formData.subject}
            onChange={e => handleInputChange('subject', e.target.value)}
            placeholder="Enter email subject..."
          />
        </div>

        {/* Quick Templates */}
        <div className="space-y-2">
          <Label>Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
            {templates.map(template => (
              <Button
                key={template.key}
                type="button"
                onClick={() => handleInsertTemplate(template.key)}
                variant="outline"
                size="sm"
              >
                {template.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="message-textarea">
              Message<span className="text-destructive ml-1">*</span>
            </Label>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                onClick={handleToggleHtml}
                variant={formData.isHtml ? 'secondary' : 'ghost'}
                size="sm"
              >
                <Type className="mr-1.5 h-3.5 w-3.5" />
                HTML
              </Button>
              {formData.isHtml && (
                <>
                  <Button type="button" variant="ghost" size="icon">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <Textarea
            id="message-textarea"
            value={formData.message}
            onChange={e => handleInputChange('message', e.target.value)}
            rows={10}
            placeholder="Write your message..."
            className="resize-none"
          />
        </div>

        {/* Attachment Button */}
        <Button type="button" variant="ghost" size="sm">
          <Paperclip className="mr-2 h-4 w-4" />
          Add Attachment
        </Button>

        {/* Info Note */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          This email will be logged in the customer&apos;s activity history
        </div>
      </div>
    </FormSheet>
  )
}
