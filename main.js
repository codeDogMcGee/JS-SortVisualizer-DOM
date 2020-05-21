function updateSliderArraySize(value) {
    document.getElementById("slider-array-size-output").innerHTML = value;
}

function updateSliderDelay(value) {
    document.getElementById("slider-delay-output").innerHTML = value;
}

// returns a random integer, min and max are included possibilities
function randomInt(min, max) {
    return Math.floor( Math.random() * (max + 1 - min) + min );
}

// global variable; keep track of which starting array is being used
let currentArray = [];
// returns a randomized array within min/max limits , min and max are included possibilities
function randomArray(arrayLength, min, max) {
    arr = [];
    for (i=0; i < arrayLength; i++) {
        arr.push(randomInt(min, max));
    }
    return arr;
}

function timeout(ms) { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
}

function pairsToSingle(pairsArr, index) {
    let singleArr = []
    pairsArr.forEach( pair => {
        singleArr.push(pair[index])
    });
    return singleArr
}

function filterArrays(arr1, arr2) {
    let arr = [];
    while (arr1.length && arr2.length) {
        if (arr1[0][0] < arr2[0][0]) { // since using shift can continually check for the first element
            arr.push(arr1.shift());
        } else {
            arr.push(arr2.shift());
        }
    }
    return arr.concat(arr1.slice().concat(arr2.slice()));
}

function getIndexInPlayList(fragList, mainList) {
    let indexArr = [];
    let pulledIndex;
    fragList.forEach( arrayToPull => {
        pulledIndex = mainList.findIndex(pair => pair === arrayToPull);
        indexArr.push(pulledIndex);
    })
    return indexArr;
}

function timeoutP(p, ms) { 
    paused = true
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(false);
      }, ms);
    });
}

// let timeoutCounter = 1;
// paused = false;
async function merge(arr1, arr2, delayMs, origArray) {
    
    console.log('pause')
    await timeout(1000)
    
    // figure out which elements of the original array are in play
    const arr3 = arr1.slice().concat(arr2.slice());
    const indexInPlay = getIndexInPlayList(arr3, origArray);

    // renderArray(pairsToSingle(origArray, 0), indexInPlay);
    
    // filter the two arrays passed in
    const joinArrs = filterArrays(arr1, arr2);

    let i = 0;
    indexInPlay.forEach( ind => {
        origArray[ind] = joinArrs[i]; 
        i++;
    });

    //renderArray(pairsToSingle(origArray, 0), pulledIndexArr);
    
    // renderArray(pairsToSingle(origArray, 0), []);
    // console.log('pause')
    // await timeout(1000)

    


    return new Promise( resolve => {
        resolve( joinArrs );
    });
    
}

let origArray; // declare global variable
async function sort(arr, delayMs) {
    

    origArray = origArray || arr.slice(); // set global variable

    if (arr.length < 2) {
        return arr;
    }

    // find the middle index of the array
    const mid = Math.floor(arr.length / 2);

    // seperate arrays into left and right
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);
    const sl = sort(leftArr, delayMs);
    const sr = sort(rightArr, delayMs);

    // merge two arrays after sorting recursively    
    // return await merge(await sl, await sr, delayMs, origArray );
    m = await merge( await sl, await sr, delayMs, origArray ) 

    // renderArray(pairsToSingle(origArray, 0), []);
    // console.log('pause')
    // await timeout(1000)
    renderArray(pairsToSingle(origArray, 0), []);

    return new Promise( resolve => {
        resolve( m );
    });
}

async function mergeSort(arr, delayMs) {
    const sortedList = await sort(arr, delayMs);

    sortedListValues = pairsToSingle(sortedList, 0)

    return new Promise( resolve => {
        resolve( sortedListValues );
    });
}

async function runMergeSort() {
    n = 5;
    a = randomArray(n,1,10)
    b = [...Array(n).keys()];
    c = a.map( (e, i) => {
        return [e, b[i]];
    });
    console.log("Starting: ", c)
    returnList = await mergeSort(c, 2000);
    console.log("Ending: ", returnList)
};
//runMergeSort();

async function bubbleSortAsync(arr, delayMs) {
    let swapsConducted = 1;
    while(swapsConducted) {
        swapsConducted = 0;
        for (let i = 0; i < arr.length - 1; i++) { // arr.length - 1 so don't overflow end of list when comparing to next value

            if ( arr[i] > arr[i + 1] ) {

                // if the next value in the array is smaller swap it with the current value
                const currentValue = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = currentValue;

                //signal that a swap has been completed and delay the result to render on each iteration
                swapsConducted++
                
                if (delayMs) {
                    renderArray(arr, [i, i+1]);
                    await timeout(delayMs);
                }
            }
        }
    }

    return new Promise( resolve => {
        resolve(arr);
    });
}

// (el: DOM element, attrs: collection of attributes )
function setAttributes(el, attrs) {
    for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function renderArray(arr, yellowCols) {

    // get the parent div
    let plotContainter = document.getElementById("plot");
    
    // clear children from plotContainer before appending below
    plotContainter.innerHTML = '';

    // max value is to calculate % for box height
    const maxValue = Math.max(...arr);

    // loop through array and create a div with array[i] sized height
    let i = 0;
    arr.forEach(value => {
        const valuePercentage = (value / maxValue) * 100;

        // set the background color to yellow if indicated
        let backgroundColor;
        if (yellowCols.includes(i)) {
            backgroundColor = "orange";
        } else {
            backgroundColor = "blue";
        }

        const arrayDivAttributes = {
            "id": "array-col-" + i++, 
            "style": "height:" + valuePercentage + "%; flex-grow: 1; background-color: " + backgroundColor,
        };

        // create new div and set attributes
        let arrayDiv = document.createElement("div");
        setAttributes(arrayDiv, arrayDivAttributes);

        // add the neew div to the parent
        plotContainter.appendChild(arrayDiv);
    });
}

function getNewArray() {
    const arraySize = Number(document.getElementById("slider-array-size-output").innerHTML)

    currentArray = randomArray(arraySize, 5, 1000);
    renderArray(currentArray, []);
}

async function performBubbleSort() {
    const delayMs = Number(document.getElementById("slider-delay-output").innerHTML)
    currentArray = await bubbleSortAsync(currentArray, delayMs / 100);
    renderArray(currentArray, []);
}

// async function performMergeSort() {
//     const delayMs = Number(document.getElementById("slider-delay-output").innerHTML)
//     currentArray = await mergeSort(currentArray, delayMs);
//     renderArray(currentArray, []);
// }

async function performMergeSort() {
    const delayMs = Number(document.getElementById("slider-delay-output").innerHTML)

    arrIndex = [...Array(currentArray.length).keys()];
    mappedArr = currentArray.map( (e, i) =>  [e, arrIndex[i]] );
    
    origArray = mappedArr.slice();
    currentArray = await mergeSort(mappedArr, delayMs);
    
    renderArray(currentArray, []);
}

window.onload = () => {
   getNewArray();
}