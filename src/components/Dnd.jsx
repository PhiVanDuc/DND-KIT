import React, { useEffect, useState } from 'react';
import '../assets/SCSS/dnd.scss';

import { DndContext, DragOverlay, defaultDropAnimationSideEffects, closestCorners, rectIntersection } from '@dnd-kit/core';
import { cloneDeep } from 'lodash';
import { arrayMove } from '@dnd-kit/sortable';
import { dataBoxes } from '../utils/datas';
import { findElement } from '../utils/methods';

import ListBox from './ListBox';
import Box from './Box';
import Item from './Item';
import { nanoid } from 'nanoid';

export default function Dnd() {
    const [boxes, setBoxes] = useState(dataBoxes);
    const [activeElement, setActiveElement] = useState(null);

    useEffect(() => {
        const boxFinded = boxes.find(box => box.items.length === 0);
        if (!boxFinded) return;

        const newBoxes = [...boxes];
        const index = boxes.findIndex(box => box.id === boxFinded.id);
        newBoxes[index].items.push({
            id: nanoid(),
            data: {
                name: 'Item Content',
                type: 'item',
            }
        });

        setBoxes(newBoxes);
    }, [boxes]);

    const handleDragStart = (e) => {
        const { active } = e;
        const activeType = active.data.current.type;
        setActiveElement(findElement(active.id, activeType, boxes));
    }

    const handleDragOver = (e) => {
        if (activeElement.data.type === 'box') return;

        const { active, over } = e;
        if (!active || !over) return;

        const { id: activeId, data: { current: activeData } } = active;
        const { id: overId, data: { current: overData } } = over;

        const activeBox = findElement(activeId, activeData.type, boxes, true);
        const overBox = overData.type === 'box' ? findElement(overId, overData.type, boxes) : findElement(overId, overData.type, boxes, true);
        const activeItem = findElement(activeId, activeData.type, boxes);
        
        if (!activeBox || !overBox) return;

        if (activeBox.id !== overBox.id && overData.type === 'item') {
            setBoxes(prevBoxes => {
                const overItemIndex = overBox.items.findIndex(item => item.id === overId);

                let newItemIndex;
                const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newItemIndex = overItemIndex >= 0 ? overItemIndex + modifier : overBox.items.length + 1;

                const nextBoxes = cloneDeep(prevBoxes);
                const nextActiveBox = nextBoxes.find(box => box.id === activeBox.id);
                const nextOverBox = nextBoxes.find(box => box.id === overBox.id);

                if (nextActiveBox) {
                    nextActiveBox.items = nextActiveBox.items.filter(item => item.id !== activeId);
                }

                if (nextOverBox) {
                    nextOverBox.items = nextOverBox.items.filter(item => item.id !== activeId);
                    nextOverBox.items = nextOverBox.items.toSpliced(newItemIndex, 0, activeItem);
                }

                return nextBoxes;
            });
        }
    }

    const handleDragEnd = (e) => {
        const { active, over } = e;
        
        if (!active || !over) return;

        const { id: activeId, data: { current: activeData } } = active;
        const { id: overId, data: { current: overData } } = over;

        const activeBox = findElement(activeId, activeData.type, boxes, true);
        const overBox = overData.type === 'box' ? findElement(overId, overData.type, boxes) : findElement(overId, overData.type, boxes, true);
        const activeItem = findElement(activeId, activeData.type, boxes);
        const overItem = findElement(overId, overData.type, boxes);
        
        if (!activeBox || !overBox) return;

        const activeType = active.data.current.type;
        const overType = over.data.current.type;

        if (activeType === 'item' && active.id !== over.id) {
            if (overData.type === 'item') {
                const newBoxes = [...boxes];

                const currBox = newBoxes.find(box => box.id === overBox.id);
                const currBoxIndex = newBoxes.findIndex(box => box.id === overBox.id);
                const activeItemIndex = currBox.items.findIndex(item => item.id === active.id);
                const overItemIndex = currBox.items.findIndex(item => item.id === over.id);
                newBoxes[currBoxIndex].items = arrayMove(currBox.items, activeItemIndex, overItemIndex);

                setBoxes(newBoxes);
            }
        }

        if (activeType === 'box') {
            if (active.id !== over.id) {
                const activeIndex = boxes.findIndex((box) => box.id === active.id);
                const overIndex = boxes.findIndex((box) => box.id === over.id);
    
                setBoxes(arrayMove(boxes, activeIndex, overIndex));
            }
        }

        setActiveElement(null);
    }

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5'
                }
            }
        })
    }
    
    return (
        <div className="dnd">
            <div className="container">
                <h2 className="dnd-heading">DND-KIT PRACTICE</h2>

                <div className="boxes">
                    <DndContext
                        collisionDetection={ rectIntersection }
                        onDragStart={ handleDragStart }
                        onDragOver={ handleDragOver }
                        onDragEnd={ handleDragEnd }
                    >
                        <ListBox boxes={ boxes } />

                        <DragOverlay dropAnimation={ dropAnimation }>
                            {
                                !activeElement && null
                            }

                            {
                                activeElement?.data?.type === 'box' ? 
                                <Box box={ activeElement } /> : 
                                <Item item={ activeElement } />
                            }
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}