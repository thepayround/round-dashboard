import { Send, Paperclip, Type, Bold, Italic, Link as LinkIcon, Mail, FileText, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

import { Modal } from '@/shared/components/Modal'
import { FormInput } from '@/shared/components/ui/FormInput'
import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'

interface EmailComposeModalProps {
  isOpen: boolean
  onClose: () => void
  customerEmail: string
  customerName: string
  customerId: string
}

export const EmailComposeModal: React.FC<EmailComposeModalProps> = ({
  isOpen,
  onClose,
  customerEmail,
  customerName,
  customerId
}) => {
  const { showSuccess, showError } = useGlobalToast()
  const [formData, setFormData] = useState({
    to: customerEmail,
    subject: '',
    message: '',
    isHtml: false
  })
  const [isSending, setIsSending] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSend = async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      showError('Please fill in both subject and message')
      return
    }

    setIsSending(true)
    try {
      await customerService.sendEmail(customerId, {
        subject: formData.subject,
        message: formData.message,
        isHtml: formData.isHtml
      })
      
      showSuccess(`Email sent to ${customerName}`)
      onClose()
      
      // Reset form
      setFormData({
        to: customerEmail,
        subject: '',
        message: '',
        isHtml: false
      })
    } catch (error) {
      console.error('Failed to send email:', error)
      showError('Failed to send email. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const insertTemplate = (template: string) => {
    const templates = {
      greeting: `Hi ${customerName},\n\n`,
      followUp: `Hi ${customerName},\n\nI wanted to follow up on your recent inquiry. `,
      welcome: `Welcome to Round, ${customerName}!\n\nWe're excited to have you as part of our platform. `,
      support: `Hi ${customerName},\n\nI'm reaching out to help resolve any questions or concerns you may have. `
    }
    
    const templateText = templates[template as keyof typeof templates] || ''
    setFormData(prev => ({ 
      ...prev, 
      message: templateText + prev.message 
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Compose Email"
      subtitle={`Send email to ${customerName}`}
      size="lg"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Email Details */}
              <div className="space-y-4">
                <FormInput
                  label="To"
                  type="email"
                  leftIcon={Mail}
                  value={formData.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  placeholder="customer@example.com"
                />
                
                <FormInput
                  label={<span>Subject <span className="text-[#D417C8]">*</span></span>}
                  leftIcon={FileText}
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Enter email subject..."
                  required
                />
              </div>

              {/* Quick Templates */}
              <div>
                <span className="auth-label mb-2 block">
                  Quick Templates
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'greeting', label: 'Greeting' },
                    { key: 'followUp', label: 'Follow Up' },
                    { key: 'welcome', label: 'Welcome' },
                    { key: 'support', label: 'Support' }
                  ].map((template) => (
                    <button
                      key={template.key}
                      onClick={() => insertTemplate(template.key)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/70 text-xs rounded-lg hover:bg-white/8 hover:text-white transition-all duration-200"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="auth-label" htmlFor="message-textarea">
                    Message <span className="text-[#D417C8]">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange('isHtml', !formData.isHtml)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-all duration-200 ${
                        formData.isHtml 
                          ? 'bg-[#14BDEA]/20 text-[#14BDEA] border border-[#14BDEA]/30' 
                          : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/8 hover:text-white'
                      }`}
                    >
                      <Type className="w-3 h-3" />
                      HTML
                    </button>
                    {formData.isHtml && (
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-200">
                          <Bold className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-200">
                          <Italic className="w-3 h-3" />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-200">
                          <LinkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <textarea
                  id="message-textarea"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={12}
                  className="auth-input textarea resize-none"
                  placeholder="Write your message..."
                  required
                />
              </div>

              {/* Attachment placeholder */}
              <div>
                <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:bg-white/8 hover:text-white transition-all duration-200">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-sm">Add Attachment</span>
                </button>
              </div>
          </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 bg-gray-900/50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">
                  This email will be logged in the customer&apos;s activity history
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    disabled={isSending}
                    className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending || !formData.subject.trim() || !formData.message.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg hover:shadow-[#D417C8]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
      </div>
    </Modal>
  )
}