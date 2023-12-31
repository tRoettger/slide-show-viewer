const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

const fromTemplate = (template, values) => {
    const result = {};
    for(let key in template) {
        let value = values[key];
        if(!value || typeof value !== 'object') {
            result[key] = value;
        } else {
            result[key] = fromTemplate(template[key], value);
        }
    }
    return result;
};

const createSecurityProperties = () => ({
    webPreferences: {
        sandbox: false,
        preload: path.join(__dirname, "..", "preload.js")
    }, 
    show: false
});

class WindowConfigurer {
    constructor(securityFilter, encoding) {
        this.securityFilter = securityFilter;
        this.encoding = encoding;
        this.loadSettings = this.loadSettings.bind(this);
        this.storeSettings = this.storeSettings.bind(this);
    }

    create(settingsFilename, defaultSettings, additionalSettings) {
        const initialSettings = {...createSecurityProperties(), ...additionalSettings};
        const window = new BrowserWindow(initialSettings);
        this.loadSettings(settingsFilename)
            .catch(() => defaultSettings)
            .then(settings => ({...settings, ...additionalSettings}))
            .then(settings => {
                console.log(`Configure ${settingsFilename}`, settings);
                this.#configurePosition(window, settings);
                this.#configureSize(window, settings);
            })
            .then(() => window.show());
        window.on(
            'close', 
            () => this.storeSettings(window.getBounds(), settingsFilename)
                .then(() => console.log(`Stored ${settingsFilename} settings successfully`))
                .catch((err) => console.error(`An error occured while storing the ${settingsFilename} settings:`, err))
        );
        return window;
    }

    #configureSize(window, settings) {
        if(settings.width && settings.height) {
            window.setSize(settings.width, settings.height);
        }
    }

    #configurePosition(window, settings) {
        if(settings.x && settings.y) {
            window.setPosition(settings.x, settings.y);
        }
    }


    loadSettings(settingsFilename) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.#getOrCreateSettingsFilePath(settingsFilename), this.encoding, (err, data) => {
                if(err) {
                    const error = new Error(`An error occured while loading ${settingsFilename}`);
                    error.stack += "\ncause by: " + err.stack;
                    reject(error);
                } else {
                    const rawdata = JSON.parse(data);
                    resolve(fromTemplate(this.securityFilter, rawdata));
                }
            });
        });
    }

    storeSettings(settings, settingsFilename) {
        return new Promise((resolve, reject) => {
            const data = fromTemplate(this.securityFilter, settings);
            fs.writeFile(this.#getOrCreateSettingsFilePath(settingsFilename), JSON.stringify(data), (err) => {
                if(err) {
                    const error = new Error(`An error occured while loading ${settingsFilename}`);
                    error.stack += "\ncause by: " + err.stack;
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    #getOrCreateSettingsFilePath(settingsFilename) {
        return path.join(this.#getOrCreateConfigPath(), `./${settingsFilename}.json`);
    }

    #getOrCreateConfigPath() {
        const cfgPath = path.join(app.getPath("userData"), "./cfg");
        if(!fs.existsSync(cfgPath)) fs.mkdirSync(cfgPath);
        return cfgPath;
    }


}

/**
 * Describes the allowed structure to load.
 * This is required because the loaded values will be used for BrowserWindow.
 * Therefore only the structure given below will be loaded in order to prevent malicious changes via configuration.
 */
const SECURITY_FILTER = {
    x: 0, y: 0, width: 0, height: 0
};

exports.windowConfigurer = new WindowConfigurer(SECURITY_FILTER, 'utf-8');