// noinspection DuplicatedCode
'use strict'

const pageCanvasIdProto = 'pageCanvas';
const pagePageIdProto = 'pagePage';
const pageStickIdProto = 'pageStick';
const pageEditIdProto = 'pageEdit';
const pageMoveIdProto = 'pageMove';

const START = 'START';
const MOVE = 'MOVE';
const END = 'END';

const LANG_RU = 'ru';
const LANG_UA = 'ua';

/*const offline_mspps_pat = 'offline_mspps_pat';
const offline_mspps_vol = 'offline_mspps_vol';
const online_mspps_pat = 'online_mspps_pat';
const online_mspps_vol = 'online_mspps_vol';*/

let clicked = false;
let canvases = [];

let currentLine = 0;
const colors = [
    '#00796B', '#388E3C',
    '#FBC02D', '#F57C00',
    '#D32F2F', '#7B1FA2',
    '#303F9F', '#1976D2'
];
let timer;
let points;

const listenersObject = {

}

class Page {
    /**
     * Create new page from raw data
     * @param backgroundName : string to image resource in /img
     * @param isSignEnabled : boolean to mark writable pages
     * @param lang : string to get needed language
     * @param type : string to identify needed consent
     * @param pageNumber : number to order pages on main list. May begin from 0
     */
    constructor(backgroundName, isSignEnabled, lang, type, pageNumber) {
        this.backgroundName = backgroundName;
        this.isSignEnabled = isSignEnabled;
        this.lang = lang;
        this.type = type;
        this.pageNumber = pageNumber;
    }

    /**
     * Static creator of pages. ADD NEW CONSENT HERE
     * @returns {Page[]} array of pages to manipulate
     */
    /*static generateAllPages(){
        return [
            new Page('cnstOP.sheet.1.ru.png', true, LANG_RU, online_mspps_pat, 0),
            new Page('cnstOP.sheet.1.ua.png', true, LANG_UA, online_mspps_pat, 0),
            new Page('cnstOV.sheet.1.ru.png', true, LANG_RU, online_mspps_vol, 0),
            new Page('cnstOV.sheet.1.ua.png', true, LANG_UA, online_mspps_vol, 0),
            new Page('cnst.sheet.1.ru0.png', false, LANG_RU, offline_mspps_pat, 0),
            new Page('cnst.sheet.1.ua0.png', false, LANG_UA, offline_mspps_pat, 0),
            new Page('cnst.sheet.2.ru.png', true, LANG_RU, offline_mspps_pat, 1),
            new Page('cnst.sheet.2.ua.png', true, LANG_UA, offline_mspps_pat, 1),
            new Page('cnst.sheet.1.ru0.png', false, LANG_RU, offline_mspps_vol, 0),
            new Page('cnst.sheet.1.ua0.png', false, LANG_UA, offline_mspps_vol, 0),
            new Page('cnstV.sheet.2.ru.png', true, LANG_RU, offline_mspps_vol, 1),
            new Page('cnstV.sheet.2.ua.png', true, LANG_UA, offline_mspps_vol, 1)
        ];
    }*/

    /**
     * Public total lists draw method. DO NOT MODIFY
     * @param consentId : string to identify needed consent
     * @param consent_type : string to identify needed type
     * @param language : string to get needed language
     * @param list : HTMLDivElement parent list
     */
    static drawAllPages(consentId, consent_type, language, list){
        canvases = [];
        if(language === "ua"){
            language = 'uk';
        }
        let loc = '';
        for (const locKey of location.href.split('/')) {
            if(!locKey.endsWith(".html") && (!locKey.startsWith("http"))){
                loc = loc + "/" + locKey;
            }
        }
        fetch(location.protocol + loc + "/" + consentId + "/pages.json")
            .then((response) => {
                response.text().then((text) => {
                    const pages = [];
                    JSON.parse(text)
                        .filter(page => {
                            return page.type === consent_type && page.lang === language;
                        })
                        .sort((page0, page1) => {
                            const x = page0.pageNumber;
                            const y = page1.pageNumber;
                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                        })
                        .forEach((page) => {
                            pages.push(new Page(page.backgroundName, page.isSignEnabled, page.lang, page.type, page.number))
                        });
                    pages.forEach(page => {
                        page.drawPage(list, consentId);
                    });
                    console.log(JSON.parse(text));
                    console.log(language);
                    const widthLoc = window.innerWidth - 33;
                    const heightLoc = Math.round(widthLoc * Math.sqrt(2));
                    window.onscroll = () => {
                        setTimeout(() => {
                            pages.forEach(page => {
                                if(page.isSignEnabled){
                                    const currentPageOffset = document.getElementById(pagePageIdProto + page.pageNumber).getBoundingClientRect().top;
                                    if(currentPageOffset < 0 && currentPageOffset > -(heightLoc - 148)){
                                        document.getElementById(pageStickIdProto + page.pageNumber).style.top = -currentPageOffset + 16 + 'px';
                                    }
                                    else if(currentPageOffset > 0){
                                        document.getElementById(pageStickIdProto + page.pageNumber).style.top = '16px';
                                    }
                                }
                            });
                        }, 200);
                    }
                    timer = new Date();
                });
            })
    }

