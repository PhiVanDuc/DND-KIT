import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ListItem from './ListItem';

export default function Box({ box }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: box.id,
        data: box.data,
    });

    const boxStyles = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div className="wrap-box">
            <div 
                className='box'
                ref={ setNodeRef }
                style={ boxStyles }
                { ...attributes }
            >
                <h3
                    className='box-name'
                    { ...listeners }
                >
                    { box.data.name }
                </h3>

                <div className="items">
                    <ListItem items={ box.items } />
                </div>
            </div>
        </div>
    )
}
