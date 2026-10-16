import { useDraggable } from '@dnd-kit/core'
import { useState } from 'react'
import { SLOT_LABELS, SLOTS, type Item, type Outfit, type Slot } from './logic'
import { ItemThumb } from './Wardrobe'

function Hanger({ item, on, onPick }: { item: Item; on: boolean; onPick: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: item.id })
  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      onClick={onPick}
      className="st-item"
      data-testid={`item-${item.id}`}
      data-on={on}
      data-dragging={isDragging}
      title={item.name}
    >
      <ItemThumb id={item.id} slot={item.slot as Slot} />
      <span>{item.name}</span>
    </button>
  )
}

type Props = { items: Item[]; outfit: Outfit; onPick: (item: Item) => void }

export function Rack({ items, outfit, onPick }: Props) {
  const [active, setActive] = useState<Slot>('glowa')
  return (
    <div className="st-rack">
      <div className="st-tabs" role="tablist">
        {SLOTS.map((slot) => (
          <button key={slot} type="button" role="tab" aria-selected={slot === active} className="st-tab" data-testid={`tab-${slot}`} data-filled={!!outfit[slot]} onClick={() => setActive(slot)}>
            {SLOT_LABELS[slot]}
          </button>
        ))}
      </div>
      {SLOTS.map((slot) => (
        <div key={slot} className="st-row" data-active={slot === active}>
          <span className="st-row-label">{SLOT_LABELS[slot]}</span>
          <div className="st-row-items">
            {items
              .filter((item) => item.slot === slot)
              .map((item) => (
                <Hanger key={item.id} item={item} on={outfit[slot]?.id === item.id} onPick={() => onPick(item)} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function OutfitChips({ outfit, onRemove }: { outfit: Outfit; onRemove: (slot: Slot) => void }) {
  return (
    <div className="st-chips">
      {SLOTS.map((slot) => (
        <button key={slot} type="button" className="st-chip" data-testid={`slot-${slot}`} data-filled={!!outfit[slot]} disabled={!outfit[slot]} onClick={() => onRemove(slot)}>
          <span>{SLOT_LABELS[slot]}</span>
          {outfit[slot] ? <b>{outfit[slot].name} ×</b> : <i>—</i>}
        </button>
      ))}
    </div>
  )
}
