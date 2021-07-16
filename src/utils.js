
//Фильтрация массива по значению time в объекте
import {blur} from "./variablex.js";



export let firstCoord = {
    x: 0,
    y: 0
};
export let lastCoord = {
    x: 0,
    y: 0
};







export let captureCoordsEndFlag = false;
export const setCaptureCoordsEndFlag = (bool) => {
    captureCoordsEndFlag = bool;
}
export let captureCoordsStartFlag = false;
export const setcaptureCoordsStartFlag = (bool) => {
    captureCoordsStartFlag = bool;
}

export const sortArrByTime = (arr) => {
    arr.sort((a, b) => a.time < b.time ? 1 : -1);
}

export const captureCoordsStart = (e) => {
    let x;
    let y;
    let width;
    let height;

    if (captureCoordsStartFlag) {
        captureCoordsStartFlag = false;

        firstCoord.x = e.offsetX;
        firstCoord.y = e.offsetY;

        x = firstCoord.x;
        y = firstCoord.y;
        //console.log(`Начало выделения ${firstCoord.x}, ${firstCoord.y}`);
    }
    else if (captureCoordsEndFlag) {
        captureCoordsEndFlag = false;
        lastCoord.x = e.offsetX;
        lastCoord.y = e.offsetY;
        //console.log(`Конец выделения ${lastCoord.x}, ${lastCoord.y}`);
    }
    let middleX = e.offsetX;
    let middleY = e.offsetY;

    if(firstCoord.x > middleX){
        x =  middleX;
    }
    else  {
        x =  firstCoord.x;
    }
    if(firstCoord.y > middleY){
        y = middleY;
    }
    else {
        y = firstCoord.y;
    }

    width = Math.abs(firstCoord.x - middleX);
    height = Math.abs(firstCoord.y - middleY);
    drawSelectionRange(x, y, width, height);
}

export const drawSelectionRange = (x, y, width, height) => {
    blur.style.left = x + 'px';
    blur.style.top = y + 'px';
    blur.style.width = width + 'px';
    blur.style.height = height + 'px';
}