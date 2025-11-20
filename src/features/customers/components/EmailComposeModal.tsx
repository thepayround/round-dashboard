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

import { Button, IconButton } from '@/shared/ui/Button'
import { FormInput } from '@/shared/ui/FormInput'
import { Modal } from '@/shared/ui/Modal'
import { Textarea } from '@/shared/ui/Textarea'


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
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Compose Email"
      subtitle={`Send email to ${customerName}`}
      icon={Mail}
      size="lg"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <FormInput
            label="To"
            type="email"
            leftIcon={Mail}
            value={formData.to}
            onChange={event => handleInputChange('to', event.target.value)}
            placeholder="customer@example.com"
          />

          <FormInput
            label={
              <span>
                Subject <span className="text-primary">*</span>
              </span>
            }
            leftIcon={FileText}
            value={formData.subject}
            onChange={event => handleInputChange('subject', event.target.value)}
            placeholder="Enter email subject..."
            required
          />
        </div>

        <div>
          <span className="auth-label mb-2 block">Quick Templates</span>
          <div className="flex flex-wrap gap-2">
            {templates.map(template => (
              <Button key={template.key} onClick={() => handleInsertTemplate(template.key)} variant="ghost" size="sm">
                {template.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <Textarea
                id="message-textarea"
                label={
                  <span>
                    Message <span className="text-primary">*</span>
                  </span>
                }
                value={formData.message}
                onChange={event => handleInputChange('message', event.target.value)}
                rows={12}
                placeholder="Write your message..."
                required
              />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                type="button"
                onClick={handleToggleHtml}
                variant={formData.isHtml ? 'primary' : 'ghost'}
                size="sm"
                icon={Type}
                iconPosition="left"
                className={formData.isHtml ? 'bg-secondary/20 text-secondary border-secondary/30' : ''}
              >
                HTML
              </Button>
              {formData.isHtml && (
                <div className="flex items-center gap-1">
                  <IconButton icon={Bold} aria-label="Bold" size="sm" />
                  <IconButton icon={Italic} aria-label="Italic" size="sm" />
                  <IconButton icon={LinkIcon} aria-label="Insert link" size="sm" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <Button variant="ghost" icon={Paperclip} iconPosition="left">
            Add Attachment
          </Button>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-white/60">
            This email will be logged in the customer&apos;s activity history
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleCancel} disabled={isSending} variant="ghost">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !formData.subject.trim() || !formData.message.trim()}
              variant="primary"
              icon={Send}
              iconPosition="left"
              isLoading={isSending}
            >
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
