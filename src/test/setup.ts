import '@testing-library/jest-dom'
import React from 'react'
import { beforeEach, vi } from 'vitest'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = '0px'
  readonly thresholds: ReadonlyArray<number> = []

  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => React.createElement('div', props),
    nav: (props: any) => React.createElement('nav', props),
    button: (props: any) => React.createElement('button', props),
    aside: (props: any) => React.createElement('aside', props),
    main: (props: any) => React.createElement('main', props),
    a: (props: any) => React.createElement('a', props),
    span: (props: any) => React.createElement('span', props),
    p: (props: any) => React.createElement('p', props),
    h1: (props: any) => React.createElement('h1', props),
    h2: (props: any) => React.createElement('h2', props),
    h3: (props: any) => React.createElement('h3', props),
    section: (props: any) => React.createElement('section', props),
    form: (props: any) => React.createElement('form', props),
    input: (props: any) => React.createElement('input', props),
    label: (props: any) => React.createElement('label', props),
    ul: (props: any) => React.createElement('ul', props),
    li: (props: any) => React.createElement('li', props),
    table: (props: any) => React.createElement('table', props),
    tr: (props: any) => React.createElement('tr', props),
    td: (props: any) => React.createElement('td', props),
    th: (props: any) => React.createElement('th', props),
    tbody: (props: any) => React.createElement('tbody', props),
    thead: (props: any) => React.createElement('thead', props),
    article: (props: any) => React.createElement('article', props),
    header: (props: any) => React.createElement('header', props),
    footer: (props: any) => React.createElement('footer', props),
  },
  AnimatePresence: (props: any) => props.children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
  useMotionValue: () => ({ get: vi.fn(), set: vi.fn() }),
  useSpring: () => ({ get: vi.fn(), set: vi.fn() }),
  useTransform: () => ({ get: vi.fn(), set: vi.fn() }),
}))

// Clean up after each test
beforeEach(() => {
  vi.clearAllMocks()
})
