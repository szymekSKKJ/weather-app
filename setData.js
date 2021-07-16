const setData = (el, value, child = 0) => {
    if (el.slice(0,1).includes('#')) {
        document.querySelectorAll(`${el} p`)[child].innerHTML = value;
    }
}

const setDataAll = (el, value, child = 0) => {
    if (el.slice(0,1).includes('.')) {
        document.querySelectorAll(`${el}`).forEach((el, index) => {
            el.querySelectorAll('p')[child].innerHTML = value;
        });
    }
}

const setDataAllCurrent = (el, value, which = 0, child = 0) => {
    if (el.slice(0,1).includes('.')) {
        document.querySelectorAll(`${el}`)[which].querySelectorAll('p')[child].innerHTML = value;
    }
}

export {
    setData,
    setDataAll,
    setDataAllCurrent
}

