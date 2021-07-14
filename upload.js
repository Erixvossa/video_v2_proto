const input = document.getElementById('file-input');
const video = document.getElementById('video');
const videoSource = document.createElement('source');
const captureButton = document.querySelector('#cit');
const output = document.querySelector('.output');
const fastOutput = document.querySelector('.fast-output');
const popup = document.querySelector('.popup');

const blur = document.querySelector('.blur');


let imageWidth;
console.log(document.documentElement.clientHeight);
let videoHeight = (document.documentElement.clientHeight / 2) + "";
video.setAttribute('height', videoHeight)

let sceneArr = [];
let sceneArrToBack = [];

let screenWidth = Math.round(document.documentElement.scrollWidth / 60);

let pressed = false;
let moved = false;

let origX = 0;
let origY = 0;
let captureCoordsEndFlag = false;
let captureCoordsStartFlag = false;
const captureCoordsStart = (e) => {



    if (captureCoordsStartFlag) {
        captureCoordsStartFlag = false;

        origX = e.offsetX;
        origY = e.offsetY;

        blur.style.left = origX + 'px';
        blur.style.top = origY + 'px';



        let startX = e.offsetX;
        let startY = e.offsetY;
        console.log(`Начало выделения ${origX}, ${origY}`);
        // blur.style.left = startX + 'px';
        // blur.style.top = startY + 'px';
    }
    else if (captureCoordsEndFlag) {
        captureCoordsEndFlag = false;
        let endX = e.offsetX;
        let endY = e.offsetY;


        //console.log(`Конец выделения ${endX}, ${endY}`);
    }

    let pointerX = e.offsetX;
    let pointerY = e.offsetY;

    if(origX > pointerX){
        blur.style.left =  pointerX + 'px';
    }
    else  {
        blur.style.left =  origX + 'px';
    }
    if(origY > pointerY){
        blur.style.top = pointerY + 'px';
    }
    else {
        blur.style.top = origY + 'px';
    }


    blur.style.width = Math.abs(origX - pointerX) + 'px';
    blur.style.height = Math.abs(origY - pointerY) + 'px';
}


const removeControls = (e) => {
    if (pressed && moved) {
        video.removeAttribute('controls');
        blur.style.visibility = 'visible';
        captureCoordsStart(e);

    }
    else {
        video.setAttribute('controls', 'true');
        blur.style.visibility = 'hidden';
        captureCoordsStart(e);
    }
}


let isDown;
//let drag = false;
video.addEventListener('mousedown', (e) => {
    //drag = false;
    pressed = true;
    removeControls(e);
    captureCoordsStartFlag = true;

    // isDown = true;
    // origX = e.offsetX;
    // origY = e.offsetY;
    // blur.style.left = origX + 'px';
    // blur.style.top = origY + 'px';
    //





});
video.addEventListener('mousemove', (e) => {
    //drag = true;
    moved = true;
    removeControls(e);
    // let pointerX = e.offsetX;
    // let pointerY = e.offsetY;
    //
    // if(origX > pointerX){
    //     blur.style.left =  pointerX + 'px';
    // }
    // else  {
    //     blur.style.left =  origX + 'px';
    // }
    // if(origY > pointerY){
    //     blur.style.top = pointerY + 'px';
    // }
    // else {
    //     blur.style.top = origY + 'px';
    // }
    //
    //
    // blur.style.width = Math.abs(origX - pointerX) + 'px';
    // blur.style.height = Math.abs(origY - pointerY) + 'px';


});
document.addEventListener('mouseup', (e) => {
    //console.log(drag ? 'drag' : 'click');
    if (moved && pressed) {
        captureCoordsEndFlag = true;
    }
    moved = false;
    pressed = false;
    removeControls(e);
});



