
function getDOM() {
    // alert('getDom')

    var name = document.getElementsByClassName("Flxs($flx1) Flw(w) Fz($xl) Fw($bold) Pend(8px)");

    var age = document.getElementsByClassName("Whs(nw)")[4];

    var distance = document.getElementsByClassName("Us(t) Va(m) D(ib) My(2px) NetWidth(100%,20px) C(#fff) Ell")[1].getElementsByTagName('span')[0];

    // var distance2 = document.getElementsByClassName('Us(t) Va(m) D(ib) My(2px) NetWidth(100%,20px) C(#fff) Ell')[3].getElementsByTagName('span')[0];

    var image = document.getElementsByClassName("Bdrs(8px) Bgz(cv) Bgp(c) StretchedBox")[2].style.backgroundImage;

    var imgUrl = image.replace('url("', '').replace('")', '');
    // alert(image.replace('url(', '').replace(')', ''));


    var dataSet = {

        name: String,

        age: String,

        distance: String,

        studies: String,

        imgUrl: String

    }

    // dataSet.name = name[1].innerHTML;

    dataSet.age = age[4].innerHTML;

    dataSet.imgUrl = imgUrl
    alert(dataSet)

    try {

        // dataSet.distance = distance.innerHTML;

    } catch (err) {
        alert('error')
        // dataSet.distance = distance2.innerHTML;

    }

    return dataSet;
}

chrome.runtime.sendMessage({

    action: "getSource",

    source: JSON.stringify(getDOM())

});

