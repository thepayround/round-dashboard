import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { EditCustomerModal } from '../EditCustomerModal'

import { CustomerStatus, CustomerType } from '@/shared/services/api/customer.service'
import type { CustomerResponse } from '@/shared/services/api/customer.service'

const mockCustomer: CustomerResponse = {
  id: 'cust_123',
  type: CustomerType.Individual,
  effectiveDisplayName: 'John Doe',
  isBusinessCustomer: false,
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  company: '',
  phoneNumber: '+15555555555',
  phoneNumberConfirmed: true,
  taxNumber: '',
  locale: 'en',
  timezone: 'UTC',
  currency: 'USD',
  status: CustomerStatus.Active,
  signupDate: new Date().toISOString(),
  lastActivityDate: new Date().toISOString(),
  portalAccess: true,
  autoCollection: true,
  tags: ['vip'],
  customFields: {},
  createdDate: new Date().toISOString(),
  modifiedDate: new Date().toISOString(),
  billingAddress: {
    id: 'addr_1',
    type: 'billing',
    isPrimary: true,
    line1: '123 Main St',
    city: 'City',
    country: 'US',
    zipCode: '12345',
    state: 'CA',
  },
  shippingAddress: {
    id: 'addr_2',
    type: 'shipping',
    isPrimary: false,
    line1: '456 Other St',
    city: 'City',
    country: 'US',
    zipCode: '67890',
    state: 'CA',
  },
  allAddresses: [],
  notes: [],
}

describe('EditCustomerModal', () => {
  it('renders when open', () => {
    const { getByText } = render(
      <EditCustomerModal
        isOpen
        onClose={() => {}}
        customer={mockCustomer}
        onCustomerUpdated={() => {}}
      />
    )

    expect(getByText('Edit Customer')).toBeInTheDocument()
  })
})
