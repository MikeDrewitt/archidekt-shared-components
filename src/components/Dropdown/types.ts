import React from 'react'

// import type { SemanticICONS } from 'semantic-ui-react'
// import { ManaFontIcons } from 'views_DEPRICATED/Shared/manaFontIcon'

export type Option = (
  | { type?: 'option'; label: React.ReactNode }
  | { type: 'spacer' }
  | { type: 'header'; label: React.ReactNode }
  | { type: 'message'; label: React.ReactNode }
  | { type: 'checkbox'; label: string; checked: boolean; onChange: () => void }
  | {
      type: 'custom'
      customChild: React.ReactNode
      onAccessibleClick?: () => void
    }
  | { type: 'extras'; label: string; id: string; options: Option[] }
) & {
  to?: string
  hidden?: boolean
  onClick?: () => void
  noCloseOnClick?: boolean
  disabled?: boolean
  keybind?: string
  // icon?: SemanticICONS
  // manaFontIcon?: ManaFontIcons
}

export type TabIndexedOption = Option & { tabIndex?: number; id?: string }

export type DropdownProps = {
  children?: React.ReactNode
  triggerClassName?: string
  defaultTriggerClassName?: string
  menuClassName?: string
  triggerStyle?: React.CSSProperties
  menuStyle?: React.CSSProperties
  direction?: 'up' | 'down'
  disabled?: boolean
  noShowWithoutOptions?: boolean
  tabIndex?: number
  skipCloseOnClick?: boolean
  onFocus?: () => void
  onBlur?: () => void
} & ({ options: Option[]; customOptions?: never } | { options?: never; customOptions: React.ReactNode })
