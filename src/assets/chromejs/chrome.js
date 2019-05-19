'use strict'

function getChrome() {

    return chrome

}


async function testFunctionBackground() {

    setTimeout(function run() {
        alert('Testing')

        setTimeout(testFunctionBackground(), 15000);
    }, 10000);

}
