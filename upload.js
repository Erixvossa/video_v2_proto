import {input, blur, video, captureButton, videoSource, popup, output, fastOutput, videoHeight} from './src/variablex.js';

import { sortArrByTime, captureCoordsStart, captureCoordsEndFlag, captureCoordsStartFlag, setCaptureCoordsEndFlag, setcaptureCoordsStartFlag } from './src/utils.js';

//Массив всех сцен для фронта
export let sceneArr = [];

//Массив сцена для передачи на бэк
export let sceneArrToBack = [];



let imageWidth;

video.setAttribute('height', videoHeight);


let screenWidth = Math.round(document.documentElement.scrollWidth / 60);


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




const renderScenesListener = (e) => {
    e.preventDefault();
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
        //videoSource.setAttribute('src', 'https://appstorespy.com/s/ftue/blured.mp4');
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
            });
        });


    };


    const renderFirst = () => {
        output.innerHTML = "";
        sceneArr.forEach((scene) => {
            scene.image.classList.add('scene');
            scene.image.classList.add('navigation');
            scene.image.setAttribute('time', scene.time);
            scene.image.addEventListener('click', () => {
                video.currentTime = scene.time;
                popup.classList.add('popup_show');
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



        sortArrByTime(sceneArr);

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


//startEditor();