const generateScene = (sceneName) => {
    var w = video.videoWidth;
    var h = video.videoHeight;
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, w, h);
    var dataURL = canvas.toDataURL();

    var img = document.createElement('img');
    img.setAttribute('src', dataURL);


    let scene = {};
    scene.image = img;
    scene.time = video.currentTime;
    scene.name = sceneName;

    sceneArrToBack.push(scene);

    function sortByTime(arr) {
        arr.sort((a, b) => a.time < b.time ? 1 : -1);
    }

    sortByTime(sceneArrToBack);
    console.log(sceneArrToBack);


}

const renderScenes = () => {

    const sceneSelector = document.querySelector('.scene-selector');
    sceneSelector.innerHTML = '';

    const sceneList = document.querySelector('.scene-list');
    sceneList.innerHTML = '';


    sceneArrToBack.forEach((scene) => {
        const sceneSelectorElement = document.createElement('div');
        sceneSelectorElement.classList.add('scene-selector__scene');
        const sceneSelectorElementName = document.createElement('input');
        const sceneSelectorElementLabel = document.createElement('label');
        const sceneSelectorElementLabelSpan = document.createElement('span');

        sceneSelectorElementLabelSpan.textContent = `${scene.time} s.`;
        sceneSelectorElementLabel.append(sceneSelectorElementLabelSpan);
        sceneSelectorElementLabel.classList.add('scene-selector__label');
        sceneSelectorElementLabelSpan.classList.add('scene-selector__span');

        sceneSelector.prepend(sceneSelectorElement);
        sceneSelectorElementName.placeholder = 'Введите название сцены';
        sceneSelectorElementName.value = scene.name;
        sceneSelectorElementName.addEventListener('change', () => {
            scene.name = sceneSelectorElementName.value;
        })


        sceneSelectorElement.append(sceneSelectorElementLabel);
        sceneSelectorElementLabel.append(sceneSelectorElementName);
        sceneSelectorElement.addEventListener('click', () => {
            video.currentTime = scene.time;
        })

        const sceneListSceneContainer = document.createElement('div');
        const sceneListSceneName = document.createElement('p');
        sceneListSceneName.classList.add('scene-list__title');
        sceneListSceneContainer.classList.add('scene-list__container');
        sceneList.prepend(sceneListSceneContainer);
        scene.image.classList.add('scene-list__img');
        if (scene.name !== '') {
            sceneListSceneName.textContent = scene.name;
        }
        else {
            sceneListSceneName.textContent = 'Untitled';
        }


        sceneListSceneContainer.append(sceneListSceneName);
        sceneListSceneContainer.append(scene.image);
        sceneListSceneContainer.setAttribute('time', scene.time);
        sceneListSceneContainer.addEventListener('click', () => {
            // document.querySelectorAll('scene-list__container').forEach((sel) => {
            //     sel.classList.remove('scene-list__container_active');
            // })
            //sceneListSceneContainer.classList.add('scene-list__container_active')
            video.currentTime = sceneListSceneContainer.getAttribute('time');
        })


    })
}

const renderScenesPopupListener = () => {
    let sceneName = popup.querySelector('.popup__input').value;
    generateScene(sceneName);
    popup.querySelector('.popup__input').value = '';
    renderScenes();
}

popup.querySelector('.popup__button').addEventListener('click', renderScenesPopupListener);




const renderScenesListener = (e) => {
    e.preventDefault();
    //generateThumbnail(video.currentTime);
    //renderFirst();
    let sceneName = '';
    generateScene(sceneName);
    renderScenes();
}

captureButton.addEventListener('click', renderScenesListener);


document.addEventListener('click', (e) => {
    if (e.target !== document.querySelector('.scene_active') && e.target !== document.querySelector('.popup__input') && e.target !== document.querySelector('.popup__button')) {
        popup.classList.remove('popup_show');
    }
}, true);

function removeEventListeners () {
    captureButton.removeEventListener('click', renderScenesListener);
    popup.querySelector('.popup__button').removeEventListener('click', renderScenesPopupListener);
}




