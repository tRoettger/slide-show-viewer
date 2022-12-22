const fs = require("fs");

const IMG_EXT = [".JPG", ".PNG", ".GIF"];

const isImage = (file) => {
    if(file.stat.isFile()) {
        var extension = file.ext.toUpperCase();
        return IMG_EXT.includes(extension);
    } else {
        return false;
    }
};

const replaceAndWrap = (arg) => {
    var newArg = arg.replaceAll("\\\\", "\\\\\\\\");
    return "'" + newArg + "'";
}

class Controller {
    constructor() {}

    initialize(webContents) {
        this.webContents = webContents;
    }

    openAlbum(files) {
        files = files.filter(isImage);
        this.execute("openAlbum", files.length).then(res => {;
            for(var i = 0; i < files.length; i++) {
                const file = files[i];
                file.index = i;
                fs.readFile(file.path, (err, data) => {
                    var fileObject = file;
                    fileObject.data = data.toString('base64');
                    this.execute("showAlbumImage", JSON.stringify(fileObject));
                });
            }
        });
    }

    reload() {
        this.webContents.reloadIgnoringCache();
    }

    execute(method, ...args) {
        args = args.map(arg => typeof arg == "string" ? replaceAndWrap(arg) : arg);
        var command = method + "(" + args.join(", ") + ");";
        return this.webContents.executeJavaScript(command);
    }
};

exports.controller = new Controller();