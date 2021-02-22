
exports.getDate = getDate;
exports.getDay= getDay;

function getDate(){
  let today = new Date();
  let options ={
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  return today.toLocaleDateString("en-us",options);
}

function getDay(){
  let today = new Date();
  let options ={
    weekday:"long",
  };
  return today.toLocaleDateString("en-us",options);
}
