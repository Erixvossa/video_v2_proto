import {input, blur, video, videoSource, popup, output, fastOutput, videoHeight} from './src/variablex.js';

import { sortArrByTime, captureCoordsStart, captureCoordsEndFlag, captureCoordsStartFlag, setCaptureCoordsEndFlag, setcaptureCoordsStartFlag } from './src/utils.js';

//Массив всех сцен для фронта
export let sceneArr = [];

//Массив сцена для передачи на бэк
export let sceneArrToBack = [];


let imageWidth;

video.setAttribute('height', videoHeight);


let screenWidth = Math.round(document.documentElement.scrollWidth / 60);
//console.log(screenWidth);


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



video.addEventListener('mousedown', (e) => {
    pressed = true;
    removeControls(e);
    setcaptureCoordsStartFlag(true);

});
video.addEventListener('mousemove', (e) => {
    moved = true;
    removeControls(e);
});
document.addEventListener('mouseup', (e) => {
    if (moved && pressed) {
        setCaptureCoordsEndFlag(true);
        e.preventDefault();
        console.log('отпустили.')
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

    sortArrByTime(sceneArrToBack);
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
    output.innerHTML = '';
    fastOutput.innerHTML = '';
    document.querySelector('.inaccurate-output').innerHTML = '';
    document.querySelector('.scene-selector').innerHTML = '';
    let hidedVideo;
    let lazyVideo;
    let videoLength;
    let n = 0.25;

    video.load();


    const fillFirstOutput = (sceneTime) => {
        //console.log(sceneTime);
        activeGeneratorHided = true;
        startHidedVideo(sceneTime);
        //console.log(sceneArr);
    }


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
                    const targetWidth = (((sceneTime / 0.25) - 5) * imageWidth);
                    const width = targetWidth;
                    document.querySelector('.output').scrollTo({left: width, top: 0, behavior: 'smooth'});

                    //let timeToSend = sceneTime - 0;
                    //fillFirstOutput(timeToSend);


                } else if (el.parentElement === document.querySelector('.output')) {

                }
                let timeToSend = sceneTime - 0;
                fillFirstOutput(timeToSend);
            }
            el.removeEventListener('click', doALotOf);
            el.addEventListener('click', doALotOf);
        });
    };

    const renderFirst = () => {
        output.innerHTML = "";
        //console.log(sceneArr)
        let w = (video.videoWidth * 0.125) + 'px';
        let h = (video.videoHeight * 0.125) + 'px';
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


            // if (scene.image) {
            //     scene.image.classList.add('scene');
            //     scene.image.classList.add('navigation');
            //     scene.image.setAttribute('time', scene.time);
            //     scene.image.addEventListener('click', () => {
            //         video.currentTime = scene.time;
            //         popup.classList.add('popup_show');
            //     })
            //     const sceneDiv = document.createElement('div');
            //     output.append(sceneDiv);
            //     //generatePopup(sceneDiv, scene.time);
            //     sceneDiv.prepend(scene.image);
            // }
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
        for (let i = 0; i < sceneArr.length; i = i + Math.round(sceneArr.length / screenWidth)) {
            //console.log(i);
            const inaccurateOutput = document.querySelector('.inaccurate-output');
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



    let i = 0;
    const loadedDataListener = () => {
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

        lazyVideo = video.cloneNode(true);
        document.querySelector('.lazy-video').prepend(lazyVideo);
    }

    video.addEventListener('loadeddata', loadedDataListener);

    function generateThumbnail(i, caller, scaleFactor) {
        //console.log(i, caller)
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
        if (caller === 'video') {
            context.drawImage(video, 0, 0, w, h);
        }
        else if (caller === 'hidedVideo') {
            context.drawImage(hidedVideo, 0, 0, w, h);
        }
        var dataURL = thecanvas.toDataURL();
        //create img
        const image = document.createElement('img');
        image.setAttribute('src', dataURL);
        image.setAttribute('time', i);
        sceneArr.forEach((scene) => {

            if (scene.time === i && !scene.image) {
                scene.image = image;
                //console.log(scene)
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

                    const targetWidth = (((scene.getAttribute('time') / 0.25) - 5) * imageWidth);
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
                //console.log(sceneArr);
                renderThird();

                addListeners();
                video.currentTime = 0;
            }
        }
    });

    video.addEventListener('play', () => {

        fillFirstOutput(Math.round(video.currentTime))
        video._updateInterval = setInterval(() => {
            fillFirstOutput(Math.round(video.currentTime))
            //console.log(Math.round(video.currentTime))
            // do what you need
        }, 2000);
    }, true);

    video.addEventListener('pause', () => clearInterval(video._updateInterval), true);

    video.addEventListener('timeupdate', syncVideoToScene);




    let lazyStepHided = 0;
    let activeGeneratorLazy = true;
    let activeGeneratorHided = true;
    let stepHided = 0;
    let maxTime = 1;

    const seekedListener = () => {
        let caller = 'hidedVideo';
        if (activeGeneratorHided) {
            generateThumbnail(stepHided, caller);
            stepHided += n;
            //console.log(stepHided);
            //renderFirst();
            if (stepHided <= hidedVideo.duration && stepHided <= maxTime) {
                hidedVideo.currentTime = stepHided;
                //console.log(this.currentTime)
            } else {
                activeGeneratorHided = false;
                //console.log('1')
                sceneArr.forEach((scene) => {
                    if (scene.image) {
                        output.querySelectorAll('div').forEach((el) => {
                            if (el.getAttribute('time') == scene.time && !el.querySelector('img')) {
                                el.append(scene.image);
                            }
                        })
                    }
                })
                hidedVideo.removeEventListener('seeked', seekedListener)
            }
        }
    }

    const startHidedVideo = (startTime) => {
        maxTime = startTime + 5;
        hidedVideo.currentTime = startTime;
        if (startTime >= 2) {
            stepHided = startTime - 2;
        }
        else if (startTime === 1.75) {
            stepHided = startTime - 1.75;
        }
        else if (startTime === 1.50) {
            stepHided = startTime - 1.50;
        }
        else if (startTime === 1.25) {
            stepHided = startTime - 1.25;
        }
        else if (startTime === 1) {
            stepHided = startTime - 1;
        }
        else if (startTime === 0.75) {
            stepHided = startTime - 0.75;
        }
        else if (startTime === 0.5) {
            stepHided = startTime - 0.5;
        }
        else if (startTime === 0.25) {
            stepHided = startTime - 0.25;
        }
        else if (startTime === 0) {
            stepHided = startTime;
        }
        //stepHided = startTime;
        //console.log(`startTime ${startTime}, maxTime ${maxTime}`)
        hidedVideo.addEventListener('seeked', seekedListener);


    }
    const startLazyLoad = (e) => {

        let counter = 0;
        const counterUpper = () => {
                counter += 1;
        }

        let imagesArr = output.querySelectorAll('img');
        // for (let i = counter; i === counter; i += 3) {
        //
        //     counter = i;
        // }
        // console.log(counter);

        // const checkImage = () => {
        //     if (sceneArr[counter].image) {
        //         console.log(counter);
        //         // fillFirstOutput(sceneArr[counter].time)
        //         //console.log(sceneArr[counter]);
        //         counterUpper();
        //         checkImage();
        //         //console.log(counter);
        //     } else if (!sceneArr[counter].image){
        //         fillFirstOutput(sceneArr[counter].time)
        //         counterUpper();
        //         //console.log(`добавили + 1 к шагу ${counter}`);
        //     }
        //     else if (i <= sceneArr.length) {
        //         return
        //     }
        // }
        // checkImage();

        // const imageLoad = () => {
        //     if (counter < sceneArr.length) {
        //         fillFirstOutput(sceneArr[counter].time)
        //         counter += 1;
        //         console.log(sceneArr[counter]);
        //     }
        //     else {
        //         console.log('clearinterval')
        //             clearInterval(startTimeout);
        //     }
        // }

        // const imageLoad = () => {
        //     // sceneArr.some((scene) => {
        //     //     if (!scene.image) {
        //     //         //fillFirstOutput(scene.time);
        //     //         console.log(scene);
        //     //
        //     //     }
        //     // })
        //
        //         sceneArr.every(function(element) {
        //         fillFirstOutput(element.time)
        //         if (element.image) return false
        //         else return true
        //     })
        // }




        // let startTimeout =
        //     setInterval(() => {
        //         console.log('wait');
        //         imageLoad();
        //         //checkImage();
        //     }, 1000);
        //     //clearStartTimeout()



        // const clearStartTimeout = () => {
        //     console.log('stop timeout')
        //     clearInterval(startTimeout);
        //
        //         startTimeout =
        //             setInterval(() => {
        //                 console.log('wait more');
        //                 //imageLoad();
        //             }, 2000);
        //
        // }

        // if (counter >= sceneArr.length) {
        //     console.log('clearinterval')
        //     clearInterval(startTimeout);
        // }



        //document.querySelector('.navigation-container').addEventListener('click', clearStartTimeout )


        let newCounter = 0;
        //Работающий способ
        const lazyLoad = (startTime) => {
            // activeGeneratorHided = true;
            // maxTime = startTime + 3;
            // hidedVideo.currentTime = startTime;
            // stepHided = 0;
            // //stepHided = startTime;
            // console.log(`startTime ${startTime}, maxTime ${maxTime}`)
            // hidedVideo.addEventListener('seeked', seekedListener);
            // newCounter += 3;
            //раскомментить то, что выше, чтобы заработало с багами.


            activeGeneratorLazy = true;
            maxTime = startTime + 2;
            lazyStepHided = startTime;
            hidedVideo.currentTime = startTime;
            hidedVideo.addEventListener('seeked', lazySeekedListener);
            newCounter += 2;


        }

        const lazySeekedListener = () => {
            //console.log('lazystart');
            let caller = 'hidedVideo';
            if (activeGeneratorLazy) {
                generateThumbnail(lazyStepHided, caller);
                lazyStepHided += n;
                //console.log(stepHided);
                //renderFirst();
                if (lazyStepHided <= hidedVideo.duration && lazyStepHided <= maxTime) {
                    hidedVideo.currentTime = lazyStepHided;
                    //console.log(this.currentTime)
                } else {
                    activeGeneratorLazy = false;
                    //console.log('1')
                    sortArrByTime(sceneArr);
                    sceneArr.forEach((scene) => {
                        if (scene.image) {
                            output.querySelectorAll('div').forEach((el) => {
                                if (el.getAttribute('time') == scene.time && !el.querySelector('img')) {
                                    el.append(scene.image);
                                }
                            })
                        }
                    })
                    hidedVideo.removeEventListener('seeked', lazySeekedListener)
                }
            }
        }




        //lazyLoad(newCounter);
        // console.log(newCounter);
        // console.log(sceneArr.length);


        let startTimeout =
            setInterval(() => {
                if (newCounter <= sceneArr[sceneArr.length - 1].time) {
                    //console.log(newCounter);
                    //console.log('wait');
                    lazyLoad(newCounter)
                }
                //checkImage();
            }, 2000);
        document.addEventListener('click', () => {
            clearInterval(startTimeout);
            //console.log('breack');
            startTimeout =
                setInterval(() => {
                    if (newCounter <= sceneArr[sceneArr.length - 1].time) {
                        //console.log(newCounter);
                        //console.log('wait');
                        lazyLoad(newCounter)
                    }
                    //checkImage();
                }, 2000);
        })

    }


    setTimeout(startLazyLoad, 2000)
}


// startLazyLoad();



