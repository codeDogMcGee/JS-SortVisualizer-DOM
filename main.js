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

function timeoutVariable(x, ms) { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, ms);
    });
}

function merge(arr1, arr2) {
    let arr = [];
    // .shift() reduces the size of the array after returning the value,
    // so keep looping until one of the arrays is empty
    while (arr1.length && arr2.length) {
        if (arr1[0] < arr2[0]) { // since using shift can continually check for the first element
            arr.push(arr1.shift());
        } else {
            arr.push(arr2.shift());
        }
    }
    // merge all the new arr with the remaining arr1 and arr2
    return arr.concat(arr1.slice().concat(arr2.slice()));
}

function sort(arr, delayMs) {
    if (arr.length < 2) {
        return arr;
    }

    // find the middle index of the array
    const mid = Math.floor(arr.length / 2);

    // seperate arrays into left and right
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    // merge two arrays after sorting recursively
    return merge( sort(leftArr), sort(rightArr) );
}

// console.log(mergeSort(randomArray(10,1,10), 500))

function mergeSort(arr, delayMs) {
    return new Promise( resolve => {
        resolve(sort(arr, delayMs));
    });
}




//const wait = ms => new Promise((resolve) => setTimeout(resolve, ms));
//const wait = ms => setTimeout(()=>{console.log('pause')}, ms);
// function wait(x, ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

async function merge2(arr1, arr2, delayMs, origArray) {

    return new Promise( async resolve => {
        // console.log("")
        // console.log("before merge", arr1, arr2)
        console.log("orig", origArray)

        // return new Promise( resolve => {
        //     setTimeout(() => {

        let pulledIndexArr = [];
        const arr3 = arr1.concat(arr2);
        let pulledIndex;
        arr3.forEach( arrayToPull => {
            pulledIndex = origArray.findIndex(pair => pair === arrayToPull)
            pulledIndexArr.push(pulledIndex);
        })
        

        
        // .shift() reduces the size of the array after returning the value,
        // so keep looping until one of the arrays is empty
        let arr = [];
        while (arr1.length && arr2.length) {
            if (arr1[0][0] < arr2[0][0]) { // since using shift can continually check for the first element
                arr.push(arr1.shift());
            } else {
                arr.push(arr2.shift());
            }

        }
        

        
        //console.log("pulled", pulledIndexArr)

        // merge all the new arr with the remainder of arr1 or arr2
        const joinArrs = arr.concat(arr1.slice().concat(arr2.slice()))

        let i = 0;
        pulledIndexArr.forEach( ind => {
            origArray[ind] = joinArrs[i]; 
            i++;
        });

        console.log("orig", origArray)
        console.log("pause")
        await wait(delayMs)
        
        resolve(joinArrs);
    });
 
}

let origArray; // declare global variable
async function sort2(arr, delayMs) {
    origArray = origArray || arr.slice(); // set global variable

    if (arr.length < 2) {
        //console.log("sort1: ", arr)
        return arr;
    }

    // find the middle index of the array
    const mid = Math.floor(arr.length / 2);

    // seperate arrays into left and right
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    //console.log("sort: ", leftArr, rightArr, arr)
    //const sl = await sort(leftArr)
    //const sr = await sort(rightArr)


    const sl = sort2(leftArr)
    const sr = sort2(rightArr)

    

    //console.log("sort end: ", leftArr, rightArr, arr)
    // merge two arrays after sorting recursively
    //return await merge2(await sl, await sr, delayMs, origArray );
    return await merge2(await sl, await sr, delayMs, origArray );

}

async function mergeSort2(arr, delayMs) {
    console.log("Starting: ", arr)
    const sortedList = await sort2(arr, delayMs);
    
    console.log("Ending: ", sortedList)

    let sortedListValues = []
    sortedList.forEach( pair => {
        sortedListValues.push(pair[0])
    });
    
    console.log("Ending: ", sortedListValues)

    return new Promise( resolve => {
        resolve( sortedListValues );
    });
}

n = 4;
a = randomArray(n,1,10)
b = [...Array(n).keys()];
c = a.map( (e, i) => {
    return [e, b[i]];
});

mergeSort2(c, 1000);

// return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(arr.concat(arr1.slice().concat(arr2.slice())));
//     }, 1000);
// });





async function bubbleSortAsync(arr, delayMs) {
    let swapsConducted = 1;
    while(swapsConducted) {
        swapsConducted = 0;
        for (let i = 0; i < arr.length - 1; i++) { // arr.length - 1 so don't overflow end of list when comparing to next value

            if ( arr[i] > arr[i + 1] ) {
                renderArray(arr, [i, i+1]);
                await timeoutVariable(1, delayMs);

                // if the next value in the array is smaller swap it with the current value
                const currentValue = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = currentValue;

                //signal that a swap has been completed and delay the result to render on each iteration
                if (delayMs) {
                    renderArray(arr, [i, i+1]);
                    swapsConducted++
                    await timeoutVariable(1, delayMs);
                } else {
                    swapsConducted++
                }
            }
        }
    }

    if (!delayMs) {
        renderArray(arr, []);
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
    currentArray = await bubbleSortAsync(currentArray, delayMs);
    renderArray(currentArray, []);
}

async function performMergeSort() {
    const delayMs = Number(document.getElementById("slider-delay-output").innerHTML)
    currentArray = await mergeSort(currentArray, delayMs);
    renderArray(currentArray, []);
}

// window.onload = () => {
//    getNewArray();
// }