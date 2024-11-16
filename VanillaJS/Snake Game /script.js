"use strict"

class SnakeGameHandlerTemplate{
    constructor(area) {
        this.area = area; 
        this.area.row = {start: 1, end: 40};
        this.area.column = {start: 1, end: 40};        
        this.utils = {};
        this.addUtils();        
        this.food = null;
        this.#timerId;
        this.initialize();   
    }
    #timerId
    addUtils() {
        const checkForFood = () => {
            const head = this.bodyArray[0];
            const headRowStart = parseInt(head.style.gridRowStart);
            const headColumnStart = parseInt(head.style.gridColumnStart);
            const foodRowStart = parseInt(this.food.style.gridRowStart);
            const foodColumnStart = parseInt(this.food.style.gridColumnStart);
            this.isFoodFound = (headRowStart === foodRowStart && headColumnStart === foodColumnStart);
        }

        this.utils.updateStart = (bodyPart, idx) => {            
            const rowStart = parseInt(bodyPart.style.gridRowStart) + parseInt(bodyPart.moveData.x);
            const colStart = parseInt(bodyPart.style.gridColumnStart) + parseInt(bodyPart.moveData.y);
            
            if(rowStart < this.area.row.start || rowStart > this.area.row.end || colStart < this.area.column.start || colStart > this.area.column.end) this.isGameOver = true;

            bodyPart.style.gridRowStart = rowStart;
            bodyPart.style.gridColumnStart = colStart;

            if(idx === 0) checkForFood();
        };

        this.utils.copyMoveData = (idx) => {            
            const bodyPart = this.bodyArray[idx];
            if(idx === 0) {
                bodyPart.moveData = {...bodyPart.directionChange};
            } else {
                const earlierPart = this.bodyArray[idx - 1];
                if(!earlierPart) return;
                bodyPart.moveData = {...earlierPart.moveData};                
            }
        };

        this.utils.isDirectionChange = (idx) => {
            if(idx === 0) return false;
            const partData = this.bodyArray[idx].moveData;
            const earlierPartData = this.bodyArray[idx -1].moveData;
            return !(partData.x === earlierPartData.x && partData.y === earlierPartData.y);
        };

        this.utils.getRandomLocation = () => {
            const limit = this.area.row.end * this.area.column.end;
            for(let i = 0; i < limit; i++) { //instead of putting infinite loop this is better option
                const randomX = Math.round((this.area.row.end - this.area.row.start) * Math.random());
                const randomY = Math.round((this.area.row.end - this.area.row.start) * Math.random());
                let isOverlapping = false;
                this.bodyArray.forEach(part => {
                    const partX = parseInt(part.style.gridRowStart);
                    const partY = parseInt(part.style.gridColumnStart);
                    if(randomX === partX && randomY === partY) isOverlapping = true;
                });

                if(!isOverlapping)
                    return {randomX, randomY}; 
            } 
        }
    }
    initialize() {
        this.area.innerHTML = '';        
        const head = document.createElement('div');
        head.classList.add('snake');
        head.classList.add('head');
        head.style.gridRowStart = 30;
        head.style.gridColumnStart = 30;
        head.moveData = { x: 0, y: 1};
        this.area.append(head);
        this.bodyArray = [head];
        head.directionChange = {x: 0, y: 1};

        this.isGameOver = false;

        this.food = document.createElement('div');
        this.food.classList.add('food');
        this.area.append(this.food);
        this.placeFood();        
    }
    start() {
        if(!this.#timerId)
            this.#timerId = setInterval(()=> this.move(), 200);
    }
    end() {
        clearInterval(this.#timerId);
        this.#timerId = null;
        this.initialize();
        alert('Game Over');
        this.start();
    }
    placeFood() {
        const {randomX, randomY} = this.utils.getRandomLocation();        
        this.food.style.gridRowStart = randomX;
        this.food.style.gridColumnStart = randomY;
        this.isFoodFound = false;
    }
    eatRepeat() {
        this.grow();
        this.placeFood();
    }
    checkGameValidity() {
        if(this.bodyArray.length === this.area.row.end) {
            this.isGameOver = true;
            return;
        }

        const head = this.bodyArray[0];
        const headRowStart = parseInt(head.style.gridRowStart);
        const headColumnStart = parseInt(head.style.gridColumnStart);
        for(let idx=1; idx < this.bodyArray.length; idx++) {
            const part = this.bodyArray[idx];
            const partRowStart = parseInt(part.style.gridRowStart);
            const partColumnStart = parseInt(part.style.gridColumnStart);
            
            if(headRowStart === partRowStart && headColumnStart === partColumnStart) {
                this.isGameOver = true;
                return;
            }        
        }

    }        
    grow() {       
        const lastPart = this.bodyArray.at(-1);
        const newPart = lastPart.cloneNode(true);
        newPart.classList.remove('head');
        newPart.moveData = {...lastPart.moveData};                
        const rowStart = parseInt(newPart.style.gridRowStart) - parseInt(newPart.moveData.x);
        const colStart = parseInt(newPart.style.gridColumnStart) - parseInt(newPart.moveData.y);

        newPart.style.gridRowStart = rowStart;
        newPart.style.gridColumnStart = colStart;
        this.area.append(newPart);
        this.bodyArray.push(newPart);
    }
    move() {
        const toUpdateIdxList = [];
        this.utils.copyMoveData(0);

        this.bodyArray.forEach((part,idx) => {            
            this.utils.updateStart(part, idx);                  
            if(this.utils.isDirectionChange(idx))
                toUpdateIdxList.push(idx);
        });
        
        toUpdateIdxList.forEach(idx => {            
            this.utils.copyMoveData(idx);
        });

        if(this.isFoodFound) 
            this.eatRepeat();

        this.checkGameValidity();    

        if(this.isGameOver) 
            this.end();

    }
    changeDirectionTo(value) {
        if(!value || typeof value !== 'string' || value.length === 0) return;
        value = value.toLowerCase();
        const head = this.bodyArray[0];

        switch(value) {
            case 'up': {
                if(head.directionChange.x != 1 && head.directionChange.y != 0) {
                    head.directionChange.x = -1;
                    head.directionChange.y = 0;
                }
            }
            break;
            case 'down': {
                if(head.directionChange.x != -1 && head.directionChange.y != 0) {
                    head.directionChange.x = 1;
                    head.directionChange.y = 0;
                }
            }
            break;
            case 'left': {
                if(head.directionChange.x != 0 && head.directionChange.y != 1) {
                    head.directionChange.x = 0;
                    head.directionChange.y = -1;
                }
            }
            break;
            case 'right': {
                if(head.directionChange.x != 0 && head.directionChange.y != -1) {
                    head.directionChange.x = 0;
                    head.directionChange.y = 1;
                }
            }
            break;
            default: console.warn(`Invalid Snake Direction Change Value => ${value}, length = ${value.length}`);
        }
        
    }

}

const area = document.querySelector('.area');
const snakeGameHandler = new SnakeGameHandlerTemplate(area);

document.addEventListener('keyup', event => {
    if(!event || !event.key) return;
    const code = event.code?.slice(5).toLowerCase(); 
    snakeGameHandler.changeDirectionTo(code);
    snakeGameHandler.start();
});














