import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Item({ item }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
        data: item.data,
    });

    const itemStyles = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid rgb(223, 223, 223)',
        borderRadius: '5px',
    }

    return (
        <div
            className='item'
            ref={ setNodeRef }
            style={ itemStyles }
            { ...attributes }
            { ...listeners }
        >
            <p className='item-name'>{ item.data.name }</p>
        </div>
    )
}