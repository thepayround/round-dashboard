import { useCallback, useMemo, useState } from 'react'

import { useGlobalToast } from '@/shared/contexts/ToastContext'
import { customerService } from '@/shared/services/api/customer.service'

interface UseEmailComposeModalControllerParams {
  customerId: string
  customerEmail: string
  customerName: string
  onClose: () => void
}

interface UseEmailComposeModalControllerReturn {
  formData: {
    to: string
    subject: string
    message: string
    isHtml: boolean
  }
  isSending: boolean
  templates: Array<{ key: string; label: string }>
  handleInputChange: (field: 'to' | 'subject' | 'message' | 'isHtml', value: string | boolean) => void
  handleToggleHtml: () => void
  handleInsertTemplate: (templateKey: string) => void
  handleSend: () => Promise<void>
  handleCancel: () => void
}

const TEMPLATE_MAP = (customerName: string) => ({
  greeting: `Hi ${customerName},\n\n`,
  followUp: `Hi ${customerName},\n\nI wanted to follow up on your recent inquiry. `,
  welcome: `Welcome to Round, ${customerName}!\n\nWe're excited to have you as part of our platform. `,
  support: `Hi ${customerName},\n\nI'm reaching out to help resolve any questions or concerns you may have. `,
})

export const useEmailComposeModalController = ({
  customerId,
  customerEmail,
  customerName,
  onClose,
}: UseEmailComposeModalControllerParams): UseEmailComposeModalControllerReturn => {
  const { showSuccess, showError } = useGlobalToast()
  const [formData, setFormData] = useState({
    to: customerEmail,
    subject: '',
    message: '',
    isHtml: false,
  })
  const [isSending, setIsSending] = useState(false)

  const templates = useMemo(
    () => [
      { key: 'greeting', label: 'Greeting' },
      { key: 'followUp', label: 'Follow Up' },
      { key: 'welcome', label: 'Welcome' },
      { key: 'support', label: 'Support' },
    ],
    []
  )

  const handleInputChange = useCallback(
    (field: 'to' | 'subject' | 'message' | 'isHtml', value: string | boolean) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const handleToggleHtml = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      isHtml: !prev.isHtml,
    }))
  }, [])

  const handleInsertTemplate = useCallback(
    (templateKey: string) => {
      const templateText = TEMPLATE_MAP(customerName)[templateKey as keyof ReturnType<typeof TEMPLATE_MAP>] ?? ''
      setFormData(prev => ({
        ...prev,
        message: templateText + prev.message,
      }))
    },
    [customerName]
  )

  const handleSend = useCallback(async () => {
    if (!formData.subject.trim() || !formData.message.trim()) {
      showError('Please fill in both subject and message')
      return
    }

    setIsSending(true)
    try {
      await customerService.sendEmail(customerId, {
        subject: formData.subject,
        message: formData.message,
        isHtml: formData.isHtml,
      })

      showSuccess(`Email sent to ${customerName}`)
      onClose()
      setFormData({
        to: customerEmail,
        subject: '',
        message: '',
        isHtml: false,
      })
    } catch (error) {
      console.error('Failed to send email:', error)
      showError('Failed to send email. Please try again.')
    } finally {
      setIsSending(false)
    }
  }, [customerEmail, customerId, customerName, formData, onClose, showError, showSuccess])

  const handleCancel = useCallback(() => {
    setFormData({
      to: customerEmail,
      subject: '',
      message: '',
      isHtml: false,
    })
    onClose()
  }, [customerEmail, onClose])

  return {
    formData,
    isSending,
    templates,
    handleInputChange,
    handleToggleHtml,
    handleInsertTemplate,
    handleSend,
    handleCancel,
  }
}
