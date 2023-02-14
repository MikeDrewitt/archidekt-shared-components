import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Button from '.'

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = args => <Button {...args} />

export const Example = Template.bind({})
Example.args = {
  children: 'Some button',
  disabled: false,
}

export const Disabled = Template.bind({})
Disabled.args = {
  children: 'Disabled button',
  disabled: true,
}
