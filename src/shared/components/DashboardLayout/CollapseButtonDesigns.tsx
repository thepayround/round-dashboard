import { PanelLeft, PanelLeftClose, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { PlainButton } from '../Button'

interface CollapseButtonProps {
  isCollapsed: boolean
  onClick: () => void
  design?: 1 | 2 | 3 | 4 | 5
}

export const CollapseButton = ({ isCollapsed, onClick, design = 1 }: CollapseButtonProps) => {
  const designs = {
    // Design 1: Minimal Floating Circle with subtle glow
    1: (
      <PlainButton
        onClick={onClick}
        className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-gradient-to-br from-[#D417C8] to-[#7767DA] shadow-lg shadow-[#D417C8]/20 hover:shadow-xl hover:shadow-[#D417C8]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand sidebar (Ctrl+Shift+B)" : "Collapse sidebar (Ctrl+Shift+B)"}
        unstyled
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-white" />
        )}
      </PlainButton>
    ),

    // Design 2: Sleek Pill with Icon + Text (when expanded)
    2: (
      <PlainButton
        onClick={onClick}
        className={`w-full px-4 py-2.5 flex items-center gap-2 text-xs transition-all duration-200 group relative overflow-hidden ${
          isCollapsed 
            ? 'justify-center bg-white/5 hover:bg-white/10' 
            : 'justify-between bg-gradient-to-r from-[#D417C8]/10 to-[#7767DA]/10 hover:from-[#D417C8]/20 hover:to-[#7767DA]/20'
        } rounded-lg mx-2`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand sidebar (Ctrl+Shift+B)" : "Collapse sidebar (Ctrl+Shift+B)"}
        unstyled
      >
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D417C8]/0 via-[#D417C8]/5 to-[#D417C8]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isCollapsed ? (
          <ChevronsRight className="w-4 h-4 text-[#D417C8] relative z-10" />
        ) : (
          <>
            <span className="font-medium text-white/80 group-hover:text-white relative z-10 flex items-center gap-2">
              <PanelLeftClose className="w-4 h-4" />
              Collapse
            </span>
            <ChevronsLeft className="w-4 h-4 text-[#D417C8] relative z-10" />
          </>
        )}
      </PlainButton>
    ),

    // Design 3: Split Design with Divider Line
    3: (
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
        <PlainButton
          onClick={onClick}
          className={`w-full py-3 flex items-center text-xs text-gray-400 hover:text-white transition-all duration-200 group ${
            isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar (Ctrl+Shift+B)" : "Collapse sidebar (Ctrl+Shift+B)"}
          unstyled
        >
          {isCollapsed ? (
            <div className="relative">
              <div className="absolute inset-0 bg-[#D417C8]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <PanelLeft className="w-4 h-4 relative z-10" />
            </div>
          ) : (
            <>
              <span className="font-medium flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-[#D417C8] to-[#7767DA] rounded-full" />
                Collapse Sidebar
              </span>
              <PanelLeftClose className="w-4 h-4 group-hover:text-[#D417C8] transition-colors" />
            </>
          )}
        </PlainButton>
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
      </div>
    ),

    // Design 4: Glassmorphism Card Style
    4: (
      <PlainButton
        onClick={onClick}
        className={`w-full flex items-center gap-3 transition-all duration-300 group backdrop-blur-sm ${
          isCollapsed 
            ? 'justify-center p-3 mx-2' 
            : 'justify-between p-3 mx-4'
        } rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D417C8]/30 shadow-lg hover:shadow-[#D417C8]/10`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand sidebar (Ctrl+Shift+B)" : "Collapse sidebar (Ctrl+Shift+B)"}
        unstyled
      >
        {isCollapsed ? (
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#D417C8]/20 to-[#7767DA]/20 group-hover:from-[#D417C8]/30 group-hover:to-[#7767DA]/30 transition-all">
            <ChevronsRight className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#D417C8]/20 to-[#7767DA]/20 group-hover:from-[#D417C8]/30 group-hover:to-[#7767DA]/30 transition-all">
                <PanelLeftClose className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-medium text-white/80 group-hover:text-white">Collapse</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-[#D417C8]/20 flex items-center justify-center transition-all">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#D417C8]" />
            </div>
          </>
        )}
      </PlainButton>
    ),

    // Design 5: Minimalist Bottom Edge Button
    5: (
      <div className="relative">
        <PlainButton
          onClick={onClick}
          className={`w-full group relative overflow-hidden ${
            isCollapsed ? 'py-4' : 'py-3'
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar (Ctrl+Shift+B)" : "Collapse sidebar (Ctrl+Shift+B)"}
          unstyled
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#D417C8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className={`flex items-center gap-2 relative z-10 ${isCollapsed ? 'justify-center' : 'justify-center'}`}>
            {isCollapsed ? (
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[#D417C8] transition-colors" />
                <ChevronsRight className="w-4 h-4 text-gray-400 group-hover:text-[#D417C8] transition-colors" />
                <div className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[#D417C8] transition-colors" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[#D417C8] transition-colors" />
                <ChevronsLeft className="w-4 h-4 text-gray-400 group-hover:text-[#D417C8] transition-colors" />
                <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">Collapse</span>
                <div className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[#D417C8] transition-colors" />
              </div>
            )}
          </div>
          
          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </PlainButton>
      </div>
    )
  }

  return designs[design]
}

export default CollapseButton

