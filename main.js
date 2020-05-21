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

// turn 2d array, like [[0,"hello"], [1,"world"]], into 1d array
function pairsToSingle(pairsArr, index) {
    let singleArr = []
    pairsArr.forEach( pair => {
        singleArr.push(pair[index])
    });
    return singleArr
}

// sort the array sides and merge together
function sortCombineArrays(arr1, arr2) {
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

// return the indices of the render list that are being calculated, to turn yellow
function getIndexInPlayList(fragList, mainList) {
    let indexArr = [];
    let pulledIndex;
    fragList.forEach( arrayToPull => {
        pulledIndex = mainList.findIndex(pair => pair === arrayToPull);
        indexArr.push(pulledIndex);
    })
    return indexArr;
}

// all of the promises, awaits, and async funcs are because of the delay needed to plot
// merge two arrays
async function merge(arr1, arr2, delayMs) {    
    // figure out which elements of the original array are in play
    const arr3 = arr1.slice().concat(arr2.slice());
    const indexInPlay = getIndexInPlayList(arr3, renderedArrayMergeSort);

    let notInPlay = [];
    let i = 0;
    renderedArrayMergeSort.forEach( pair => {
        if (!indexInPlay.includes(i)) {
            notInPlay.push(i);
        }
        i++
    });

    if (delayMs) {
        // render the 
        renderArray(pairsToSingle(renderedArrayMergeSort, 0), indexInPlay, notInPlay);
        await timeout(delayMs);
    }

    // filter the two arrays passed in
    const joinArrs = sortCombineArrays(arr1, arr2);

    // update the array to be rendered
    i = 0;
    indexInPlay.forEach( ind => {
        renderedArrayMergeSort[ind] = joinArrs[i]; 
        i++;
    });

    return new Promise( resolve => {
        resolve( joinArrs );
    });
}

let renderedArrayMergeSort; // declare global variable
// splits two arrays recusively and sends to merge()
async function sort(arr, delayMs) {
    renderedArrayMergeSort = renderedArrayMergeSort || arr.slice(); // set global variable

    if (arr.length < 2) {
        return arr;
    }

    // find the middle index of the array
    const mid = Math.floor(arr.length / 2);

    // seperate arrays into left and right
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    // split all the way down to individual parts and merge
    const sl = sort(leftArr, delayMs);
    const sr = sort(rightArr, delayMs);

    // merge two arrays after sorting recursively    
    // have to await everywhere because of teh delay
    m = merge( await sl, await sr, delayMs ) 

    return new Promise( resolve => {
        resolve( m );
    });
}

async function mergeSort(arr, delayMs) {
    // run the sorter on the array
    const sortedList = await sort(arr, delayMs);

    // reduce to a 1d array
    sortedListValues = pairsToSingle(sortedList, 0)

    return new Promise( resolve => {
        resolve( sortedListValues );
    });
}

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

function renderArray(arr, yellowCols, cyanCols = []) {

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
            backgroundColor = "yellow";
        } else if (cyanCols.includes(i)){
            backgroundColor = "cyan";
        }else {
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
    currentArray = await bubbleSortAsync(currentArray, delayMs / 3);
    renderArray(currentArray, []);
}

async function performMergeSort() {
    const delayMs = Number(document.getElementById("slider-delay-output").innerHTML)

    arrIndex = [...Array(currentArray.length).keys()];
    mappedArr = currentArray.map( (e, i) =>  [e, arrIndex[i]] );

    renderedArrayMergeSort = mappedArr.slice(); // reset the origArray to the mapped currentArray
    currentArray = await mergeSort(mappedArr, delayMs * 10);
    
    renderArray(currentArray, []);
}

window.onload = () => {
   getNewArray();
}