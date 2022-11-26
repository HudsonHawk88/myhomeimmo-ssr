import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';

const SortableItem = ({ item, addNotification }) => {
    const { id, src, preview, filename, nev, isCover } = item;
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    const imageStyle = {
        width: '150px',
        height: '100px'
    };

    const getSrc = (src) => {
        let extIndex = src.lastIndexOf('.');
        let extension = src.substring(extIndex);
        let fname = src.substring(0, extIndex);
        const isIcon = src.includes('__icon');
        let icon = src;
        if (isIcon) {
            icon = fname + '_icon' + extension;
        }

        return icon;
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className={nev}>
                <CardTitle>{nev}</CardTitle>
                <CardBody>
                    <img style={imageStyle} src={getSrc(src) || preview} alt={nev} />
                </CardBody>
                <CardFooter style={{ textAlign: 'center' }}>
                    <Button hidden={!isCover} outline={isCover ? false : true} color="primary">
                        <i className="fas fa-flag"></i>
                    </Button>
                    <Button onClick={() => deleteImage(filename)}>Törlés</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SortableItem;