input.addEventListener('change', function() {
    const files = this.files || [];

    if (!files.length) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        videoSource.setAttribute('src', e.target.result);
        video.appendChild(videoSource);
        startEditor();
        //video.load();
        //video.play();
    };

    reader.onprogress = function (e) {
        console.log('progress: ', Math.round((e.loaded * 100) / e.total));
    };

    reader.readAsDataURL(files[0]);



});

// const generatePopup = (el, time) => {
//     const popup = document.createElement('div');
//     const sceneTime = document.createElement('p');
//     const button = document.createElement('div');
//     button.classList.add('popup__button');
//     button.textContent = 'Добавить сцену';
//     sceneTime.textContent = time;
//     popup.classList.add('popup');
//     popup.append(sceneTime);
//     popup.append(button);
//     el.prepend(popup);
// }


const startEditor = () => {

    sceneArr = [];
    sceneArrToBack = [];
    output.innerHTML = '';
    fastOutput.innerHTML = '';
    document.querySelector('.inaccurate-output').innerHTML = '';
    document.querySelector('.scene-selector').innerHTML = '';

    video.load();




    const addListeners = () => {
        const navigation = document.querySelectorAll('.navigation');

        navigation.forEach((el) => {
            const sceneTime = el.getAttribute('time');
            //console.log(sceneTime);
            el.addEventListener('click', () => {
                document.querySelectorAll('.navigation').forEach((element) => {
                    element.classList.remove('scene_active');
                    if (element.getAttribute('time') === sceneTime) {
                        element.classList.add('scene_active');
                    }
                });
                if (el.parentElement !== document.querySelector('.output')) {
                    console.log(sceneTime);
                    const targetWidth = (((sceneTime / 0.25) - 5) * imageWidth);
                    const width = targetWidth;
                    document.querySelector('.output').scrollTo({left: width, top: 0, behavior: 'smooth'});
                } else if (el.parentElement === document.querySelector('.output')) {

                }
                // sceneImg.forEach((scene) => {
                //     scene.classList.remove('scene_active');
                // });
                //el.classList.add('scene_active');
                //
                // if (document.querySelector('.inaccurate-output').getAttribute('time') === sceneTime) {
                //     const innacurateSceneImg =
                // }

            });
        });


    };


    const renderFirst = () => {
        output.innerHTML = "";
        sceneArr.forEach((scene) => {
            //generatePopup(scene);

            scene.image.classList.add('scene');
            scene.image.classList.add('navigation');
            scene.image.setAttribute('time', scene.time);
            scene.image.addEventListener('click', () => {
                video.currentTime = scene.time;
                popup.classList.add('popup_show');
                // document.querySelectorAll('.scene').forEach((sel) => {
                //     sel.classList.remove('scene_active');
                // });
                // scene.image.classList.add('scene_active');


                // document.querySelectorAll('.fastDiv').forEach((el) => {
                //     if (el.getAttribute('time') === scene.time) {
                //         el.classList.add('fastDiv_active');
                //     }
                // })


            })
            const sceneDiv = document.createElement('div');
            output.prepend(sceneDiv);
            //generatePopup(sceneDiv, scene.time);
            sceneDiv.prepend(scene.image);
        })

    }

    const renderSecond = () => {
        sceneArr.forEach((scene) => {
            const div = document.createElement('div');
            div.setAttribute('time', scene.time)
            div.classList.add('fastDiv');
            div.classList.add('navigation');
            div.textContent = '';
            div.addEventListener('click', () => {
                video.currentTime = scene.time;
            })
            fastOutput.prepend(div);
        })
    }

    const renderThird = () => {


        for (let i = 0; i < sceneArr.length; i = i + Math.round(sceneArr.length / screenWidth)) {
            const inaccurateOutput = document.querySelector('.inaccurate-output');
            const innacurateDiv = document.createElement('div');
            innacurateDiv.classList.add('inaccurate-output_div');
            const clonedImg = sceneArr[i].image.cloneNode(true);
            innacurateDiv.prepend(clonedImg);
            innacurateDiv.querySelector('img').classList.add('width');
            inaccurateOutput.prepend(innacurateDiv);
            //console.log(sceneArr[i].image);
            // console.log(videoTimeArr[i].time);

            innacurateDiv.addEventListener('click', () => {
                video.currentTime = sceneArr[i].time;
            })
            //console.log(sceneArr[i].time);

        }


    }


    var i = 0;
    video.addEventListener('loadeddata', function () {
        this.currentTime = i;
    });

    function generateThumbnail(i, scaleFactor) {
        if (scaleFactor == null) {
            scaleFactor = 0.125;
        }

        var w = video.videoWidth * scaleFactor;
        var h = video.videoHeight * scaleFactor;

        //generate thumbnail URL data
        let thecanvas = document.createElement('canvas');
        thecanvas.width = w;

        // для прокрутки верхнего ряда
        imageWidth = w;


        thecanvas.height = h;
        var context = thecanvas.getContext('2d');
        context.drawImage(video, 0, 0, w, h);
        var dataURL = thecanvas.toDataURL();


        //create img
        var img = document.createElement('img');
        img.setAttribute('src', dataURL);
        //Опциональный момент.
        //img.setAttribute('time', i);


        let scene = {};
        scene.image = img;
        scene.time = i;

        sceneArr.push(scene);

        function sortByTime(arr) {
            arr.sort((a, b) => a.time < b.time ? 1 : -1);
        }

        sortByTime(sceneArr);


        //append img in container div
        // document.querySelector('.output').appendChild(img);
        // img.addEventListener('click', () => {
        //     video.currentTime = i;
        // })
    }

    let activeGenerator = true;

    video.addEventListener('seeked', function (e) {

        if (activeGenerator) {
            // now video has seeked and current frames will show
            // at the time as we expect
            generateThumbnail(i);

            // when frame is captured, increase here by 5 seconds
            i += 0.25;

            // if we are not past end, seek to next interval
            if (i <= this.duration) {
                // this will trigger another seeked event
                this.currentTime = i;
            } else {
                activeGenerator = false;
                renderFirst();
                renderSecond();
                renderThird();
                //console.log(sceneArr);

                addListeners();
                video.currentTime = 0;

                video.addEventListener('timeupdate', () => {
                    let currentTime = video.currentTime;
                    let numberTwo = currentTime.toFixed(2) * 100;
                    let numberThree = ((Math.round(numberTwo / 25) * 25) / 100) + '';
                    //console.log(numberThree);
                    document.querySelectorAll('.navigation').forEach((scene) => {
                        if (scene.getAttribute('time') === numberThree) {
                            scene.classList.add('scene_active');
                            if (scene.parentElement.parentElement === document.querySelector('.output')) {

                                const targetWidth = (((scene.getAttribute('time') / 0.25) - 5) * imageWidth);
                                const width = targetWidth;
                                document.querySelector('.output').scrollTo({left: width, top: 0, behavior: 'smooth'});
                            }
                        }
                        else {
                            scene.classList.remove('scene_active');
                        }
                    })


                })
            }
        }
    });







}


