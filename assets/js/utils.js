// custom functions
function generateUUID() { 
  // Public Domain/MIT
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
  d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  var r = (d + Math.random() * 16) % 16 | 0;
  d = Math.floor(d / 16);
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function load_url_param_set_default(param, default_val) {
  var param_ = jsPsych.data.getURLVariable(param);
  
  if(typeof param_ === 'undefined') {
    param_ = default_val;
  }
  
  return(param_);
}

function display_data_on_click() {
  alert(JSON.stringify(jsPsych.data.displayData()));
}

function save_data_dev(json_data) {
  const xhr = new XMLHttpRequest();
  const data = JSON.stringify(json_data);
  xhr.withCredentials = false;
  xhr.open("POST", "INSERT API URL HERE");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("CONTEXTLAB-API-KEY", "INSERT API KEY HERE");
  xhr.send(data);
}

function randomStr(len, arr) { 
  var ans = ''; 
  for (var i = len; i > 0; i--) { 
      ans +=  
        arr[Math.floor(Math.random() * arr.length)]; 
  } 
  return ans; 
}

/** functions **/
function alphabetRange (start, end) {
  return new Array(end.charCodeAt(0) - start.charCodeAt(0) + 1).fill().map((d, i) => String.fromCharCode(i + start.charCodeAt(0)));
}
function keyCodeRange (start, end) {
  var start = start.charCodeAt(0);
  return new Array(end.charCodeAt(0) - start + 1).fill().map((d, i) => i + start);
}
function numberRange (start, end) {
  return new Array(end - start + 1).fill().map((d, i) => i + start);
}
