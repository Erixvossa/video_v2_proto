import {input, blur, video, videoSource, popup, output, fastOutput, videoHeight, sceneList} from './src/variablex.js';

import { sortArrByTime, sortArrByTimeSmallToBig, captureCoordsStart, captureCoordsEndFlag, captureCoordsStartFlag, setCaptureCoordsEndFlag, setcaptureCoordsStartFlag, getBlurCoords } from './src/utils.js';



//Массив всех сцен для фронта
export let sceneArr = [];

//Массив сцена для передачи на бэк
export let sceneArrToBack = [];

//массив сцен блюр для бэка
let blurArr = [];

let widthForScroll;
let imageWidth;

video.setAttribute('height', videoHeight);


let screenWidth = Math.round(document.documentElement.scrollWidth / 60);
//console.log(screenWidth);

const navigationContainer = document.querySelector('.navigation-container');
const blurPopup = document.querySelector('.blur-popup');




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

let pressed = false;
let moved = false;

let preventDefToggled = false;
const preventDef = (e) => {
    e.preventDefault()
}

video.addEventListener('mousedown', (e) => {
    pressed = true;
    moved = false;
    removeControls(e);
    setcaptureCoordsStartFlag(true);
    if (preventDefToggled) {
        video.removeEventListener('click', preventDef);
        preventDefToggled = false;
    }


});
video.addEventListener('mousemove', (e) => {
    moved = true;
    removeControls(e);
    if (pressed && moved && !preventDefToggled) {
        video.addEventListener('click', preventDef);
        preventDefToggled = true;
    }
});


// const createBlurScene = () => {
//     let isCurrentScene = false;
//     blurArr.forEach((scene) => {
//         if (scene.time === video.currentTime) {
//             isCurrentScene = true;
//         }
//     })
//     if (!isCurrentScene) {
//         let scene = {};
//         scene.time = video.currentTime;
//         blurArr.push(scene);
//     }
// }

