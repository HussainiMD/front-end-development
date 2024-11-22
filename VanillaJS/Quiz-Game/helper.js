const utils = {};
utils.validation = {};
utils.validation.questionLabelHandler = function(containerEl, noOfQuestions) {
    if(!containerEl) throw new Error(`Please provide a valid UI element to show question sequence!`);

    if(!Number.isFinite(noOfQuestions) && noOfQuestions < 1) throw new Error(`Please provide a valid value for number of questions. You provide value ${noOfQuestions}`);
};

utils.validation.timer = function(uiEl, durationInSecs, refreshFreqInSecs, isCountDown) {
    if(!uiEl) throw new Error(`Please provide a valid UI Element to show timer`);

    if(!durationInSecs || !Number.isFinite(durationInSecs) || durationInSecs < 1) throw new Error('Please provide a valid timer duration. It has to a number starting from 1. Value provided by you is '+durationInSecs+'. All values in Seconds.');

    if(!refreshFreqInSecs || !Number.isFinite(refreshFreqInSecs) || refreshFreqInSecs < 1 || refreshFreqInSecs > durationInSecs) throw new Error(`Please provide a valid timer refresh Frequency. It has to a number starting from 1 and less than duration specied. Value provided by you is: refresh Frequency=${refreshFreqInSecs} and duration ${durationInSecs}. All values in Seconds.`)

    if(typeof isCountDown !== 'boolean') throw new Error('Please specify if the timer is of count down type or not. True means count down and False means count up.');
};

utils.validation.progressBar = function(containerEl, totalSteps, stepChangeUnit) {
    if(!containerEl) throw new Error('Please provide valid UI container element');
    if(!Number.isFinite(totalSteps) || totalSteps < 10) throw new Error(`Please provide valid number of total steps. You provided value ${totalSteps}.`);
    if(!Number.isFinite(stepChangeUnit) || stepChangeUnit < 1 || stepChangeUnit >= totalSteps) throw new Error(`Invalid combination of Total Number of Steps AND step change. Step change indicates how much progress bar moves each time. You provided values: total steps = ${totalSteps} and step unit = ${stepChangeUnit}`);
};

utils.validation.quizGameHeader = function(containerEl, selectors) {
    if(!containerEl) throw new Error(`Please provide UI container element for Quiz Game Header Component`);
    if(!selectors || Object.keys(selectors).length === 0) throw new Error(`Please provide valid CSS Selectors Object for Quiz Game Header Component`);
}


class QuestionLabelHandler {
    constructor(containerEl, noOfQuestions=10) {
        utils.validation.questionLabelHandler(containerEl, noOfQuestions);
        this.containerEl = containerEl;
        this.current = 1;
        this.last = noOfQuestions;
        this.updateEl();
    }    
    get() { 
        return this.current;    
    }
    next() {
        this.current < this.last ? this.current++ : 1;
    }
    updateEl() {
        this.containerEl.textContent = `${this.current} of ${this.last} Question`;
    }
    nextUpdateEl() {
        this.next();
        this.updateEl();
    }
}


class TimerComponent {
    constructor(uiEl, durationInSecs, refreshFreqInSecs=1, isCountDown=true) {
        utils.validation.timer(uiEl, durationInSecs, refreshFreqInSecs, isCountDown);
        this.uiEl = uiEl;
        this.durationStartValueInSecs = 1;
        this.durationEndValueInSecs = durationInSecs;
        this.refreshFreqInSecs = refreshFreqInSecs;
        this.isCountDownTimer = isCountDown;
        this.initialize();
    }
    initialize() {        
        const fragment = document.createDocumentFragment();
        const iconSpan = document.createElement('span');
        iconSpan.innerHTML = '&#x1F552;';
        fragment.append(iconSpan);
        const dataSpan = document.createElement('span');
        dataSpan.classList.add('js-timer-data');
        dataSpan.textContent = '0s';
        fragment.append(dataSpan);
        this.uiEl.append(fragment);
        this.uiDataEl = dataSpan;              

        this.notifiersList = [];        
    }
    setDefaults() {
        this.timeNow = this.isCountDownTimer ? this.durationEndValueInSecs : this.durationStartValueInSecs;
        this.#isTickingDone = false;
    }
    addNotifier(callBackFn) {
        if(typeof callBackFn === 'function')
            this.notifiersList.push(callBackFn);
    }
    #isTickingDone;
    tick() {
        if(this.#isTickingDone) return;

        if(this.isCountDownTimer) {
            if(this.timeNow >= this.durationStartValueInSecs) 
                this.timeNow--;
            else this.#isTickingDone = true;
        } else {
            if(this.timeNow <= this.durationEndValueInSecs) 
                this.timeNow++;
            else this.#isTickingDone = true;
        }
    }
    updateEl() {
        this.uiDataEl.textContent = `${this.timeNow}s`;
    }
    #timerId
    start() {
        if(!this.#timerId) {
            this.setDefaults(); 
            this.#timerId = setInterval(_ => {
                                this.tick();
                                this.updateEl();
                                if(this.#isTickingDone) {
                                    this.stop();
                                    this.notifiersList.forEach(notifier => notifier());
                                }
                            }, this.refreshFreqInSecs * 1000);
            }
    }
    stop() {
        clearInterval(this.#timerId);
        this.#timerId = null;        
        console.log('timer done');
    }
    restart() {
        this.stop();
        this.start();
    }


}


class ProgressBar {
    constructor(containerEl, totalSteps=100, stepChangeUnit=1) {
        utils.validation.progressBar(containerEl, totalSteps, stepChangeUnit);
        this.containerEl = containerEl;
        this.totalSteps = totalSteps;
        this.stepChangeUnit = stepChangeUnit;
        this.initialize();
    }
    initialize() {
        this.progressValue = 0;
        this.progressEl = document.createElement('progress');
        this.progressEl.classList.add('bottom-progress');
        this.progressEl.max = this.totalSteps;        
        this.containerEl.append(this.progressEl);
        this.updateEl();
    }
    getProgressValue() {
        return this.progressValue;
    }
    goToNextStep() {
        if(this.progressValue >= this.totalSteps) return;
        this.progressValue += this.stepChangeUnit;        
        this.updateEl();
    }
    reset() {
        this.progressValue = 0;
        this.updateEl();
    }
    updateEl() {
        this.progressEl.value = this.progressValue;
    }
}



function getQuizAnswerFragment(verbiage) {
    const answerEl = document.createElement('p');
    answerEl.textContent = verbiage;    
    answerEl.classList.add('answer-option');    
    return answerEl;
}


async function getDataProvider() {    
    const response = await fetch('./questions.json');    
    if(!response.ok) throw Error('Cannot find file');
    const dataList  = await response.json();
    let idx = 0;
    return {
        getNextData: () => {
            if(idx === dataList.length) idx = 0;
            return dataList[idx++];
        }
    }
    
}


export {utils, QuestionLabelHandler, TimerComponent, ProgressBar, getQuizAnswerFragment, getDataProvider};
