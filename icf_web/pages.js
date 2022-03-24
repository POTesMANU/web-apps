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

const offline_mspps_pat = 'offline_mspps_pat';
const offline_mspps_vol = 'offline_mspps_vol';
const online_mspps_pat = 'online_mspps_pat';
const online_mspps_vol = 'online_mspps_vol';

let clicked = false;
let canvases = [];

const listenersObject = {

}

class Page {
    /**
     * Create new page from raw data
     * @param imgUrl : string to image resource in /img
     * @param isSignEnabled : boolean to mark writable pages
     * @param language : string to get needed language
     * @param identifier : string to identify needed consent
     * @param pageNumber : number to order pages on main list. May begin from 0
     */
    constructor(imgUrl, isSignEnabled, language, identifier, pageNumber) {
        this.imgUrl = imgUrl;
        this.isSignEnabled = isSignEnabled;
        this.language = language;
        this.identifier = identifier;
        this.pageNumber = pageNumber;
    }

    /**
     * Static creator of pages. ADD NEW CONSENT HERE
     * @returns {Page[]} array of pages to manipulate
     */
    static generateAllPages(){
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
    }

    /**
     * Public total lists draw method. DO NOT MODIFY
     * @param identifier : string to identify needed consent
     * @param language : string to get needed language
     * @param list : HTMLDivElement parent list
     */
    static drawAllPages(identifier, language, list){
        canvases = [];
        const pages = Page.generateAllPages()
            .filter(page => {
                return page.identifier === identifier && page.language === language;
            })
            .sort((page0, page1) => {
                const x = page0.pageNumber;
                const y = page1.pageNumber;
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        pages.forEach(page => {
                page.drawPage(list);
            });
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
    }

    /**
     * Per page drawing method. DO NOT MODIFY
     * @param list : HTMLDivElement parent list
     */
    drawPage(list){
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
                <div style="width: ${widthLoc}px; height: ${heightLoc}px; margin: 16px; background-size: contain; background-image: url('images/${this.imgUrl}'); box-shadow: #0006 0 2px 8px 2px" id="${pageId}" >
                    <canvas id="${canvasId}" width="${widthLoc}" height="${heightLoc}" style="position: absolute"></canvas>
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
                <div style="width: ${widthLoc}px; height: ${heightLoc}px; margin: 16px; background-size: contain; background-image: url('images/${this.imgUrl}'); box-shadow: #0006 0 2px 8px 2px" id="${pageId}" ></div>
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
    const ctx = canvas.getContext('2d');
    const left = canvas.getBoundingClientRect().left;
    if(listenersObject[canvasId] === undefined){
        listenersObject[canvasId] = {
            touchstart: (e) => {
                const x = e.changedTouches[0].pageX - left;
                const y = e.changedTouches[0].pageY - heightTop;
                drawLines(x, y, ctx, START);
            },
            touchmove: (e) => {
                e.preventDefault();
                const x = e.changedTouches[0].pageX - left;
                const y = e.changedTouches[0].pageY - heightTop;
                drawLines(x, y, ctx, MOVE);
            },
            touchend: (e) => {
                const x = e.changedTouches[0].pageX - left;
                const y = e.changedTouches[0].pageY - heightTop;
                drawLines(x, y, ctx, END);
            },
            mousedown: (e) => {
                clicked = true;
                const x = e.pageX - left;
                const y = e.pageY - heightTop;
                drawLines(x, y, ctx, START);
            },
            mousemove: (e) => {
                if(clicked){
                    const x = e.pageX - left;
                    const y = e.pageY - heightTop;
                    drawLines(x, y, ctx, MOVE);
                }
            },
            mouseup: (e) => {
                const x = e.pageX - left;
                const y = e.pageY - heightTop;
                if(clicked){
                    drawLines(x, y, ctx, END);
                }
                clicked = false;
            }
        }
    }

    if(enable){
        document.getElementById(pageEditIdProto + pageNumber).style.color = '#00695c';
        document.getElementById(pageMoveIdProto + pageNumber).style.color = '#000';
        canvas.style.cursor = 'crosshair';
        ctx.strokeStyle = "#222222";
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
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
 * @param action : string to determine line position of event
 */
function drawLines(x, y, ctx, action){
    switch (action){
        case START:
            ctx.beginPath();
            ctx.moveTo(x, y);
            break;
        case MOVE:
            ctx.lineTo(x, y);
            ctx.stroke();
            break;
        case END:
            ctx.closePath();
            break;
    }
}

/**
 * Function to wipe this page canvas
 * @param canvasId : string id of target canvas
 */
function wipeCanvas(canvasId){
    const canvas = document.getElementById(canvasId);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}