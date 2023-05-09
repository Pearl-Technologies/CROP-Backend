const getLastFriday=()=>{
    let fridayValue = 5;
    let date=new Date();
    let index =1 
    while(new Date(date).getDay() !== fridayValue){
      date  = Date.now(date)-1000*60*60*24*index;
      index=index+1
    }
    return date;
}
module.exports = getLastFriday