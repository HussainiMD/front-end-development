export function getMinViewPortDimension() {    
    const screenWidth = Math.min(document.documentElement.clientWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.body.offsetWidth);
    const screenHeight = Math.min(document.documentElement.clientHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.body.offsetHeight);
    return Math.min(screenWidth, screenHeight);
}

export function pickRandomCell(container) {
    const children = container.children;
    if(!children || children.length == 0) return null;
    const randomIdx = Math.floor(Math.random() * children.length);
    return children[randomIdx];
}

export function getCell(container, rowNo, columnNo) {
    if(rowNo < 0 || columnNo < 0) return null;
    const children = Array.from(container.children);
    if(!children || children.length == 0) return null;

    const filteredList  = children.filter(child => child.dataset.row == rowNo && child.dataset.column == columnNo);
    if(filteredList.length == 0) return null;

    return filteredList[0];
}
