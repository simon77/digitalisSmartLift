import type {Meta, StoryObj} from '@storybook/react';
import {Lift} from "./Lift";


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Lift> = {
    title: 'Lift/Lift',
    component: Lift,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    // argTypes: {
    //   backgroundColor: { control: 'color' },
    // },
    // // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof Lift>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        liftId: {
            floor: 1,
            id: 1,
        },
        currentFloor: 3,
        requestedFloors: [],
        servicedFloors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        doors: 'open',
        direction: 'up'
    },
};

