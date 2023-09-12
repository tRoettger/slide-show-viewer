/**
 * Contains channels to provide the server with information.
 */
exports.InChannel = {
    APPLICATION_READY: "application-ready",
    CHANGE_ALBUM_ORDER: "change-album-order",
    CONTROL_SLIDESHOW: {
        START: "control-slideshow-start",
        START_OR_STOP: "control-slideshow-start-or-stop",
        STOP: "control-slideshow-stop",
        NEXT: "control-slideshow-next",
        PREVIOUS: "control-slideshow-previous"
    },
    GET_IMAGES: "get-images",
    GET_SLIDESHOW_CONFIG: "get-slideshow-config",
    FILTER_ALBUMS: "filter-albums",
    LOAD_ALBUM: "load-album",
    REQUEST_ALBUMS: "request-albums",
    SHOW_ALBUM_POPUP: "show-album-popup",
    SAVE_CONFIG: "save-config",
    SAVE_CONFIG_AS: "save-config-as",
    SUBSCRIBE: "subscribe"
};

/**
 * Contains channels via which the server provides information.
 */
exports.OutChannel = {
    CONFIGURE_SLIDESHOW: "configure-slideshow",
    CONTROL_SLIDESHOW: {
        START: "control-slideshow-start",
        STOP: "control-slideshow-stop",
        NEXT: "control-slideshow-next",
        PREVIOUS: "control-slideshow-previous"
    },
    NOTIFY_ALBUM: "notify-album",
    NOTIFY_ALBUM_CHANGED: "notify-album-changed",
    NOTIFY_PAGE_INFO: "notify-page-info",
    OPEN_ALBUM: "open-album",
    PROVIDE_IMAGE: "provide-image",
};