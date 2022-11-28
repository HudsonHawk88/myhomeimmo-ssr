import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortableItem from './SortableItem.js';

const KepCard = ({ list, property, setList, services, ...rest }) => {
    const { addNotification } = rest;
    const lll = list.kepek || [];
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 2 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const reorder = (list, startIndex, endIndex) => {
        let result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        console.log(removed);
        result.splice(endIndex, 0, removed);
        console.log(result);
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
            console.log(newArray);
            setList({
                ...list,
                [property]: newArray
            });
        }
    };

    const deleteImage = (filename) => {
        let kepek = list[property];
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setList({
            ...list,
            [property]: filtered
        });
        services.deleteImage(filename, list['id']).then((res) => {
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div style={divStyle}>
                    <SortableContext useDragOverlay={true} items={lll}>
                        {lll.map((item, index) => {
                            return <SortableItem deleteImage={deleteImage} key={item.filename} item={item} id={index} />;
                        })}
                    </SortableContext>
                </div>
            </DndContext>
        );
    };

    return <>{renderImages(property ? list[property] : list)}</>;
};

export default KepCard;