// var videoId = 'video';
// var scaleFactor = 0.125;
// var snapshots = [];
// let videoTimeArr = [];
// let sceneArr = {};
//
//
//
// const captureButton = document.querySelector('#cit');
//
// /**
//  * Captures a image frame from the provided video element.
//  *
//  * @param {Video} video HTML5 video element from where the image frame will be captured.
//  * @param {Number} scaleFactor Factor to scale the canvas element that will be return. This is an optional parameter.
//  *
//  * @return {Canvas}
//  */
// function capture(video, scaleFactor) {
//     if (scaleFactor == null) {
//         scaleFactor = 1;
//     }
//     var w = video.videoWidth * scaleFactor;
//     var h = video.videoHeight * scaleFactor;
//     var canvas = document.createElement('canvas');
//     canvas.width = w;
//     canvas.height = h;
//     var ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, w, h);
//     return canvas;
// }
//
// /**
//  * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
//  */
//
// let screenWidth = Math.round(document.documentElement.scrollWidth / 40);
// console.log(screenWidth);
//
// const fillInaccurate = () => {
//     for (let i = 0; i < videoTimeArr.length; i = i + Math.round(videoTimeArr.length / screenWidth) ) {
//         const inaccurateOutput = document.querySelector('.inaccurate-output');
//         const innacurateDiv = document.createElement('div');
//         innacurateDiv.classList.add('inaccurate-output_div');
//         innacurateDiv.prepend(videoTimeArr[i].canvas);
//         innacurateDiv.querySelector('canvas').classList.add('width');
//         inaccurateOutput.prepend(innacurateDiv);
//         //console.log(videoTimeArr[i].time);
//
//         innacurateDiv.addEventListener('click', () => {
//             video.currentTime = videoTimeArr[i].time;
//         })
//
//     }
// }
//
//
// let counter = 0;
// function shoot(videoCurrentTime) {
//     //console.log(videoCurrentTime);
//     var video = document.getElementById(videoId);
//     var output = document.getElementById('output');
//     const fastOutput = document.querySelector('.fast-output');
//     var canvas = capture(video, scaleFactor);
//     canvas.onclick = function() {
//         window.open(this.toDataURL(image/jpg));
//     };
//     snapshots.unshift(canvas);
//     output.innerHTML = '';
//     fastOutput.innerHTML = '';
//
//     let scene = {};
//     scene.canvas = canvas;
//     scene.time = videoCurrentTime;
//
//
//     videoTimeArr.unshift(scene);
//     //console.log(videoTimeArr);
//
//     // arr = [1, 2, 3];
//     // arr.forEach(function(i, idx, array){
//     //     if (idx === array.length - 1){
//     //         console.log("Last callback call at index " + idx + " with value " + i );
//     //     }
//     // });
//
//
//
//     videoTimeArr.forEach((scene) => {
//             const div = document.createElement('div');
//             div.classList.add('scene');
//             div.append(scene.canvas)
//             div.setAttribute('time', scene.time);
//             output.prepend(div);
//
//             const fastDiv = document.createElement('div');
//             fastDiv.classList.add('fastDiv');
//             fastDiv.textContent = '';
//             fastOutput.prepend(fastDiv)
//
//
//             fastDiv.addEventListener('click', () => {
//                 video.currentTime = scene.time;
//                 div.classList.toggle('scene_active');
//             })
//
//             div.addEventListener('click', () => {
//                 video.currentTime = scene.time;
//                 div.classList.toggle('scene_active');
//             })
//
//             // if (video.currentTime % 2 === 0 ) {
//             //     console.log(video.currentTime);
//             // }
//             //console.log(scene.time)
//
//             // if (scene.time < 10) {
//             //     counter += 1;
//             //     console.log(counter)
//             // }
//         // console.log(videoTimeArr.length)
//     })
//
//     // for (let i = 0; i < videoTimeArr.length; i = videoTimeArr.length / 10 ) {
//     //     console.log(videoTimeArr[i]);
//     // }
//
//
//
//
//     //console.log(videoTimeArr.length)
//     // snapshots.forEach((snapshot) => {
//     //     const div = document.createElement('div');
//     //     div.append(snapshot)
//     //     output.append(div);
//     //
//     //
//     //
//     //     //div.setAttribute('time', videoCurrentTime);
//     // })
//
//
// }
//
// captureButton.addEventListener('click', (e) => {
//     e.preventDefault();
//     shoot();
// })
//
// let screens = {};
//
//
//
//
// video.addEventListener('loadeddata', () => {
//     console.log(video.duration)
//         const shootInterval = () => {
//             const videoCurrentTime = video.currentTime;
//             shoot(videoCurrentTime);
//             video.currentTime += 0.25;
//             console.log(videoTimeArr)
//
//                 if (video.currentTime + 0.25 >= video.duration) {
//                 clearInterval(interval)
//                 fillInaccurate();
//             }
//         }
//
//
//         const interval = setInterval(shootInterval, 150);
// })
//
// console.log(videoTimeArr.length)