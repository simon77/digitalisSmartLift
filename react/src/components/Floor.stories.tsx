import type {Meta, StoryObj} from '@storybook/react';

import Floor from './Floor';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Floor> = {
    title: 'Floor',
    component: Floor,
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
type Story = StoryObj<typeof Floor>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        numberOfLifts: 4,
        floor_level: 0,
        floor_name: "Ground",
        numberOfPanels: 1,
        numberOfFloors: 1,
        liftConfig: {
            "lifts": {
                "1": {
                    "serviced_floors": [
                        0,
                        1,
                        2,
                        3
                    ]
                },
                "2": {
                    "serviced_floors": [
                        0,
                        3
                    ]
                },
                "3": {
                    "serviced_floors": [
                        0,
                        1,
                        2
                    ]
                },
                "4": {
                    "serviced_floors": [
                        0,
                        1
                    ]
                }
            }
        },
        liftStatus: {
            "lifts": {
                "1": {
                    "floor": 1,
                    "destinations": [
                        0,
                        1,
                        2
                    ]
                },
                "2": {
                    "floor": 0,
                    "destinations": []
                },
                "3": {
                    "floor": 0,
                    "destinations": [
                        0,
                        1
                    ]
                },
                "4": {
                    "floor": 0,
                    "destinations": []
                }
            }
        }
    },
};


