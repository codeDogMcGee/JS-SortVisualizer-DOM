async function timeout(ms) { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve;
      }, ms);
    });
}



function forloop (n) {
    // rng = [...Array(n).keys()];
    // for (let i = 0; i < rng.length; i++) {
    //     console.log(rng[i])
    //     await timeout(1000)
    // }

    var array = [...Array(n).keys()];
    j = 1
    k=0
    for(let i = 0; i < array.length; i++) {

        // console.log(array[i-1]);
        // await timeout(1000*i)
        k++
        setTimeout(() => {
            console.log(array[i], k)
        }, 1000 * j++);
        setTimeout(() => {
            console.log('.', k)
        }, 1000 * j++);
    }
}

forloop(10)


// for (var i = 0; i < 5; i++) {
//     (function (i) {
//       setTimeout(function () {
//         console.log(i);
//       }, 1000*i);
//     })(i);
//   };  


// function forloop(n) {
//     rng = [...Array(n).keys()];
//     (function (i) {
//       setTimeout(function () {
//         console.log(i);
//       }, 1000*i);
//     })(i);
// }


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


////////////////////////////////////////////////////////////////////////////////////

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

    if (delayMs) {
        renderArray(origArray, []);
        //await timeoutVariable(1, delayMs);
    }

    // console.log("")
    // console.log("before merge", arr1, arr2)
    // console.log("orig", origArray)

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

    // console.log("orig", origArray)
    if (delayMs) {
        renderArray(origArray, []);
        //await timeoutVariable(1, delayMs);
    }

    return new Promise( resolve => {
        resolve( joinArrs );
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
    // console.log("Starting: ", arr)
    const sortedList = await sort2(arr, delayMs);
    
    // console.log("Ending: ", sortedList)

    let sortedListValues = []
    sortedList.forEach( pair => {
        sortedListValues.push(pair[0])
    });
    
    // console.log("Ending: ", sortedListValues)

    return new Promise( resolve => {
        resolve( sortedListValues );
    });
}

// n = 4;
// a = randomArray(n,1,10)
// b = [...Array(n).keys()];
// c = a.map( (e, i) => {
//     return [e, b[i]];
// });

// mergeSort2(c, 1000);

// return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(arr.concat(arr1.slice().concat(arr2.slice())));
//     }, 1000);
// });