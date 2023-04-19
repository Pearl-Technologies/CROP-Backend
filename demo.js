const schedule = require('node-schedule');

// define the job
const sendNotification=(count)=>{    
    console.log(`sent ${count} time`)
}
var count=1
const job = schedule.scheduleJob('* * * * *', function() {
//   console.log('This job runs at midnight every day!'); 
    if(count == 1){
        sendNotification(count);
        count++
    }else if(count==2){
        sendNotification(count);
        count=1
    }
  
});

// start the job
job.schedule();