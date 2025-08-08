/**
 * Mock API service for simulating backend functionality
 * This will be replaced with real API calls when backend is ready
 */

import type { Currency } from '@/shared/types/business'
import type { OnboardingData } from '@/features/onboarding/types/onboarding'
import type { User } from '@/shared/types/auth'

// Mock database in memory
interface MockUser {
  id: string
  email: string
  password: string // In real app, this would be hashed
  firstName: string
  lastName: string
  phone: string
  accountType: 'personal' | 'business'
  role: 'admin' | 'user' | 'viewer' | 'member' | 'billing_manager'
  createdAt: string
  updatedAt: string
  onboardingCompleted: boolean
  onboardingData?: OnboardingData
  companyInfo?: {
    companyName: string
    registrationNumber: string
    taxId?: string
    currency: Currency
  }
  billingAddress?: {
    street: string
    street2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface MockSession {
  userId: string
  token: string
  expiresAt: string
}

// In-memory storage
class MockDatabase {
  private users: Map<string, MockUser> = new Map()
  private sessions: Map<string, MockSession> = new Map()

  // Initialize with some test data
  constructor() {
    this.seedData()
  }

  private seedData() {
    // Add a test user for development
    const testUser: MockUser = {
      id: 'test-user-1',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      accountType: 'business',
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingCompleted: true,
      onboardingData: {
        userInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@example.com',
          phone: '+1234567890',
        },
        organization: {
          companyName: 'Test Company',
          industry: 'technology',
          companySize: '11-50',
          website: 'https://test.com',
          country: 'US',
        },
        businessSettings: {
          currency: 'USD',
          timezone: 'America/New_York',
          fiscalYearStart: 'January',
        },
        address: {
          name: 'Headquarters',
          street: '123 Main St',
          addressLine1: '123 Main St',
          addressLine2: '',
          number: '101',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
          addressType: 'billing' as const,
          isPrimary: true,
        },
        products: {
          hasProducts: true,
          products: [
            {
              id: '1',
              name: 'Sample Product',
              description: 'A sample product for testing',
              price: 29.99,
            },
          ],
        },
        billing: {
          isConnected: true,
          provider: 'stripe',
        },
        team: {
          invitations: [
            {
              id: '1',
              email: 'colleague@test.com',
              role: 'member',
              status: 'pending',
            },
          ],
        },
      },
    }

    this.users.set(testUser.email, testUser)
  }

  // User methods
  createUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): MockUser {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    const user: MockUser = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
      role: userData.role || (userData.accountType === 'business' ? 'admin' : 'user'),
    }

    this.users.set(user.email, user)
    return user
  }

  getUserByEmail(email: string): MockUser | undefined {
    return this.users.get(email)
  }

  getUserById(id: string): MockUser | undefined {
    return Array.from(this.users.values()).find(user => user.id === id)
  }

  updateUser(id: string, updates: Partial<MockUser>): MockUser | undefined {
    const user = this.getUserById(id)
    if (!user) return undefined

    const updatedUser = { ...user, ...updates }
    this.users.set(user.email, updatedUser)
    return updatedUser
  }

  // Session methods
  createSession(userId: string): MockSession {
    const token = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const session: MockSession = {
      userId,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    this.sessions.set(token, session)
    return session
  }

  getSession(token: string): MockSession | undefined {
    const session = this.sessions.get(token)
    if (!session) return undefined

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      this.sessions.delete(token)
      return undefined
    }

    return session
  }

  deleteSession(token: string): void {
    this.sessions.delete(token)
  }

  // Utility methods
  getAllUsers(): MockUser[] {
    return Array.from(this.users.values())
  }

  clearAllData(): void {
    this.users.clear()
    this.sessions.clear()
    this.seedData()
  }
}

// Global instance
const mockDB = new MockDatabase()

// API response types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  accountType: 'personal' | 'business'
  companyInfo?: {
    companyName: string
    registrationNumber: string
    taxId?: string
    currency: Currency
  }
  billingAddress?: {
    street: string
    street2?: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface AuthResponse {
  user: Omit<MockUser, 'password'>
  token: string
}

// Utility function to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API methods
export const mockApi = {
  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    await delay(800) // Simulate network delay

    const { email, password } = credentials

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      }
    }

    const user = mockDB.getUserByEmail(email)
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    if (user.password !== password) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    const session = mockDB.createSession(user.id)
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token: session.token,
      },
      message: 'Login successful',
    }
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    await delay(1200) // Simulate network delay

    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      accountType,
      companyInfo,
      billingAddress,
    } = userData

    // Validation
    if (!email || !firstName || !lastName || !phone || !password) {
      return {
        success: false,
        error: 'All required fields must be provided',
      }
    }

    if (mockDB.getUserByEmail(email)) {
      return {
        success: false,
        error: 'An account with this email already exists',
      }
    }

    // Create user
    const newUser = mockDB.createUser({
      email,
      firstName,
      lastName,
      phone,
      password,
      accountType,
      role: accountType === 'business' ? 'admin' : 'user',
      onboardingCompleted: false,
      companyInfo,
      billingAddress,
    })

    const session = mockDB.createSession(newUser.id)
    const { password: _, ...userWithoutPassword } = newUser

    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token: session.token,
      },
      message: 'Registration successful',
    }
  },

  async logout(token: string): Promise<ApiResponse<null>> {
    await delay(300)

    mockDB.deleteSession(token)

    return {
      success: true,
      message: 'Logged out successfully',
    }
  },

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    await delay(200)

    const session = mockDB.getSession(token)
    if (!session) {
      return {
        success: false,
        error: 'Invalid or expired session',
      }
    }

    const user = mockDB.getUserById(session.userId)
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    // Map MockUser to User type
    const { password: _, ...userWithoutPassword } = user
    const mappedUser: User = userWithoutPassword as User

    return {
      success: true,
      data: mappedUser,
    }
  },

  // Onboarding endpoints
  async saveOnboardingData(
    token: string,
    onboardingData: OnboardingData
  ): Promise<ApiResponse<Omit<MockUser, 'password'>>> {
    await delay(600)

    const session = mockDB.getSession(token)
    if (!session) {
      return {
        success: false,
        error: 'Invalid or expired session',
      }
    }

    const updatedUser = mockDB.updateUser(session.userId, {
      onboardingData,
      onboardingCompleted: true,
    })

    if (!updatedUser) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    const { password: _, ...userWithoutPassword } = updatedUser

    return {
      success: true,
      data: userWithoutPassword,
      message: 'Onboarding data saved successfully',
    }
  },

  async updateProfile(
    token: string,
    updates: Partial<Pick<MockUser, 'firstName' | 'lastName' | 'phone'>>
  ): Promise<ApiResponse<Omit<MockUser, 'password'>>> {
    await delay(500)

    const session = mockDB.getSession(token)
    if (!session) {
      return {
        success: false,
        error: 'Invalid or expired session',
      }
    }

    const updatedUser = mockDB.updateUser(session.userId, updates)
    if (!updatedUser) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    const { password: _, ...userWithoutPassword } = updatedUser

    return {
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully',
    }
  },

  // Development utilities
  dev: {
    getAllUsers: () => mockDB.getAllUsers(),
    clearData: () => mockDB.clearAllData(),
    createTestUser: (userData: Partial<RegisterRequest>) => {
      const defaultData: RegisterRequest = {
        firstName: 'Test',
        lastName: 'User',
        email: 'dev@test.com',
        phone: '+1234567890',
        password: 'password123',
        accountType: 'business',
        ...userData,
      }
      return mockApi.register(defaultData)
    },
  },
}

// Export types for use in components
export type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse, MockUser }
