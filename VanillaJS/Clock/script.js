"use strict"


function uiManager(container, selectors) {
    if(!(container instanceof HTMLElement)) return;
    const NUM_OF_DEGREES_PER_TICK = 6;
    const NUM_OF_DEGREES_PER_TICk_HOUR = 30;
    const MAX_HOURS = 12;

    const handsData = { secondsDeg: 0, minutesDeg: 0, hoursDeg: 0};
    const secondsHand = container.querySelector(selectors.secsHand);
    const minutesHand = container.querySelector(selectors.minsHand);
    const hoursHand = container.querySelector(selectors.hoursHand);

    function initialize(hours, mins, secs) {
        if(!Number.isFinite(hours) || !Number.isFinite(mins) || !Number.isFinite(secs)) return;
        handsData.secondsDeg = secs * NUM_OF_DEGREES_PER_TICK;
        handsData.minutesDeg = mins * NUM_OF_DEGREES_PER_TICK;
        handsData.hoursDeg = (hours % MAX_HOURS) * NUM_OF_DEGREES_PER_TICk_HOUR;

        secondsHand.style.transform = `rotate(${handsData.secondsDeg}deg)`;
        minutesHand.style.transform = `rotate(${handsData.minutesDeg}deg)`;
        hoursHand.style.transform = `rotate(${handsData.hoursDeg}deg)`;
    }

    function moveSecondsHand() {
        handsData.secondsDeg += NUM_OF_DEGREES_PER_TICK;
        secondsHand.style.transform = `rotate(${handsData.secondsDeg}deg)`;
        if(handsData.secondsDeg >= 360) {
            handsData.secondsDeg = 0;
            moveMinutesHand();
        }
    }
    
    function moveMinutesHand() {
        handsData.minutesDeg += NUM_OF_DEGREES_PER_TICK;
        minutesHand.style.transform = `rotate(${handsData.minutesDeg}deg)`;
        if(handsData.minutesDeg >= 360) {
            handsData.minutesDeg = 0;
            moveHoursHand();
        }
    }
    
    function moveHoursHand() {
        handsData.hoursDeg += NUM_OF_DEGREES_PER_TICK_HOUR;
        hoursHand.style.transform = `rotate(${handsData.hoursDeg}deg)`;
        if(handsData.hoursDeg >= 360) handsData.hoursDeg = 0;
    }

    return {initialize, moveSecondsHand};
}


function controller(container) {
    const CSS_SELECTORS = {
        secsHand : '.js-hand-secs',
        minsHand : '.js-hand-mins',
        hoursHand : '.js-hand-hrs'
    }

    const uiHandler = uiManager(container, CSS_SELECTORS);
    const dateToday = new Date();
    uiHandler.initialize(dateToday.getHours(), dateToday.getMinutes(), dateToday.getSeconds());
    
    setInterval(uiHandler.moveSecondsHand, 1000);
}

const clockElem = document.querySelector('.clock');
controller(clockElem);
