import React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { Button, Card, CardTitle, CardBody, CardFooter } from 'reactstrap';

const KepCard = ({ list, property, setList, services, ...rest }) => {
    const { addNotification } = rest;

    const CustomComponent = (props) => {
        const { children } = props;

        const divStyle = {
            display: 'grid',
            gridTemplateColumns: `repeat(4, 1fr)`,
            gridGap: 10,
            padding: 10,
            width: '100%'
            /*             height: '100%' */
        };

        return <div style={divStyle}>{children}</div>;
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

    const SortableItem = SortableElement(({ value }) => {
        const { id, nev, src, preview, isCover, filename } = value;
        const imageStyle = {
            width: '150px',
            height: '100px'
        };
        const cardStyle = {
            maxHeight: '200px',
            opacity: '1 !important',
            float: 'left'
        };

        const getSrc = () => {
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

        return (
            <Card style={cardStyle} className={nev} key={id}>
                <CardTitle>{nev}</CardTitle>
                <CardBody>
                    <img style={imageStyle} src={getSrc() || preview} alt={nev} />
                </CardBody>
                <CardFooter style={{ textAlign: 'center' }}>
                    <Button hidden={!isCover} outline={isCover ? false : true} color="primary">
                        <i className="fas fa-flag"></i>
                    </Button>
                    <Button onClick={() => deleteImage(filename)}>Törlés</Button>
                </CardFooter>
            </Card>
        );
    });

    const SortableList = SortableContainer(({ items }) => {
        return (
            <CustomComponent>
                {items.map((value, index) => (
                    <SortableItem key={`item-${value + index.toString()}`} index={index} value={value} />
                ))}
            </CustomComponent>
        );
    });

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

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (property) {
            setList({
                ...list,
                [property]: reorder(list[property], oldIndex, newIndex)
            });
        } else {
            setList({
                items: arrayMove(items, oldIndex, newIndex)
            });
        }
    };

    return <SortableList axis="xy" items={property ? list[property] : list} onSortEnd={onSortEnd} {...rest} />;
};

export default KepCard;
