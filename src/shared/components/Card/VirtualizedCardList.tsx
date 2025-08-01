import { memo, useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'

interface VirtualizedCardListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  height: number
  width?: number | string
  className?: string
  overscan?: number
}

const VirtualizedCardListComponent = <T,>({
  items,
  renderItem,
  itemHeight,
  height,
  width = '100%',
  className = '',
  overscan = 5
}: VirtualizedCardListProps<T>) => {
  const ItemRenderer = useMemo(() => {
    const Component = memo(({ index, style }: { index: number; style: React.CSSProperties }) => (
      <div style={style}>
        {renderItem(items[index], index)}
      </div>
    ))
    Component.displayName = 'VirtualizedCardItem'
    return Component
  }, [items, renderItem])

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 text-gray-400 ${className}`}>
        No items to display
      </div>
    )
  }

  return (
    <div className={className}>
      <List
        height={height}
        width={width}
        itemCount={items.length}
        itemSize={itemHeight}
        overscanCount={overscan}
        className="scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {ItemRenderer}
      </List>
    </div>
  )
}

export const VirtualizedCardList = memo(VirtualizedCardListComponent) as <T>(
  props: VirtualizedCardListProps<T>
) => JSX.Element