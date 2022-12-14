import React, { useEffect, Suspense, useState, useMemo } from 'react';
const Wysiwyg = ({ fontId, value, onChange, contentEditable }) => {
    /* let Module; */
    const [Module, setModule] = useState(undefined);
    const importModule = async () => {
        let modul;
        if (__isBrowser__) {
            modul = await import('@organw/wysiwyg-editor').then((mod) => mod);
        }
        return modul;
    };

    let isView = false;

    if (contentEditable !== null && contentEditable !== undefined) {
        isView = true;
    }

    useEffect(() => {
        if (__isBrowser__) {
            async function init() {
                setModule(await importModule());
            }
            init();
        }
    }, [__isBrowser__]);

    const renderEditor = () => {
        const { App, Toolbar, ToolbarGroup, ToolbarItem, Editor } = Module;

        return (
            <App fontId={fontId} value={value} onChange={onChange}>
                {!isView && (
                    <Toolbar className="position-sticky">
                        <ToolbarGroup>
                            <ToolbarItem type="mark" tag="b" name="bold" tooltip="Félkövér">
                                <i className="fa fa-bold"></i>
                            </ToolbarItem>
                            <ToolbarItem type="mark" tag="code" name="code" tooltip="Kód">
                                <i className="fa fa-code"></i>
                            </ToolbarItem>
                            <ToolbarItem type="mark" tag="i" name="italic" tooltip="Dőlt">
                                <i className="fa fa-italic"></i>
                            </ToolbarItem>
                            <ToolbarItem type="mark" tag="u" name="underline" tooltip="Aláhúzott">
                                <i className="fa fa-underline"></i>
                            </ToolbarItem>
                            <ToolbarItem type="mark" tag="s" name="strikethrough" tooltip="Áthúzott">
                                <i className="fa fa-strikethrough"></i>
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="quote" name="quote" tooltip="Idézet">
                                <i className="fa fa-quote-right"></i>
                            </ToolbarItem>
                            <ToolbarItem type="fontsize" tag="fontsize" name="fontsize" tooltip="Betűméret">
                                Betűméret&nbsp;
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarItem type="block" tag="h1" name="heading-one" tooltip="Címsor 1">
                                H1
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="h2" name="heading-two" tooltip="Címsor 2">
                                H2
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="h3" name="heading-three" tooltip="Címsor 3">
                                H3
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="h4" name="heading-four" tooltip="Címsor 4">
                                H4
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="h5" name="heading-five" tooltip="Címsor 5">
                                H5
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarItem type="align" tag="left" name="align-left" tooltip="Balra igazítás">
                                <i className="fa fa-align-left"></i>
                            </ToolbarItem>
                            <ToolbarItem type="align" tag="center" name="align-center" tooltip="Középre igazítás">
                                <i className="fa fa-align-center"></i>
                            </ToolbarItem>
                            <ToolbarItem type="align" tag="rignt" name="align-right" tooltip="Jobbra igazítás">
                                <i className="fa fa-align-right"></i>
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="li" name="list-item" tooltip="Sima lista">
                                <i className="fa fa-list"></i>
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="ul" name="bulleted-list" tooltip="Pontozott lista">
                                <i className="fa fa-list-ul"></i>
                            </ToolbarItem>
                            <ToolbarItem type="block" tag="ol" name="numbered-list" tooltip="Számozott lista">
                                <i className="fa fa-list-ol"></i>
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarItem type="table" tag="table" name="table" tooltip="Táblázat">
                                <i className="fa fa-table"></i>
                            </ToolbarItem>
                            <ToolbarItem type="table" tag="table" name="table_left" tooltip="Balra igazított táblázat">
                                <i className="fa fa-table" style={{ marginRight: 5 }}></i> <i className="fa fa-align-left"></i>
                            </ToolbarItem>
                            <ToolbarItem type="table" tag="table" name="table_center" tooltip="Középre igazított táblázat">
                                <i className="fa fa-table" style={{ marginRight: 5 }}></i> <i className="fa fa-align-center"></i>
                            </ToolbarItem>
                            <ToolbarItem type="table" tag="table" name="table_right" tooltip="Jobbra igazított táblázat">
                                <i className="fa fa-table" style={{ marginRight: 5 }}></i> <i className="fa fa-align-right"></i>
                            </ToolbarItem>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarItem type="link" tag="a" name="link" tooltip="Link">
                                <i className="fa fa-link"></i>
                            </ToolbarItem>
                            <ToolbarItem type="image" tag="img" name="image" tooltip="Kép">
                                <i className="fa fa-picture-o"></i>
                            </ToolbarItem>
                            <ToolbarItem type="image" tag="img" name="float_left" tooltip="Kép szöveggel balra">
                                <i className="fa fa-indent"></i>
                            </ToolbarItem>
                            <ToolbarItem type="image" tag="img" name="float_right" tooltip="Kép szöveggel jobbra">
                                <i className="fa fa-outdent"></i>
                            </ToolbarItem>
                            <ToolbarItem type="embed" tag="embed" name="embed" tooltip="Videó">
                                <i className="fa fa-video-camera"></i>
                            </ToolbarItem>
                            <ToolbarItem type="button" tag="button" name="button" tooltip="CTA gomb">
                                CTA gomb
                            </ToolbarItem>
                            <ToolbarItem type="emoji" tag="emoji" name="emoji" tooltip="Emoji">
                                <i className="fa fa-smile-o"></i>
                            </ToolbarItem>
                        </ToolbarGroup>
                    </Toolbar>
                )}
                <Editor />
            </App>
        );
    };

    /*   useEffect(async() => {
    Module = await importModule();
  }, [__isBrowser__]); */

    return <React.Fragment>{Module && renderEditor()}</React.Fragment>;
};

export default Wysiwyg;
