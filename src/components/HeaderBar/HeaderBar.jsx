import React from 'react';
import { CommandBar } from '@fluentui/react';
import { getTheme, registerIcons } from '@fluentui/react/lib/Styling';
import { useService } from 'use-service';

import './HeaderBar.css';

const GITHUB_ICON = (
    <svg aria-hidden="true" className="octicon octicon-plus" width="12" height="16" role="img" version="1.1" viewBox="0 0 16 16">
        <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
);

registerIcons({
    icons: {
        'Github': GITHUB_ICON,
    }
});

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export function HeaderBar() {
    const theme = getTheme();
    const $har = useService("$har");
    const fileInputRef = React.useRef();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            $har.addFiles(files);
        }
        e.target.value = '';
    };

    const styles = {
        root: [
            {
                background: theme.palette.themePrimary
            }
        ]
    };

    const items = [
        {
            key: 'home',
            name: 'HAR Editor',
            iconProps: { iconName: 'Home' },
            href: '/har-editor',
        },
        {
            key: 'upload',
            name: 'Open HAR',
            iconProps: { iconName: 'OpenFile' },
            onClick: () => fileInputRef.current.click(),
        },
    ];

    const exportedHAR = $har.export();
    const hasHARs = $har.files.length > 0;

    if (hasHARs) {
        if ($har.current) {
            items.push({
                key: 'save',
                name: 'Save',
                iconProps: { iconName: 'Save' },
                onClick: () => {
                    const content = JSON.stringify($har.current.parsed, null, 2);
                    download($har.current.name, content);
                },
            });
        }

        items.push({
            key: 'export',
            name: 'Export All',
            iconProps: { iconName: 'Download' },
            onClick: () => {
                const content = JSON.stringify(exportedHAR);
                const filename = `har-editor-export-${Date.now()}.har`;
                download(filename, content);
            },
        });

        if ($har.files.length > 1) {
            items.push({
                key: 'files',
                name: $har.current ? $har.current.name : 'Select file',
                iconProps: { iconName: 'DocumentSet' },
                subMenuProps: {
                    items: $har.files.map(f => ({
                        key: f.name,
                        text: f.name,
                        canCheck: true,
                        checked: $har.current === f,
                        onClick: () => $har.select(f),
                    }))
                }
            });
        }
    }

    const farItems = [
        {
            key: 'github',
            name: 'Fork me on github',
            iconProps: { iconName: 'Github' },
            href: 'https://github.com/toutpt/har-editor',
        },
    ];

    return (
        <header className="header">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".har,.json"
                multiple
                style={{ display: 'none' }}
            />
            <CommandBar items={items} farItems={farItems} styles={styles}/>
        </header>
    );
}
