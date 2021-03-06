// noinspection DuplicatedCode

const actionDraw = 'draw';
const actionReDraw = 'redraw';

// noinspection JSUnusedGlobalSymbols
class ImageItem{
    /**
     * Item - image for drawing
     * @param fileName : string
     * @param canvasId : string
     * @param base64 : string
     */
    constructor(fileName, canvasId, base64){
        this.fileName = fileName;
        this.canvasId = canvasId;
        this.base64image = base64;
    }
}

class ImagesTransport{
    /**
     * Transport for sending patient and investigator image
     * @param approved : boolean?
     * @param images64 : ImageItem[]?
     */
    constructor(approved, images64) {
        this.approved = approved;
        this.images64 = images64;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Static assigner
     * @param json : string
     * @returns {ImagesTransport}
     */
    static getTransport(json){
        const imageTransport = new ImagesTransport();
        const obj = JSON.parse(json);
        imageTransport.approved = obj['approved'];
        imageTransport.images64 = obj['images64'];
        return imageTransport;
    }
}

class ActionTransport{
    /**
     * Transport for sending settings and actions
     * @param action : string?
     * @param consentId : string?
     * @param consent_type : string?
     * @param language : string?
     */
    constructor(action, consentId, consent_type, language) {
        this.action = action;
        this.consentId = consentId;
        this.consent_type = consent_type;
        this.language = language;
    }

    /**
     * Static assigner
     * @param json : string
     * @returns {ActionTransport}
     */
    static getTransport(json){
        const actionTransport = new ActionTransport();
        const obj = JSON.parse(json);
        actionTransport.action = obj['action'];
        actionTransport.consent_type = obj['consent_type'];
        actionTransport.consentId = obj['consentId'];
        actionTransport.language = obj['language'];
        return actionTransport;
    }
}