import React, { useEffect, useRef, useState } from 'react'
// import Link from 'next/link'
// import { Checkbox, Icon } from 'semantic-ui-react'

import { DropdownProps, Option, TabIndexedOption } from 'components/Dropdown/types'
// import ManaFrontIcon from 'views_DEPRICATED/Shared/manaFontIcon'

import Button from 'components/Button'

// the dropdown being seen is controlled via a .focus-within pseudo class
// We can apply that class, but only from that stylesheet (or with global styles) since we're using scss modules
import dropdownStyles from '../dropdown.module.scss'
import styles from './menu.module.scss'

type MenuProps = DropdownProps & {
  tabIndexedOptions?: TabIndexedOption[]
  highlightedIndex?: number | null
  unFocusClick: (e?: React.SyntheticEvent, optionOnClick?: () => void, noCloseOnClick?: boolean) => void
}

export const Menu = (props: MenuProps) => {
  const { menuClassName, menuStyle, options, tabIndexedOptions, highlightedIndex, direction, customOptions, unFocusClick } = props

  const parentMenu = useRef<HTMLDivElement | null>(null)

  return (
    <div
      ref={parentMenu}
      className={`
        ${styles.menu}
        ${dropdownStyles.open}
        ${direction === 'up' ? styles.upDirection : ''}
        ${menuClassName}
      `}
      style={menuStyle}
    >
      <div className={styles.gap} />
      <>
        {customOptions}
        {options &&
          (tabIndexedOptions || options).map((option: TabIndexedOption, key) => {
            const isArrowTabbed = option.tabIndex && highlightedIndex === option.tabIndex

            if (option.hidden) return null
            if (option.type === 'spacer') return <div key={key} className={styles.spacer} />
            if (option.type === 'header')
              return (
                <div key={key} className={styles.header}>
                  {option.label}
                </div>
              )

            if (option.type === 'extras')
              return (
                <ExtraMenu
                  key={key}
                  option={option}
                  parentRef={parentMenu.current}
                  unFocusClick={unFocusClick}
                  open={!!isArrowTabbed}
                />
              )

            if (option.type === 'message')
              return (
                <div key={key} className={styles.message}>
                  {option.label}
                </div>
              )

            if (option.type === 'checkbox')
              return (
                <input
                  // label={option.label}
                  type="checkbox"
                  className={isArrowTabbed ? styles.highlighted : ''}
                  key={key}
                  checked={option.checked}
                  onChange={() => option.onChange()}
                />
              )

            if (option.type === 'custom')
              return (
                <div key={key} className={isArrowTabbed ? styles.highlighted : ''}>
                  {option.customChild}
                </div>
              )

            if (option.to)
              return (
                <a key={key} href={option.to} className={isArrowTabbed ? styles.highlighted : ''}>
                  {/* {option.icon && <Icon style={{ marginRight: '.55rem' }} name={option.icon} />} */}
                  {option.label}
                </a>
              )

            if (!option.onClick)
              return (
                <div key={key} className={styles.info}>
                  {option.label}
                </div>
              )

            if (option.onClick)
              return (
                <Button
                  // icon={option.icon}
                  // manaFontIcon={option.manaFontIcon}
                  // keybind={option.keybind}
                  key={key}
                  disabled={option.disabled}
                  className={`${isArrowTabbed ? styles.highlighted : ''} ${option.disabled ? styles.disabled : ''}`}
                  onClick={e => unFocusClick(e, option.onClick, option.noCloseOnClick)}
                >
                  {option.label}
                </Button>
              )

            return null
          })}
      </>
      <div className={styles.gap} />
    </div>
  )
}

export default Menu

const ExtraMenu = ({
  option,
  open,
  parentRef,
  unFocusClick,
}: {
  option: Option
  open?: boolean
  parentRef: HTMLDivElement | null
  unFocusClick: (e?: React.SyntheticEvent, optionOnClick?: () => void, noCloseOnClick?: boolean) => void
}) => {
  const MENU_DELAY = 250 // ms

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuWrapperRef = useRef<HTMLDivElement | null>(null)
  const hoveredRef = useRef(false)

  const [hovered, setHovererd] = useState(false)
  const [visable, setVisable] = useState(false)

  const [offsetX, setOffsetX] = useState<number | null>(null)
  const [offsetY, setOffsetY] = useState<number | null>(null)

  useEffect(() => {
    if (!parentRef || !triggerRef.current) return

    if (!hovered) {
      setVisable(false)
      setOffsetX(null)
      setOffsetY(null)

      return
    }

    if (!menuWrapperRef.current) return

    // @ts-expect-error
    const extraMenu: HTMLDivElement = menuWrapperRef.current.childNodes[0]

    if (!extraMenu) return

    const triggerBounds = triggerRef.current.getBoundingClientRect()

    const triggerLeftOffset = triggerBounds.left
    const triggerTopOffset = triggerBounds.top

    const menuWidth = parentRef.clientWidth
    const menuHeight = parentRef.clientHeight

    const viewportWidth = document.body.clientWidth
    const viewportHeight = document.body.clientHeight

    const extraMenuWidth = extraMenu.clientWidth
    const extraMenuHeight = extraMenu.clientHeight

    let xOffset = menuWidth
    let yOffset = triggerRef.current?.offsetTop - 14

    if (triggerLeftOffset + extraMenuWidth + menuWidth > viewportWidth) xOffset = -1 * extraMenuWidth
    if (extraMenuWidth + menuWidth > viewportWidth) xOffset = viewportWidth - extraMenuWidth - triggerLeftOffset // extra logic in case you're on a very small screen

    if (triggerTopOffset + yOffset + extraMenuHeight > viewportHeight) yOffset = menuHeight - extraMenuHeight

    setOffsetX(xOffset)
    setOffsetY(yOffset)

    setTimeout(() => {
      // If you're no longer hovered (aka the menu is no longer open) then don't set visable to true
      // This can happen when a user mouses over the extra option while moving their cursor down for only a split second
      // Don't set to visable unless the user has stayed hovered for the whole 100ms
      if (!menuWrapperRef.current) return

      setVisable(true)
    }, 100)
  }, [hovered])

  const handleHoverIn = () => {
    hoveredRef.current = true

    setTimeout(() => {
      if (!hoveredRef.current) return

      setHovererd(true)
    }, MENU_DELAY)
  }

  const handleHoverOut = () => {
    hoveredRef.current = false

    setTimeout(() => {
      if (hoveredRef.current) return

      setHovererd(false)
    }, MENU_DELAY)
  }

  if (option.type !== 'extras') return null
  if (!option.options.length) return null

  return (
    <div onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut} className={hovered ? styles.extraTriggerIsOpen : ''}>
      <button onClick={() => setHovererd(true)} ref={triggerRef} className={styles.extraTrigger}>
        <span>
          {/* {option.icon && <Icon name={option.icon} />} */}
          {/* {option.manaFontIcon && <ManaFrontIcon icon={option.manaFontIcon} />} */}
          {option.label}
        </span>
        <span>{/* <Icon name="chevron right" size="small" /> */}</span>
      </button>

      {(hovered || open) && (
        <div ref={menuWrapperRef}>
          <Menu
            menuStyle={{
              top: offsetY || 0,
              left: offsetX || 0,
              width: 200,
              display: 'unset',
              opacity: visable ? 1 : 0,
              // transform: `translate(${offsetX}px, ${offsetY}px)`,
            }}
            options={option.options}
            unFocusClick={unFocusClick}
          />
        </div>
      )}
    </div>
  )
}
