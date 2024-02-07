import React from 'react';

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Box from './Box';

export default function ListBox({ boxes }) {
    return (
        <SortableContext
            items={ boxes.map((box) => box.id) }
            strategy={ horizontalListSortingStrategy }
        > 
            {
                boxes.map((box) => {
                    return <Box key={ box.id } box={ box } />
                })
            }
        </SortableContext>
    )
}
