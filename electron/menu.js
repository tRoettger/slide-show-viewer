const { Menu } = require('electron');
const { openFolder } = require('./fs-actions.js');

const MENU_TEMPLATE = [
    {
        label: "File",
        submenu: [
            { "role": "open", "label": "Open", "accelerator": "Ctrl+O", click: openFolder },
            //{ "role": "save", "label": "Save", "accelerator": "Ctrl+S", click: saveFile},
            { "type": "separator" },
            { "role": "quit", "label": "Exit" }
        ]
    }, {
        label: "Settings",
        submenu: [
            //{ "role": "cfg-app", "label": "Configuration", click: configApp },
            //{ "role": "cfg-defaults", "label": "Defaults", click: configDefaults }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(MENU_TEMPLATE));