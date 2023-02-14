import React, { useEffect, useRef, useState } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
// import { Icon } from 'semantic-ui-react'
// import type { SemanticICONS, SemanticCOLORS } from 'semantic-ui-react'
// import shortid from 'shortid'

import { DropdownProps, Option, TabIndexedOption } from './types'

import Menu from './Menu'
import Button from '../Button'

import styles from './dropdown.module.scss'

const Dropdown = (props: DropdownProps) => {
  const { triggerClassName = '', triggerStyle = {}, children = null } = props

  const [hasFocus, setHasFocus] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const ref = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const triggerInnerRef = useRef<HTMLDivElement>(null)
  const keyListener = useRef<(e: KeyboardEvent) => void>(() => null)
  const arrowDirectionRef = useRef(false)
  const allowCloseOnClick = useRef(false)

  const { updatedOptions, maxTabIndex } = populateTabIndexs(props.options)

  const handleClick = (_e?: React.SyntheticEvent, optionOnClick?: () => void, noCloseOnClick?: boolean) => {
    if (!noCloseOnClick) ref?.current?.focus({})
    if (optionOnClick) optionOnClick()
  }

  const handleFocus = (_e: React.FocusEvent) => {
    if (props.disabled) return handleBlur()

    setHasFocus(true)
    setActiveIndex(null)
  }

  const handleBlur = (e?: React.FocusEvent) => {
    // @ts-ignore
    // Only end focus if you blur outside of parent container (aka not focusing any children)
    if (!!e && e.currentTarget.contains(e.relatedTarget)) return

    // This is the "real" onBlur (aka when we've left the parent entirely)
    setHasFocus(false)

    // forcibly unfocusing on blur since blurring in react only unfocuses within the react context
    // If we're focused via the browsers context (aka tabbed to that focus) this will force unfocus
    if (!e) ref?.current?.focus({})
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    // @ts-ignore
    // Only allow closing when clicking on the trigger itself
    if (!triggerInnerRef.current?.contains(e.target)) return

    if (props.skipCloseOnClick) return
    if (allowCloseOnClick.current) handleBlur()
  }

  useEffect(() => {
    document.body.removeEventListener('keydown', keyListener.current)

    if (!hasFocus || props.customOptions || !props.options?.length) return // we can't support arrowing through custom options, it'd be too complicated

    keyListener.current = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleBlur()
      }

      if (!maxTabIndex) return // nothing to arrow to

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') e.preventDefault()

      const canMoveUp = activeIndex !== null && maxTabIndex
      const canMoveDown = (activeIndex === null && maxTabIndex) || (activeIndex !== null && activeIndex < maxTabIndex)

      if (e.key === 'ArrowUp' && canMoveUp) {
        setActiveIndex(activeIndex === null || activeIndex === 1 ? null : activeIndex - 1)
        arrowDirectionRef.current = true
      }

      if (e.key === 'ArrowDown' && canMoveDown) {
        setActiveIndex(activeIndex === null ? 1 : activeIndex + 1)
        arrowDirectionRef.current = false
      }

      if (e.key === ' ' || (e.key === 'Enter' && activeIndex !== null)) {
        const highlightedOption = updatedOptions?.find(o => o.tabIndex === activeIndex)
        if (!highlightedOption) return

        e.preventDefault()

        if (highlightedOption.type === 'custom' && highlightedOption.onAccessibleClick) highlightedOption.onAccessibleClick()
        if (highlightedOption.type === 'checkbox') highlightedOption.onChange()
        if (highlightedOption.onClick) handleClick(undefined, highlightedOption.onClick, highlightedOption.noCloseOnClick)
        // if (highlightedOption.to) history.push(highlightedOption.to)
      }
    }

    document.body.addEventListener('keydown', keyListener.current)

    return () => {
      document.body.removeEventListener('keydown', keyListener.current)
    }
  }, [hasFocus, props.options, activeIndex])

  useEffect(() => {
    const option = updatedOptions?.find(o => o.tabIndex === activeIndex)

    if (!option || !option.id) return

    const element = document.getElementById(option.id)

    if (!element) return

    const options = arrowDirectionRef.current ? { block: 'start', inline: 'nearest' } : { block: 'end', inline: 'nearest' }

    // @ts-ignore
    scrollIntoView(element, { scrollMode: 'if-needed', ...options })
  }, [activeIndex])

  useEffect(() => {
    if (!hasFocus) {
      if (props.onBlur) props.onBlur()
      allowCloseOnClick.current = false
    } else {
      if (props.onFocus) props.onFocus()
      setTimeout(() => (allowCloseOnClick.current = true), 200)
    }
  }, [hasFocus])

  return (
    <>
      <div
        ref={triggerRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleTriggerClick}
        className={`${styles.trigger} ${triggerClassName}`}
        style={triggerStyle}
        tabIndex={props.tabIndex || 0}
      >
        <div ref={triggerInnerRef}>
          {children ? (
            <>{children}</>
          ) : (
            <Button className={props.defaultTriggerClassName} disabled={props.disabled} onClick={() => null}>
              Trigger
            </Button>
          )}
        </div>
        {props.noShowWithoutOptions && !updatedOptions?.length ? null : (
          <Menu
            {...props}
            tabIndexedOptions={updatedOptions}
            highlightedIndex={activeIndex}
            menuStyle={props.menuStyle}
            unFocusClick={handleClick}
          />
        )}
      </div>
      {/* Used to unfocus the dropdown on option selection */}
      <button
        type="button"
        tabIndex={-1}
        ref={ref}
        style={{ position: 'absolute', transform: 'scale(0)', height: 0, width: 0, userSelect: 'none' }}
      ></button>
    </>
  )
}

export default Dropdown

const populateTabIndexs = (options?: Option[]): { updatedOptions?: Array<TabIndexedOption>; maxTabIndex: number } => {
  if (!options) return { updatedOptions: undefined, maxTabIndex: 0 }

  let maxTabIndex = 0

  const updatedOptions = options.map((option, index) => {
    let tabbable = false

    if (option.onClick) tabbable = true
    if (option.to) tabbable = true
    if (option.type === 'checkbox') tabbable = true
    if (option.type === 'custom' && option.onAccessibleClick) tabbable = true

    if (option.hidden) tabbable = false // hard override this one

    return { ...option, tabIndex: tabbable ? ++maxTabIndex : undefined, id: `option-index-${index}` }
  })

  return { updatedOptions, maxTabIndex }
}
