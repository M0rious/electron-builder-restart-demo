const path = require("path");
const nodePersist = require("node-persist");
const {ipcRenderer, crashReporter, webFrame} = require('electron');

process.once("loaded", async () => {
    window.addEventListener('load', () => {
        webFrame.setZoomFactor(process.env.ZOOM ? Number(process.env.ZOOM) : 1);

    });
    init();
});

async function init() {




}


crashReporter.start({
    uploadToServer: false,
    companyName: "test",
    productName: "test",
    submitURL: ""
});
