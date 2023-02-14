import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Dropdown from '.'

export default {
  title: 'Dropdown',
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>

const Template: ComponentStory<typeof Dropdown> = args => <Dropdown {...args} />

export const Example = Template.bind({})
Example.args = {
  options: [
    { label: 'Some label 1', onClick: () => null },
    { label: 'Some label 2', onClick: () => null },
    { label: 'Some label 3', onClick: () => null },
  ],
}

export const NestedOptions = Template.bind({})
NestedOptions.args = {
  options: [
    { label: 'Some label 1', onClick: () => null },
    { label: 'Some label 2', onClick: () => null },
    {
      label: 'Some label 3',
      type: 'extras',
      id: 'label-3-trigger-location',
      options: [
        { label: 'Some label 4', onClick: () => null },
        { label: 'Some label 5', onClick: () => null },
        { label: 'Some label 6', onClick: () => null },
      ],
    },
  ],
}
