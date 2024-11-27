"use strict"
import * as utils from './utils.js';
const cssSelectors = {
    'header': 'header',
    'main': 'main'
}

function getGameFragment(cellCount, cellsPerRow) {
    const fragment = document.createDocumentFragment();
    const rowCount = Math.round(cellCount / cellsPerRow);
    for(let rowNo=0; rowNo < rowCount; rowNo++) {
        for(let columnNo = 0; columnNo < cellsPerRow; columnNo++) {
            const section = document.createElement('section');
            section.dataset.row = rowNo;
            section.dataset.column = columnNo;
            const span = document.createElement('span');                        
            section.append(span);
            fragment.append(section);
        }
    }
    return fragment;    
}

class ViewManager {
    constructor(containerElem, selectors) {
        this.containerElem = containerElem;                
        this.selectors = selectors;                
    } 
    initialize(gridColumnCount) {
        this.gridColumnCount = gridColumnCount;
        this.headerElem = this.containerElem.querySelector(this.selectors['header']);
        this.mainElem = this.containerElem.querySelector(this.selectors['main']);
    }
    render() {
        const headerFragment = getGameFragment(this.gridColumnCount, this.gridColumnCount);
        this.headerElem.append(headerFragment);
        const cellCount = this.gridColumnCount * this.gridColumnCount;
        const bodyFragment = getGameFragment(cellCount, this.gridColumnCount);
        this.mainElem.append(bodyFragment);
    }
    reset(cellParent, player) {
        const cell = cellParent.firstElementChild;
        cell.classList.remove(player.color);                
    }
    updateHeaderCell(cellParent, player) {                        
        const cell = cellParent.firstElementChild;
        cell.classList.add(player.color);            
    }
    updateBodyCell(cellParent, player) {                
        const cell = cellParent.firstElementChild;
        cell.classList.add(player.color);    
    }
    getHeaderElem() {
        return this.headerElem;
    }
    getBodyElem() {
        return this.mainElem;
    }
}


