import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import SortableItem from './SortableItem.js';
import Services from '../views/Admin/Ingatlanok/Services.js';

const KepCard = ({ list, property, setList, services, ...rest }) => {
    const { addNotification } = rest;
    const lll = list.kepek || [];

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.forEach((kep, index) => {
            if (index === 0) {
                kep.isCover = true;
                kep.id = index;
            } else {
                kep.isCover = false;
                kep.id = index;
            }
        });

        return result;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const newArray = reorder(lll, active.id, over.id);
            setList({
                ...list,
                [property]: newArray
            });
        }
    };

    const deleteImage = (filename) => {
        console.log(filename);
        let kepek = list[property];
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setList({
            ...list,
            [property]: filtered
        });
        Services.deleteImage(filename, list['id']).then((res) => {
            if (!res.err) {
                addNotification('success', res.msg);
            } else {
                addNotification('error', res.err);
            }
        });
    };

    const renderImages = () => {
        const divStyle = {
            display: 'grid',
            gridTemplateColumns: `repeat(4, 1fr)`,
            gridGap: 10,
            padding: 10,
            width: '100%'
        };

        return (
            <div style={divStyle}>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext useDragOverlay={true} items={lll}>
                        {lll.map((item) => {
                            return <SortableItem deleteImage={deleteImage} key={item.filename} addNotification={addNotification} item={item} />;
                        })}
                    </SortableContext>
                </DndContext>
            </div>
        );
    };

    return <>{renderImages(property ? list[property] : list)}</>;
};

export default KepCard;