    /**
     * Per page drawing method. DO NOT MODIFY
     * @param list : HTMLDivElement parent list
     * @param consentId : string as part of address
     */
    drawPage(list, consentId){
        const widthLoc = window.innerWidth - 33;
        const heightLoc = Math.round(widthLoc * Math.sqrt(2));
        const heightTop = (heightLoc + 16) * this.pageNumber + 16;
        const canvasId = pageCanvasIdProto + this.pageNumber;
        const pageId = pagePageIdProto + this.pageNumber;
        const stickId = pageStickIdProto + this.pageNumber;
        const editId = pageEditIdProto + this.pageNumber;
        const moveId = pageMoveIdProto + this.pageNumber;
        if(this.isSignEnabled){
            canvases.push(canvasId);
            list.insertAdjacentHTML('beforeend', `
                <!--suppress CssUnknownTarget -->
                <div style="width: ${widthLoc}px; height: ${heightLoc}px; margin: 16px; background-size: contain; background-image: url('${consentId + '/images/' + this.backgroundName}'); box-shadow: #0006 0 2px 8px 2px" id="${pageId}" >
                    <canvas id="${canvasId}" width="${widthLoc * 2}" height="${heightLoc * 2}" style="width: ${widthLoc}px; height: ${heightLoc}px; position: absolute; "></canvas>
                    <canvas id="${canvasId + 'shadow'}" width="${widthLoc * 2}" height="${heightLoc * 2}" style="width: ${widthLoc}px; height: ${heightLoc}px; position: absolute; display: none"></canvas>
                    <div style="margin: 16px; z-index: 5; position: relative; width: fit-content; background-color: #ccc; padding: 8px; border-radius: 8px; box-shadow: #0008 0 2px 6px 1px; display: flex; flex-direction: column" id="${stickId}">
                        <span class="material-icons" id="${editId}" style="font-size: 32px; cursor: pointer; user-select: none" onclick="enableCanvas(${this.pageNumber}, true, ${heightTop})">mode</span>
                        <span class="material-icons" id="${moveId}" style="color: #00695c; margin-bottom: 12px; margin-top: 8px; font-size: 32px; cursor: pointer; user-select: none" onclick="enableCanvas(${this.pageNumber}, false, ${heightTop})">touch_app</span>
                        <span class="material-icons" style="font-size: 32px; cursor: pointer; user-select: none" onclick="wipeCanvas('${canvasId}')">delete</span>
                    </div>
                </div>
            `)
        }
        else{
            list.insertAdjacentHTML('beforeend', `
                <div style="width: ${widthLoc}px; height: ${heightLoc}px; margin: 16px; background-size: contain; background-image: url('${consentId + '/images/' + this.backgroundName}'); box-shadow: #0006 0 2px 8px 2px" id="${pageId}" ></div>
            `)
        }
    }
}

/**
 * Function to init canvas drawing abilities
 * @param pageNumber : number number of target canvas to draw
 * @param enable : boolean to determine if is enabled
 * @param heightTop : number to make correct top offset
 */
