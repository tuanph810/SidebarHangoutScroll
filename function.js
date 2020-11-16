function renderSidebar() {
    let sidebar = document.querySelector('div.sidebar')

    for(let i = 0; i < 80; i ++) {
        sidebar.innerHTML += 'Line ' + i + '<br/>'
    }
}

function renderContent() {
    let content = document.querySelector('div.content')

    for(let i = 0; i < 200; i ++) {
        content.innerHTML += 'Line ' + i + '<br/>'
    }
}

renderSidebar()
renderContent()

let oldScrollY = 0
let sidebarTop = 0
let sidebarBottom = 0
let sidebarHeight = 0
let isScrollDown = true
let isReachBottom = false
let isHangonTop = false
let isHangonBottom = false

function catchEventScroll(e) {
    let sidebar = document.querySelector('div.sidebar')

    caculateSidebarPositions(sidebar)

    if(oldScrollY < this.scrollY) {
        handleScrollDown(sidebar)
    } else {
        handleScrollUp(sidebar)
    }

    oldScrollY = this.scrollY
}

function handleScrollUp(el) {
    if(isOverTopScreen()) {
        if(!isScrollDown || !isReachBottom || isHangonBottom) {
            return
        }

        handleHangonTop(el)
    } else if(isReachTopScreen()) {
        if(isReachHeader()) {
            el.style.position = 'absolute'
            isHangonTop = false
        } else {
            el.style.position = 'fixed'
            isHangonTop = true
        }

        el.style.top = '0'
        el.style.bottom = 'auto'

        isReachBottom = false
    }

    isScrollDown = false
}

function handleScrollDown(el) {
    if(isReachFooter()) {
        el.style.position = 'absolute'
        el.style.bottom = '0'
        el.style.top = 'auto'

        return (isHangonBottom = true) && (isReachBottom = false)
    } else if(isReachBottomScreen()) {
        el.style.position = 'fixed'
        el.style.bottom = '0'
        el.style.top = 'auto'

        isReachBottom = true
    } else if(isReachTopScreen() && isHangonTop) {
        el.style.position = 'absolute'
        el.style.top = `${currentScreenOffsetTop() - getHeaderheight()}px`
        el.style.bottom = 'auto'

        isHangonTop = false
    }

    isHangonBottom = false
    isScrollDown = true
}

function handleHangonTop(el) {
    let top = currentScreenOffsetTop() + currentScreenHeight() - sidebarHeight

    el.style.position = 'absolute'
    el.style.top = `${top}px`
    el.style.bottom = 'auto'
}

function caculateSidebarPositions(el) {
    if(!el) {
        return
    }

    sidebarTop = el.getBoundingClientRect().top
    sidebarHeight = el.offsetHeight
    sidebarBottom = el.getBoundingClientRect().bottom
}

function currentScreenOffsetTop() {
    return Math.round(window.scrollY)
}

function currentScreenHeight() {
    return window.innerHeight
}

function isReachTopScreen() {
    return sidebarTop >= 0
}

function isOverTopScreen() {
    return sidebarTop < 0
}

function isReachBottomScreen() {
    return sidebarBottom - currentScreenHeight() <= 0
}

function isReachHeader() {
    let header = document.querySelector('div.header')

    if(!header || currentScreenOffsetTop() > header.offsetHeight) {
        return false
    }

    return true
}

function isReachFooter() {
    let footer = document.querySelector('div.footer')

    if(!footer || footer.getBoundingClientRect().top > currentScreenHeight()) {
        return false
    }

    return true
}

function getHeaderheight() {
    let header = document.querySelector('div.header')

    if(!header) {
        return 0
    }

    return header.offsetHeight
}

window.addEventListener('scroll', catchEventScroll)