class GameController {
    constructor(ViewManager, selectors) {        
        this.viewManager = new ViewManager(document.body, selectors);               
        this.CELL_MIN_WIDTH = 70;
        this.initialize();
        this.pointerMoveHander = this.pointerMoveHander.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.addClickListeners();
    }
    initialize() {            
        this.renderView();
        this.initializeState();
        this.setupPlayers();
    }    
    initializeState() {
        this.emptyCellIdxList = new Array(this.gridColumnCount);
        this.emptyCellIdxList.fill(this.gridColumnCount-1);
        this.cachedResult = new Object();
    }
    setupPlayers() {
        this.players = [ {id: 1, color:'blue'}, {id: 2, color: 'red'}];
        this.currentPlayer = this.players[0];        
        this.setHeaderCell(this.currentPlayer);
    }
    renderView() {
        const minDimen = utils.getMinViewPortDimension();
        this.gridColumnCount = Math.floor(minDimen/this.CELL_MIN_WIDTH);     
        document.documentElement.style.setProperty('--gamearea-column-count', this.gridColumnCount);           
        this.viewManager.initialize(this.gridColumnCount);
        this.viewManager.render();

        this.headerElem = this.viewManager.getHeaderElem();        
        this.bodyElem = this.viewManager.getBodyElem();
    }
    pickNextPlayer() {
        let idx = this.players.indexOf(this.currentPlayer) + 1;        
        if(idx >= this.players.length) idx = 0;
        this.currentPlayer = this.players[idx];
    }
    setHeaderCell(player, cell) {
        this.currentHeaderCell = cell ?? utils.pickRandomCell(this.headerElem);        
        this.viewManager.updateHeaderCell(this.currentHeaderCell, player);
    }
    play() {
        const columnNo = this.currentHeaderCell.dataset.column;
        const rowNo = this.emptyCellIdxList[columnNo];
        const cell = utils.getCell(this.bodyElem, rowNo, columnNo);
        if(!cell) return;
        cell.dataset.playerId = this.currentPlayer.id;
        this.viewManager.updateBodyCell(cell, this.currentPlayer);
        this.emptyCellIdxList[columnNo]--;
        if(this.isGameOver(cell)) {
            this.headerElem.removeEventListener('pointermove', this.pointerMoveHander);
            this.headerElem.removeEventListener('click', this.clickHandler);
            document.querySelector('.usr-msg').innerHTML = `Game Over. ${this.gameOverMsg}`;            
        }
        this.viewManager.reset(this.currentHeaderCell, this.currentPlayer);
        this.pickNextPlayer();        
    }    
    isGameOver(cell){
        /*Are there any available slots to continue game */
        const availableSlotsList = this.emptyCellIdxList.filter(cellIdx => cellIdx >= 0);
        if(availableSlotsList.length == 0) {
            this.gameOverMsg = `It's a draw!`;    
            return true;
        }

        const rowNo = parseInt(cell.dataset.row);
        const columnNo = parseInt(cell.dataset.column);                
        this.gameOverMsg = `User <span style='color:${this.currentPlayer.color};font-weight:700;text-transform:uppercase;'>${this.currentPlayer.color}</span> wins!`;
        let rowCount = 0;        
        /* from L.H.S checking on row */
        for(let idx = columnNo-1; idx > columnNo-5; idx--) {
            const prevCell = utils.getCell(this.bodyElem, rowNo, idx);
            if(!prevCell || !prevCell.dataset.playerId) break;
            if(cell.dataset.playerId === prevCell.dataset.playerId) rowCount++;
            else break;
        }
        /* from R.H.S checking on row */
        for(let idx = columnNo+1; idx < columnNo+5; idx++) {
            const nxtCell = utils.getCell(this.bodyElem, rowNo, idx);
            if(!nxtCell || !nxtCell.dataset.playerId) break;
            if(cell.dataset.playerId === nxtCell.dataset.playerId) rowCount++;
            else break;
        }
        
        if(rowCount >= 3) return true;
        let columnCount = 0;
        /* column checking bottom part from current cell */
        for(let idx = rowNo+1; idx < rowNo+5; idx++) {
            const nxtCell = utils.getCell(this.bodyElem, idx, columnNo);
            if(!nxtCell || !nxtCell.dataset.playerId) break;
            if(cell.dataset.playerId === nxtCell.dataset.playerId) columnCount++;
            else break;
        }

        if(columnCount >= 3) return true;
        let leftDiagCount = 0;        
        /*Left diagonal checks */
        for(let idx = 1; idx < 5; idx++) {
            const nxtCell = utils.getCell(this.bodyElem, rowNo+idx, columnNo+idx);
            if(!nxtCell || !nxtCell.dataset.playerId) break;
            if(cell.dataset.playerId === nxtCell.dataset.playerId) leftDiagCount++;
            else break;
        }
        if(leftDiagCount >= 3) return true;

        let rightDiagCount = 0;  
        /*Right diagonal checks */
        for(let idx=1; idx < 5; idx++) {
            const nxtCell = utils.getCell(this.bodyElem, rowNo+idx, columnNo-idx);
            if(!nxtCell || !nxtCell.dataset.playerId) break;
            if(cell.dataset.playerId === nxtCell.dataset.playerId) rightDiagCount++;
            else break;
        }   
        if(rightDiagCount >= 3) return true;

        return false;
    }
    pointerMoveHander(event) {
        let cell = event.target.closest('section');            
        if(!cell) return;
        this.viewManager.reset(this.currentHeaderCell, this.currentPlayer);
        this.setHeaderCell(this.currentPlayer, cell);
    }
    clickHandler(event){            
        let cell = event.target.closest('section');            
        if(!cell || cell != this.currentHeaderCell) return;
        this.play();            
    }
    addClickListeners() {        
        this.headerElem.addEventListener('pointermove', this.pointerMoveHander);
        this.headerElem.addEventListener('click', this.clickHandler);
    }
}


const gameController = new GameController(ViewManager, cssSelectors);
