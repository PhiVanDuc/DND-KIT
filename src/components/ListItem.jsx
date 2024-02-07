import React from 'react';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Item from './Item';

export default function ListItem({ items: i }) {
    return (
        <SortableContext
            items={ i.map((item) => item.id) }
            strategy={ verticalListSortingStrategy }
        >
            {
                i.map((item) => {
                    return <Item key={ item.id } item={ item } />
                })
            }
        </SortableContext>
    )
}
