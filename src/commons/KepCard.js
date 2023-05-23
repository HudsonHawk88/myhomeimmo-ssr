import React, { useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, MeasuringConfiguration, TouchSensor, useSensor, useSensors, MouseSensor, rectIntersection, MeasuringStrategy } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSwappingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableItem from './SortableItem.js';

const KepCard = ({ list, property, setList, services, ...rest }) => {
    const { addNotification } = rest;
    const lll = list.kepek || [];

    lll.forEach((l, index) => {
        const newObj = l;
        Object.assign(newObj, { id: index });
    });

    const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 2 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    /*   const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 250
            }
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 300,
                tolerance: 100
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    ); */

    const reorder = (list, startIndex, endIndex) => {
        let result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        result.forEach((kep, index) => {
            console.log(startIndex, endIndex, kep.id);
            if (index === 0) {
                kep.isCover = true;
                kep.id = endIndex;
            } else {
                kep.isCover = false;
                kep.id = endIndex;
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
        let kepek = list[property];
        let filtered = kepek.filter((kep) => kep.filename !== filename);
        setList({
            ...list,
            [property]: filtered
        });
        services.deleteImage(filename, list['id'], (err, res) => {
            if (!err) {
                addNotification('success', res.msg);
            }
        });
    };

    const renderImages = () => {
        /*  const divStyle = {
            display: 'grid',
            gridTemplateColumns: `repeat(4, 1fr)`,
            gridGap: 10,
            padding: 10,
            width: '100%'
        }; */

        console.log('NEWLLL: ', lll);

        const divStyle = {
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%'
        };

        return (
            <DndContext
                id="DND"
                sensors={sensors}
                measuring={MeasuringStrategy}
                autoScroll={{ enabled: true, acceleration: 1, interval: 1, layoutShiftCompensation: true }}
                collisionDetection={closestCenter}
                onDragMove={(id, overId) => console.log(id, overId)}
                onDragEnd={handleDragEnd}
            >
                <div style={divStyle}>
                    <SortableContext useDragOverlay={true} items={lll} strategy={rectSortingStrategy}>
                        {lll.map((item) => {
                            console.log(item);
                            return <SortableItem deleteImage={deleteImage} key={item.filename} item={item} id={item.id} />;
                        })}
                    </SortableContext>
                </div>
            </DndContext>
        );
    };

    return <>{renderImages(property ? list[property] : list)}</>;
};

export default KepCard;
