import React from 'react';
import { Wysiwyg, ToolbarGroup, ToolbarItem, deserialize, serialize, getElementsFromHtml, initialValue } from '@inftechsol/react-slate-wysiwyg';
import PropTypes from 'prop-types';

export const serializeValue = (type, value) => {
    switch (type) {
        case 'de': {
            return deserialize(getElementsFromHtml(value));
        }
        case 'se': {
            const v = serialize(value);
            return v;
        }
        case 'def': {
            return initialValue;
        }
        default: {
            return initialValue;
        }
    }
};

export const WysiwygEditor = ({ value, onChange, uploadType, gallery }) => {
    return (
        <div>
            <Wysiwyg editorClass="ow-wysiwyg-editor" className="ow-wysiwyg-app" value={value} onChange={onChange} uploadType={uploadType} gallery={gallery}>
                <ToolbarGroup className="ow-wysiwyg-toolbar-group">
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="mark" format="bold" icon="fa fa-bold" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="mark" format="italic" icon="fa fa-italic" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="mark" format="underline" icon="fa fa-underline" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="mark" format="code" icon="fa fa-code" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="fontsize" format="fontSizeButton" icon="fontSizeButton" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="fontColor" format="fontColor" />
                </ToolbarGroup>
                <ToolbarGroup className="ow-wysiwyg-toolbar-group">
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="heading-1" icon="fa fa-header" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="heading-2" icon="fa fa-header" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="heading-3" icon="fa fa-header" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="heading-4" icon="fa fa-header" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="heading-5" icon="fa fa-header" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="block-quote" icon="fa fa-indent" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="numbered-list" icon="fa fa-list-ol" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="bulleted-list" icon="fa fa-list-ul" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="align-left" icon="fa fa-align-left" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="align-center" icon="fa fa-align-center" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="align-right" icon="fa fa-align-right" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="block" format="align-justify" icon="fa fa-align-justify" />
                </ToolbarGroup>
                <ToolbarGroup className="ow-wysiwyg-toolbar-group">
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="table" format="table-left" icon="fa fa-table" plusIcon="fa fa-align-left" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="table" format="table-center" icon="fa fa-table" plusIcon="fa fa-align-center" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="table" format="table-right" icon="fa fa-table" plusIcon="fa fa-align-right" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="image" format="image" icon="fa fa-image" plusIcon="" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="image" format="image-left" icon="fa fa-image" plusIcon="fa fa-align-left" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="image" format="image-center" icon="fa fa-image" plusIcon="fa fa-align-center" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="image" format="image-right" icon="fa fa-image" plusIcon="fa fa-align-right" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="link" format="link" icon="fa fa-link" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="removelink" format="removelink" icon="fa fa-unlink" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="youtube" format="youtube" icon="fa fa-youtube" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="cta" format="cta" icon="fa fa-globe" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="custom" text="Ár" format="${ar}" />
                    <ToolbarItem className="ow-wysiwyg-toolbar-item" type="emoji" icon="fa fa-smile-o" />
                </ToolbarGroup>
            </Wysiwyg>
        </div>
    );
};

WysiwygEditor.propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
};
