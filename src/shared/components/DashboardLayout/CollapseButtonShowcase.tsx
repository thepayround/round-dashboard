import { useState } from 'react'
import { CollapseButton } from './CollapseButtonDesigns'
import { Card } from '../Card'

/**
 * Showcase component to preview all 5 collapse button designs
 * This component is for demo purposes only
 */
export const CollapseButtonShowcase = () => {
  const [collapsed1, setCollapsed1] = useState(false)
  const [collapsed2, setCollapsed2] = useState(false)
  const [collapsed3, setCollapsed3] = useState(false)
  const [collapsed4, setCollapsed4] = useState(false)
  const [collapsed5, setCollapsed5] = useState(false)

  const designs = [
    {
      id: 1,
      name: 'Design 1: Floating Circle',
      description: 'Minimal floating circle with gradient background and subtle glow effect. Perfect for a clean, modern look.',
      state: collapsed1,
      setState: setCollapsed1,
      features: ['Floating position', 'Gradient background', 'Glow effect', 'Minimal']
    },
    {
      id: 2,
      name: 'Design 2: Sleek Pill',
      description: 'Pill-shaped button with icon and text. Shows full label when expanded with animated gradient.',
      state: collapsed2,
      setState: setCollapsed2,
      features: ['Pill shape', 'Animated gradient', 'Icon + Text', 'Smooth transitions']
    },
    {
      id: 3,
      name: 'Design 3: Split with Divider',
      description: 'Clean design with divider lines above and below. Includes accent line indicator.',
      state: collapsed3,
      setState: setCollapsed3,
      features: ['Divider lines', 'Accent indicator', 'Spacious layout', 'Clear separation']
    },
    {
      id: 4,
      name: 'Design 4: Glassmorphism Card',
      description: 'Card-style button with glassmorphism effect, border, and shadow. Premium feel.',
      state: collapsed4,
      setState: setCollapsed4,
      features: ['Glassmorphism', 'Card style', 'Shadow effects', 'Premium look']
    },
    {
      id: 5,
      name: 'Design 5: Minimalist Edge',
      description: 'Ultra-minimal bottom edge button with decorative dots and gradient lines.',
      state: collapsed5,
      setState: setCollapsed5,
      features: ['Minimalist', 'Decorative dots', 'Gradient lines', 'Subtle hover']
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-white">
            Collapse Button <span className="text-[#D417C8]">Designs</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose your preferred collapse button design. Click each button to see how it behaves in both collapsed and expanded states.
          </p>
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Card key={design.id} padding="lg" className="space-y-6">
              {/* Design Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{design.name}</h3>
                  <span className="px-2 py-1 bg-[#D417C8]/20 text-[#D417C8] text-xs rounded-full border border-[#D417C8]/30">
                    #{design.id}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{design.description}</p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {design.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded border border-white/10"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Preview Container */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Live Preview</p>
                <div 
                  className={`relative bg-[#141414] rounded-lg border border-white/10 transition-all duration-300 ${
                    design.state ? 'p-4' : 'p-6'
                  }`}
                  style={{ 
                    minHeight: '180px',
                    width: design.state ? '100px' : '100%'
                  }}
                >
                  {/* Simulated sidebar background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-lg" />
                  
                  {/* Button Preview */}
                  <div className="relative z-10 h-full flex flex-col justify-end">
                    <CollapseButton
                      design={design.id as 1 | 2 | 3 | 4 | 5}
                      isCollapsed={design.state}
                      onClick={() => design.setState(!design.state)}
                    />
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500">
                  {design.state ? 'Collapsed State' : 'Expanded State'}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => design.setState(!design.state)}
                className="w-full py-2 bg-gradient-to-r from-[#D417C8]/10 to-[#7767DA]/10 hover:from-[#D417C8]/20 hover:to-[#7767DA]/20 border border-[#D417C8]/30 text-white text-sm rounded-lg transition-all"
              >
                Toggle State
              </button>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card padding="lg" className="mt-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-[#D417C8] rounded-full" />
              How to Choose
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="space-y-2">
                <p className="text-white font-medium">Consider:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Your app&apos;s overall design language</li>
                  <li>How prominent you want the button</li>
                  <li>Mobile vs desktop experience</li>
                  <li>User familiarity and expectations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">Recommendations:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li><strong>Design 1:</strong> Best for minimal, unobtrusive UI</li>
                  <li><strong>Design 2:</strong> Best for clear labeling</li>
                  <li><strong>Design 4:</strong> Best for premium feel</li>
                  <li><strong>Design 5:</strong> Best for subtle integration</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default CollapseButtonShowcase