document.addEventListener('mouseup', (e) => {
    if (moved && pressed) {
        setcaptureCoordsStartFlag(false);
        setCaptureCoordsEndFlag(true);
        e.preventDefault();
        console.log('отпустили');

        blurPopup.classList.add('blur-popup_show');

        // sceneArrToBack.forEach((scene) => {
        //     if (scene.time === video.currentTime) {
        //         getBlurCoords(scene);
        //         console.log(scene);
        //     }
        // })
        //console.log('отпустили.');
        //video.addEventListener('click', preventDef);
        //video.removeEventListener('click', preventDef);
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

    let sceneFounded = false;
    sceneArrToBack.forEach((scene) => {
        if (scene.time === video.currentTime) {
            sceneFounded = true;
        }
    })

    if (!sceneFounded) {
        sceneArrToBack.push(scene);
    }


    sortArrByTime(sceneArrToBack);
    //console.log(sceneArrToBack);
}

const renderScenes = () => {



    const sceneSelector = document.querySelector('.scene-selector');
    sceneSelector.innerHTML = '';

    const sceneList = document.querySelector('.scene-list');
    sceneList.innerHTML = '';

    console.log('архив отсортирован');
    sortArrByTimeSmallToBig(sceneArrToBack);

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
            sceneSelectorElementName.classList.add('scene-selector__input');
            sceneSelectorElementName.placeholder = 'Scene name';
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
            } else {
                sceneListSceneName.textContent = 'Untitled';
            }


            sceneListSceneContainer.append(sceneListSceneName);
            sceneListSceneContainer.append(scene.image);
            sceneListSceneContainer.setAttribute('time', scene.time);
            sceneListSceneContainer.addEventListener('click', () => {
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



document.addEventListener('click', (e) => {
    if (e.target !== document.querySelector('.scene_active') && e.target !== document.querySelector('.popup__input') && e.target !== document.querySelector('.popup__button')) {
        popup.classList.remove('popup_show');
    }
}, true);




input.addEventListener('change', function() {
    const files = this.files || [];

    if (!files.length) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        console.log('reader-onload');
        if (video.querySelector('source')) {
            video.innerHTML = '';
        }
        videoSource.setAttribute('src', e.target.result);


        //videoSource.setAttribute('src', 'https://appstorespy.com/s/ftue/blured.mp4');
        video.appendChild(videoSource);
        startEditor();
    };
    //Отображание прогресса загрузки видео
    // reader.onprogress = function (e) {
    //     console.log('progress: ', Math.round((e.loaded * 100) / e.total));
    // };

    reader.readAsDataURL(files[0]);
});

const startEditor = () => {
    console.log('editor is started');
    sceneArr = [];
    sceneArrToBack = [];
    sceneList.innerHTML = '';
    output.innerHTML = '';
    fastOutput.innerHTML = '';
    document.querySelector('.inaccurate-output').innerHTML = '';
    document.querySelector('.scene-selector').innerHTML = '';
    let hidedVideo;
    let lazyVideo;
    let videoLength;
    let n = 0.25;

    video.load();



    const addListeners = () => {
        const navigation = document.querySelectorAll('.navigation');

        navigation.forEach((el) => {
            const sceneTime = el.getAttribute('time');
            //console.log(sceneTime);
            const doALotOf = () => {
                document.querySelectorAll('.navigation').forEach((element) => {
                    element.classList.remove('scene_active');
                    if (element.getAttribute('time') === sceneTime) {
                        element.classList.add('scene_active');
                    }
                });
                if (el.parentElement !== document.querySelector('.output')) {

                    //console.log(sceneTime);
                    let newWidth = document.querySelector('.output').querySelector('.scene').clientWidth;
                    //console.log(document.querySelector('.output').querySelector('.scene').clientWidth);
                    //console.log(document.querySelector('.output').scrollWidth);
                    const targetWidth = (((sceneTime / 0.25) - 1) * newWidth);

                    const width = targetWidth;
                    document.querySelector('.output').scrollTo({left: width, top: 0, behavior: 'smooth'});


                } else if (el.parentElement === document.querySelector('.output')) {

                }
            }
            el.removeEventListener('click', doALotOf);
            el.addEventListener('click', doALotOf);
        });
    };

    const renderFirst = () => {
        output.innerHTML = "";
        //console.log(sceneArr)
        let w = (video.videoWidth * 0.3) + 'px';
        let h = (video.videoHeight * 0.3) + 'px';
        sceneArr.forEach((scene) => {
            const sceneDiv = document.createElement('div');
            const sceneP = document.createElement('p');
            sceneP.textContent = `${scene.time}`;
            sceneDiv.classList.add('scene');
            sceneDiv.classList.add('navigation');
            sceneDiv.style.minWidth = w;
            sceneDiv.style.minHeight = h;
            sceneDiv.setAttribute('time', scene.time);
            sceneDiv.addEventListener('click', () => {
                video.currentTime = scene.time;
                popup.classList.add('popup_show');
            });
            sceneDiv.append(sceneP);
            output.append(sceneDiv);


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
            fastOutput.append(div);
        })
    }

    const renderThird = () => {
        //console.log(sceneArr);
        const inaccurateOutput = document.querySelector('.inaccurate-output');
        inaccurateOutput.innerHTML = '';
        for (let i = 0; i < sceneArr.length; i = i + Math.round(sceneArr.length / screenWidth)) {
            //console.log(i);

            const innacurateDiv = document.createElement('div');
            innacurateDiv.classList.add('inaccurate-output_div');
            const clonedImg = sceneArr[i].image.cloneNode(true);
            innacurateDiv.prepend(clonedImg);
            innacurateDiv.querySelector('img').classList.add('width');
            innacurateDiv.querySelector('img').classList.add('navigation');
            inaccurateOutput.append(innacurateDiv);
            //console.log(sceneArr[i].image);
            // console.log(videoTimeArr[i].time);
            innacurateDiv.addEventListener('click', () => {
                video.currentTime = sceneArr[i].time;
            })
            //console.log(sceneArr[i].time);
        }
    }

    const renderAlternateThird = () => {
        // console.log('counter')
        const screenWidthInPx = document.querySelector('.page').clientWidth;
        const inaccurateOutput = document.querySelector('.inaccurate-output');
        let maxWidth = screenWidthInPx / (Math.round((sceneArr[sceneArr.length - 1].time) / (((sceneArr.length / screenWidth)) * n)));
        inaccurateOutput.innerHTML = '';
        sceneArr.forEach((scene) => {
            if (scene.image) {
                //console.log(scene)
                const innacurateDiv = document.createElement('div');
                innacurateDiv.classList.add('inaccurate-output_div');
                const clonedImg = scene.image.cloneNode(true);
                innacurateDiv.prepend(clonedImg);
                // console.log(Math.round((sceneArr[sceneArr.length - 1].time) / (((sceneArr.length / screenWidth)) * n)));
                // console.log(screenWidthInPx / (Math.round((sceneArr[sceneArr.length - 1].time) / (((sceneArr.length / screenWidth)) * n))));

                innacurateDiv.style.maxWidth = maxWidth + 'px';
                innacurateDiv.querySelector('img').classList.add('width');
                innacurateDiv.querySelector('img').classList.add('navigation');
                inaccurateOutput.append(innacurateDiv);
                innacurateDiv.addEventListener('click', () => {
                    video.currentTime = scene.time;
                })
            }
        })
    }


    let i = 0;
    const loadedDataListener = () => {
        //console.log('массив sceneArr наполнился временами');
        //console.log(sceneArr);
        video.currentTime = i;
        videoLength = video.duration;
        let scenesCount = Math.round(videoLength / n);
        //console.log(scenesCount);
        const timesCounter = () => {
            let currentTime = 0;
            for (let i = 0; i < scenesCount; i ++) {
                //console.log(i)
                let scene = {}
                scene.time = currentTime;
                sceneArr.push(scene);
                currentTime += 0.25;
            }
        }
        timesCounter();

        hidedVideo = video.cloneNode(true);
        document.querySelector('.hided-video').prepend(hidedVideo);
        video.removeEventListener('loadeddata', loadedDataListener);
    }

    video.addEventListener('loadeddata', loadedDataListener);

    function generateThumbnail(i, caller, scaleFactor) {
        //console.log(i, caller)
        if (scaleFactor == null) {
            scaleFactor = 0.25;
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
        if (caller === 'video') {
            context.drawImage(video, 0, 0, w, h);
        }
        else if (caller === 'hidedVideo') {
            context.drawImage(hidedVideo, 0, 0, w, h);
        }
        else if (caller === 'lazyVideo') {
            context.drawImage(lazyVideo, 0, 0, w, h);
        }
        var dataURL = thecanvas.toDataURL();
        //create img
        const image = document.createElement('img');
        image.setAttribute('src', dataURL);
        image.setAttribute('time', i);
        sceneArr.forEach((scene) => {
            if (scene.time === i && !scene.image) {
                scene.image = image;
                //console.log(scene, caller)
            }
        })
        sortArrByTime(sceneArr);
        //console.log(sceneArr)
    }



    const syncVideoToScene = () => {
        let currentTime = video.currentTime;
        let numberTwo = currentTime.toFixed(2) * 100;
        let numberThree = ((Math.round(numberTwo / 25) * 25) / 100) + '';
        //console.log(numberThree);
        document.querySelectorAll('.navigation').forEach((scene) => {
            if (scene.getAttribute('time') === numberThree) {
                scene.classList.add('scene_active');
                if (scene.parentElement === document.querySelector('.output')) {

                    let newWidth = document.querySelector('.output').querySelector('.scene').clientWidth;
                    //console.log(document.querySelector('.output').querySelector('.scene').clientWidth);
                    //console.log(document.querySelector('.output').scrollWidth);
                    const targetWidth = (((scene.getAttribute('time') / 0.25) - 1) * newWidth);

                    const width = targetWidth;
                    document.querySelector('.output').scrollTo({left: width, top: 0, behavior: 'smooth'});
                }
            }
            else {
                scene.classList.remove('scene_active');
            }
        })
    }




    let activeGenerator = true;
    let step = 0;
    video.addEventListener('seeked', function (e) {
        let caller = 'video';
        if (activeGenerator) {
            // now video has seeked and current frames will show
            // at the time as we expect
            generateThumbnail(step, caller);
            renderAlternateThird();
            // when frame is captured, increase here by 5 seconds
            //i += 0.25;
            step += (Math.round(sceneArr.length / screenWidth)) * n;
            // if we are not past end, seek to next interval
            if (step <= this.duration) {
                // this will trigger another seeked event
                this.currentTime = step;
            } else {
                activeGenerator = false;
                renderFirst();
                renderSecond();
                //renderThird();

                addListeners();
                video.currentTime = 0;
                startSeekedVideoListening();
            }
        }
    });


    video.addEventListener('timeupdate', syncVideoToScene);

    let starterReady = true;

    function isScrolledIntoView(el) {
        let percentVisible = 0.1;
        let elemLeft = el.getBoundingClientRect().left;
        let elemRight = el.getBoundingClientRect().right;
        let elemWidth = el.getBoundingClientRect().width;
        let overhang = elemWidth * (1 - percentVisible);
        let isVisible = (elemLeft >= -overhang) && (elemRight <= output.clientWidth + overhang);
        return isVisible;
    }


    let queueArr = []


    function generateSceneHided(scaleFactor) {
        //console.log(new Date().toLocaleTimeString() + 'начало фотки и рендеринга')
        if (scaleFactor == null) {
            scaleFactor = 1;
        }
        let i = hidedVideo.currentTime;

        var w = video.videoWidth * scaleFactor;
        var h = video.videoHeight * scaleFactor;
        widthForScroll = w;

        let thecanvas = document.createElement('canvas');
        thecanvas.width = w;
        imageWidth = w;

        thecanvas.height = h;
        var context = thecanvas.getContext('2d');
        context.drawImage(hidedVideo, 0, 0, w, h);

        var dataURL = thecanvas.toDataURL();
        //create img
        const image = document.createElement('img');
        image.setAttribute('src', dataURL);
        image.setAttribute('time', i);

        if (!sceneArr[i / n].image) {
            sceneArr[i / n].image = image;
            //console.log(new Date().toLocaleTimeString() + 'сцену добавили в массив');
            //console.log(sceneArr[i / n]);
        }
        // else if (sceneArr[i / n].image !== image) {
        //     sceneArr[i / n].image = image;
        // }
        else {
            //console.log(sceneArr[i / n]);
            sceneArr[i / n].image = image;
        }
        // console.log(sceneArr[i / n].image);

        sceneArr.forEach((scene) => {
            if (scene.image) {
                output.querySelectorAll('div').forEach((el) => {
                    // if (el.getAttribute('time') == scene.time && !el.querySelector('img')) {
                    if (el.getAttribute('time') == scene.time) {
                        if (el.querySelector('img') !== scene.image) {
                            //console.log(el);
                            el.innerHTML = '';
                            el.append(scene.image);
                            const sceneP = document.createElement('p');
                            sceneP.textContent = `${scene.time}`;
                            el.prepend(sceneP);
                        }
                        //el.innerHTML = '';
                        //el.append(scene.image);
                        //console.log(new Date().toLocaleTimeString() + 'отрендерили на странице сцену');
                    }
                })
            }
        })
        busy = false;
        starterReady = true;
        //queueArr.shift();
        //console.log(queueArr);
        //console.log(new Date().toLocaleTimeString() + 'сцена сфоткана, добавлена в массив и отрендерена')
    }
    let busy = false;
    let stepHided = queueArr[0];
    const starter = () => {
        if (starterReady) {
            starterReady = false;
                //console.log('произошел запуск');
                stepHided = queueArr.shift();
                //queueArr.shift();
            if (queueArr.length !== 0) {
                hidedVideo.currentTime = stepHided;
            }
        }
        else return
            //console.log(new Date().toLocaleTimeString() + 'Запускатель отработал с флагом свободен')
            //console.log(queueArr)
    }


    const hidedVideoSeekedListener = () => {
        //console.log('перемотали');
        //busy = true;
        generateSceneHided();
        starter();
        //console.log(new Date().toLocaleTimeString() + 'событие seeked случилось');

    }

    const startSeekedVideoListening = () => {
        sceneArr.forEach((scene) => {
            queueArr.push(scene.time)
        })
        //console.log(queueArr)


        //hidedVideo.removeEventListener('seeked', hidedVideoSeekedListener);
        hidedVideo.addEventListener('seeked', hidedVideoSeekedListener);

        hidedVideoSeekedListener();

        const queueAdder = (time) => {
            if (!queueArr.includes(time)) {
                queueArr.unshift(time);
            }
            //console.log(queueArr)
            //console.log(new Date().toLocaleTimeString() + 'наполнятель очереди отработал');
        }



        let cached = null;
        const scrollListener = (event) => {
            if (!cached) {
                setTimeout(() => {
                    //let test = [];
                    output.querySelectorAll('div').forEach((div) => {

                        if (isScrolledIntoView(div)) {
                            if (!div.querySelector('img')) {
                                // console.log(div.getAttribute('time'));
                                //test.push(div.getAttribute('time'))
                                queueAdder(div.getAttribute('time'));
                            }
                        }
                        //console.log(test)
                    })
                    cached = null

                }, 500)
            }
            cached = event
        }
        //output.removeEventListener('scroll', scrollListener);
        output.addEventListener('scroll', scrollListener);
    }




    let blurSceneCounter = 1;
    //рендер ряда для блюра
    const renderBlurContainer = () => {

        let blurScene = {};
        blurScene.startTime = video.currentTime;
        blurScene.sceneCounter = blurSceneCounter;
        getBlurCoords(blurScene);
        blurScene.endTime = video.currentTime + 1;



        const container = document.createElement('div');
        container.classList.add('blur-output');
        container.setAttribute('blurcounter', blurSceneCounter.toString())
        navigationContainer.prepend(container);
        sceneArr.forEach((scene) => {
            const div = document.createElement('div');
            div.setAttribute('time', scene.time)
            div.classList.add('blur-div');
            div.classList.add('navigation');
            div.textContent = '';
            div.addEventListener('click', () => {
                blurArr.forEach((scene) => {
                    console.log(scene);
                    // console.log(scene.sceneCounter);
                    // console.log(container.getAttribute('blurcounter'));
                    if (scene.sceneCounter == container.getAttribute('blurcounter')) {

                        if (div.getAttribute('time') < scene.startTime) {
                            //console.log('<', div.getAttribute('time') - 0, scene.startTime)
                            scene.startTime = div.getAttribute('time') - 0;
                        }
                        else if (div.getAttribute('time') > scene.endTime) {
                            //console.log('>', div.getAttribute('time') - 0, scene.endTime)
                            scene.endTime = div.getAttribute('time') - 0;
                        }
                        else if (div.getAttribute('time') < scene.endTime && div.getAttribute('time') > scene.startTime) {
                            scene.endTime = div.getAttribute('time') - 0;
                        }
                        highlightBlurContainer(container);

                    }
                })
            })
            container.append(div);
        });

        const highlightBlurContainer = (container) => {
            container.querySelectorAll('div').forEach((div) => {
                div.classList.remove('blur-div_active');
                if (div.getAttribute('time') >= blurScene.startTime && div.getAttribute('time') <= blurScene.endTime) {
                    div.classList.add('blur-div_active');
                }
            })
        }
        highlightBlurContainer(container);

        //console.log(blurScene);
        blurArr.push(blurScene);
        blurSceneCounter ++;
    }
    blurPopup.querySelector('.blur-popup__button').addEventListener('click', renderBlurContainer)



}
const defaultVideoStart = () => {
    //console.log('canplay')
    startEditor();
    video.removeEventListener('canplay', defaultVideoStart);

}

video.load()
video.addEventListener('canplay', defaultVideoStart);
// //startEditor();


