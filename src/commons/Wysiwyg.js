import React, { useEffect, Suspense, useState, useMemo } from 'react';
const Wysiwyg = ({ value, onChange, contentEditable }) => {
    /* let Module; */
    const [Module, setModule] = useState(undefined);
    const importModule = async () => {
        let modul;
        if (__isBrowser__) {
            modul = await import('@inftechsol/react-slate-wysiwyg').then((mod) => mod);
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

        return <Module value={value} onChange={onChange} />;
    };

    /*   useEffect(async() => {
    Module = await importModule();
  }, [__isBrowser__]); */

    return <React.Fragment>{Module && renderEditor()}</React.Fragment>;
};

export default Wysiwyg;