function enableCanvas(pageNumber, enable, heightTop){
    const canvasId = pageCanvasIdProto + pageNumber;
    const canvas = document.getElementById(canvasId);
    const canvasShadow = document.getElementById(canvasId + "shadow");
    const ctx = canvas.getContext('2d');
    const ctxShadow = canvasShadow.getContext('2d');
    const left = canvas.getBoundingClientRect().left;
    if(listenersObject[canvasId] === undefined){
        listenersObject[canvasId] = {
            touchstart: (e) => {
                const x = e.changedTouches[0].pageX - left;
                const y = e.changedTouches[0].pageY - heightTop;
                drawLines(x, y, ctx, ctxShadow, START);
            },
            touchmove: (e) => {
                e.preventDefault();
                const x = e.changedTouches[0].pageX - left;
                const y = e.changedTouches[0].pageY - heightTop;
                drawLines(x, y, ctx, ctxShadow, MOVE);
            },
            touchend: (e) => {
                const x = e.changedTouches[0].pageX - left;
                const y = e.changedTouches[0].pageY - heightTop;
                drawLines(x, y, ctx, ctxShadow, END);
            },
            mousedown: (e) => {
                clicked = true;
                const x = e.pageX - left;
                const y = e.pageY - heightTop;
                drawLines(x, y, ctx, ctxShadow, START);
            },
            mousemove: (e) => {
                if(clicked){
                    const x = e.pageX - left;
                    const y = e.pageY - heightTop;
                    drawLines(x, y, ctx, ctxShadow, MOVE);
                }
            },
            mouseup: (e) => {
                const x = e.pageX - left;
                const y = e.pageY - heightTop;
                if(clicked){
                    drawLines(x, y, ctx, ctxShadow, END);
                }
                clicked = false;
            }
        }
    }

    if(enable){
        document.getElementById(pageEditIdProto + pageNumber).style.color = '#00695c';
        document.getElementById(pageMoveIdProto + pageNumber).style.color = '#000';
        canvas.style.cursor = 'crosshair';
        ctx.strokeStyle = "#0d47a1";
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctxShadow.strokeStyle = colors[0];
        ctxShadow.fillStyle = colors[0];
        ctxShadow.lineWidth = 4;
        ctxShadow.lineJoin = 'round';
        ctxShadow.lineCap = 'round';
        ctxShadow.font = '28px sans-serif';
        canvas.addEventListener("touchstart", listenersObject[canvasId].touchstart, false);
        canvas.addEventListener("touchmove", listenersObject[canvasId].touchmove, false);
        canvas.addEventListener("touchend", listenersObject[canvasId].touchend, false);
        canvas.addEventListener("mousedown", listenersObject[canvasId].mousedown, false);
        canvas.addEventListener("mousemove", listenersObject[canvasId].mousemove, false);
        document.addEventListener("mouseup", listenersObject[canvasId].mouseup, false);
    }
    else{
        document.getElementById(pageMoveIdProto + pageNumber).style.color = '#00695c';
        document.getElementById(pageEditIdProto + pageNumber).style.color = '#000';
        canvas.style.cursor = 'default';
        canvas.removeEventListener("touchstart", listenersObject[canvasId].touchstart, false);
        canvas.removeEventListener("touchmove", listenersObject[canvasId].touchmove, false);
        canvas.removeEventListener("touchend", listenersObject[canvasId].touchend, false);
        canvas.removeEventListener("mousedown", listenersObject[canvasId].mousedown, false);
        canvas.removeEventListener("mousemove", listenersObject[canvasId].mousemove, false);
        document.removeEventListener("mouseup", listenersObject[canvasId].mouseup, false);
    }
}

/**
 * Function to draw lines on canvas
 * @param x : number ordinate of point
 * @param y : number abscissa of point
 * @param ctx : CanvasRenderingContext2D render context
 * @param ctxShadow : CanvasRenderingContext2D render context
 * @param action : string to determine line position of event
 */
function drawLines(x, y, ctx, ctxShadow, action){
    x = x * 2;
    y = y * 2;
    switch (action){
        case START:
            points = [];
            const time = (new Date().getTime() - timer.getTime()).toString();
            ctxShadow.beginPath();
            ctxShadow.arc(x, y, 10, 0, Math.PI * 2);
            ctxShadow.stroke();
            ctxShadow.closePath();
            timer = new Date();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctxShadow.beginPath();
            ctxShadow.moveTo(x, y);
            points.push([x, y]);
            ctxShadow.fillText(time, x, y - 16);
            break;
        case MOVE:
            ctx.lineTo(x, y)
            ctx.stroke();
            ctxShadow.lineTo(x, y)
            ctxShadow.stroke();
            points.push([x, y]);
            break;
        case END:
            ctx.closePath();
            ctxShadow.closePath();
            currentLine++;
            points.push([x, y]);
            const drawTime = new Date().getTime() - timer.getTime();
            let length = 0;
            for(let i = 0; i < points.length - 1; i++){
                length = length + Math.sqrt(Math.pow((points[i + 1][0] - points[i][0]), 2) + Math.pow((points[i + 1][1] - points[i][1]), 2));
            }
            const endEvaluation1 = "Время линии " + currentLine + ": " + drawTime + " мс";
            const endEvaluation2 = "Длина: " + length.toFixed(2) + " пикс";
            const endEvaluation3 = "Скорость: " + (length / (drawTime / 1000)).toFixed(2) + " пикс/с";
            ctxShadow.fillText(endEvaluation1, x, y - 76);
            ctxShadow.fillText(endEvaluation2, x, y - 46);
            ctxShadow.fillText(endEvaluation3, x, y - 16);
            ctxShadow.beginPath();
            ctxShadow.moveTo(x, y - 10);
            ctxShadow.lineTo(x + 16, y);
            ctxShadow.lineTo(x, y + 10);
            ctxShadow.closePath();
            ctxShadow.stroke();
            ctxShadow.strokeStyle = colors[currentLine % 8];
            ctxShadow.fillStyle = colors[currentLine % 8];
            timer = new Date();
            break;
    }
}

/**
 * Function to wipe this page canvas
 * @param canvasId : string id of target canvas
 */
function wipeCanvas(canvasId){
    const canvas = document.getElementById(canvasId);
    const canvasShadow = document.getElementById(canvasId + "shadow");
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvasShadow.getContext('2d').clearRect(0, 0, canvasShadow.width, canvasShadow.height);
    timer = new Date();
}