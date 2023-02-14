import React from 'react'

import styles from './button.module.scss'

export interface ButtonProps {
  className?: string
  disabled?: boolean
  onClick?: (e?: React.SyntheticEvent) => void
  children?: React.ReactNode
}

const Button = ({ className, disabled, onClick, children = null }: ButtonProps) => {
  return (
    <button onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
