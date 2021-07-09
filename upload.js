const input = document.getElementById('file-input');
const video = document.getElementById('video');
const videoSource = document.createElement('source');


input.addEventListener('change', function() {
    const files = this.files || [];

    if (!files.length) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        videoSource.setAttribute('src', e.target.result);
        video.appendChild(videoSource);
        video.load();
        //video.play();
    };

    reader.onprogress = function (e) {
        console.log('progress: ', Math.round((e.loaded * 100) / e.total));
    };

    reader.readAsDataURL(files[0]);
});

var videoId = 'video';
var scaleFactor = 0.125;
var snapshots = [];
let videoTimeArr = [];
let sceneArr = {};



const captureButton = document.querySelector('#cit');

/**
 * Captures a image frame from the provided video element.
 *
 * @param {Video} video HTML5 video element from where the image frame will be captured.
 * @param {Number} scaleFactor Factor to scale the canvas element that will be return. This is an optional parameter.
 *
 * @return {Canvas}
 */
function capture(video, scaleFactor) {
    if (scaleFactor == null) {
        scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    return canvas;
}

/**
 * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
 */

let screenWidth = Math.round(document.documentElement.scrollWidth / 40);
console.log(screenWidth);

const fillInaccurate = () => {
    for (let i = 0; i < videoTimeArr.length; i = i + Math.round(videoTimeArr.length / screenWidth) ) {
        const inaccurateOutput = document.querySelector('.inaccurate-output');
        const innacurateDiv = document.createElement('div');
        innacurateDiv.classList.add('inaccurate-output_div');
        innacurateDiv.prepend(videoTimeArr[i].canvas);
        innacurateDiv.querySelector('canvas').classList.add('width');
        inaccurateOutput.prepend(innacurateDiv);
        //console.log(videoTimeArr[i].time);

        innacurateDiv.addEventListener('click', () => {
            video.currentTime = videoTimeArr[i].time;
        })

    }
}


let counter = 0;
function shoot(videoCurrentTime) {
    //console.log(videoCurrentTime);
    var video = document.getElementById(videoId);
    var output = document.getElementById('output');
    const fastOutput = document.querySelector('.fast-output');
    var canvas = capture(video, scaleFactor);
    canvas.onclick = function() {
        window.open(this.toDataURL(image/jpg));
    };
    snapshots.unshift(canvas);
    output.innerHTML = '';
    fastOutput.innerHTML = '';

    let scene = {};
    scene.canvas = canvas;
    scene.time = videoCurrentTime;


    videoTimeArr.unshift(scene);
    //console.log(videoTimeArr);

    // arr = [1, 2, 3];
    // arr.forEach(function(i, idx, array){
    //     if (idx === array.length - 1){
    //         console.log("Last callback call at index " + idx + " with value " + i );
    //     }
    // });



    videoTimeArr.forEach((scene) => {
            const div = document.createElement('div');
            div.classList.add('scene');
            div.append(scene.canvas)
            div.setAttribute('time', scene.time);
            output.prepend(div);

            const fastDiv = document.createElement('div');
            fastDiv.classList.add('fastDiv');
            fastDiv.textContent = '';
            fastOutput.prepend(fastDiv)


            fastDiv.addEventListener('click', () => {
                video.currentTime = scene.time;
                div.classList.toggle('scene_active');
            })

            div.addEventListener('click', () => {
                video.currentTime = scene.time;
                div.classList.toggle('scene_active');
            })

            // if (video.currentTime % 2 === 0 ) {
            //     console.log(video.currentTime);
            // }
            //console.log(scene.time)

            // if (scene.time < 10) {
            //     counter += 1;
            //     console.log(counter)
            // }
        // console.log(videoTimeArr.length)
    })

    // for (let i = 0; i < videoTimeArr.length; i = videoTimeArr.length / 10 ) {
    //     console.log(videoTimeArr[i]);
    // }




    //console.log(videoTimeArr.length)
    // snapshots.forEach((snapshot) => {
    //     const div = document.createElement('div');
    //     div.append(snapshot)
    //     output.append(div);
    //
    //
    //
    //     //div.setAttribute('time', videoCurrentTime);
    // })


}

captureButton.addEventListener('click', (e) => {
    e.preventDefault();
    shoot();
})

let screens = {};




video.addEventListener('loadeddata', () => {
    console.log(video.duration)
        const shootInterval = () => {
            const videoCurrentTime = video.currentTime;
            shoot(videoCurrentTime);
            video.currentTime += 0.25;
            console.log(videoTimeArr)

                if (video.currentTime + 0.25 >= video.duration) {
                clearInterval(interval)
                fillInaccurate();
            }
        }


        const interval = setInterval(shootInterval, 150);
})

console.log(videoTimeArr.length)