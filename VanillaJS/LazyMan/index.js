/* Solution for this BFD Problem: https://bigfrontend.dev/problem/create-lazyman */
"use strict"
console.clear();

LazyMan('Jack', console.log)
  .eat('banana')
  .sleepFirst(100)
  .eat('apple')
  .sleepFirst(100)
  .sleep(100)
  .eat('mango')

function LazyMan(name, logFn) {
   const handler = new Object();    
    handler.taskQueue = [{message:`Hi, I am ${name}`}];
    handler.processTaskQueueTimerId = null;
    handler.initialDelayInMillis = 0;
  
    function processTaskQueue() {      
      let delaysInMillis = handler.initialDelayInMillis;      
      handler.taskQueue.forEach(task => {
        if(task?.message) setTimeout(() => logFn(task.message), delaysInMillis);
        else if(task?.delayInMillis) {
          delaysInMillis += task.delayInMillis;      
          setTimeout(()=> logFn(`waking up after ${task.delayInMillis} millis`), delaysInMillis);
        }
      })
    }
  
    handler.eat = function(stuff) {
      clearTimeout(handler.processTaskQueueTimerId);      
      handler.taskQueue.push({message:`eat ${stuff}`});      
      handler.processTaskQueueTimerId = setTimeout(processTaskQueue, 0);
      return this;
    }
  
    handler.sleep = function(timeInMillis) {
      clearTimeout(handler.processTaskQueueTimerId);      
      handler.taskQueue.push({delayInMillis: timeInMillis});
      handler.processTaskQueueTimerId = setTimeout(processTaskQueue, 0);
      return this;
    }
  
    handler.sleepFirst = function(timeInMillis) {
      clearTimeout(handler.processTaskQueueTimerId);      
      handler.initialDelayInMillis += timeInMillis;
      handler.processTaskQueueTimerId = setTimeout(processTaskQueue, 0);
      return this;
    }
  
    return handler;
 }
  
