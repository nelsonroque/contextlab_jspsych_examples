// ------------------------------------------------------------------------
// CONFIG TASK PROCEDURE
// ------------------------------------------------------------------------

// get date as soon as script loads
var date = new Date();

// ------------------------------------------------------------------------

// set API url for saving session codes ------
var API_URL = 'https://cogtasks.com/api/v1/capture.php';

// ------------------------------------------------------------------------

// set experiment name ------
var experiment_name = "demo_digitspan";
var experiment_label = "Digit Span";
var experiment_ref_url = "https://en.wikipedia.org/wiki/Memory_span#Digit-span";
var experiment_trial_timeout = 30000;
var experiment_num_blocks = 3;
var target_stimulus_pres_time = 3500;

// ------------------------------------------------------------------------

// specify styling  ------
STIM_FONT_SIZE = 60;

// ------------------------------------------------------------------------

// initialize session  ------
var session_id = jsPsych.randomization.randomID(16);
var session_start = date.toISOString();

// get participant info from URL (if present) ------
var study_id = jsPsych.data.getURLVariable('study_id');
var participant_id = jsPsych.data.getURLVariable('participant_id');

// ------------------------------------------------------------------------

// set properties in data -----

jsPsych.data.addProperties({
  session_id: session_id,
  session_start: session_start,
  study_id: study_id,
  participant_id: participant_id,
  experiment_name: experiment_name,
});

// ------------------------------------------------------------------------
// START TELEMETRY OUTPUT
// ------------------------------------------------------------------------

console.log("---------------------------------------");
console.log("CogTasks.com: TELEMETRY [START]");
console.log("---------------------------------------");
console.log("EXPERIMENT NAME: " + experiment_label);
console.log("EXPERIMENT DATA CODENAME: " + experiment_name);
console.log("EXPERIMENT REFERENCE: " + experiment_ref_url);
console.log("SESSION START DATETIME: " + session_start);
console.log("SESSION ID: " + session_id);
console.log("STUDY ID: " + study_id);
console.log("PARTICIPANT ID: " + participant_id);
console.log("N BLOCKS: " + experiment_num_blocks);
console.log("API URL: " + API_URL);

// ------------------------------------------------------------------------
// SPECIFY EXPERIMENTAL PROCEDURE AND INSTRUCTIONS
// ------------------------------------------------------------------------

// specify welcome screen ------
var welcome = {
  type: "html-button-response",
  data: {task_section: 'welcome'},
  stimulus: "Welcome to the <b>" + experiment_label + "</b> experiment." +
  "<hr>",
  choices: ['Read Instructions']
};

// ------------------------------------------------------------------------

// specify task instructions ------
var instructions = {
  type: "html-button-response",
  stimulus: "<p>In this experiment, you will be briefly presented a set of numbers, ranging from 2 to 11 digits.</p>" +
          "<br>" +
          "<p>Your goal is to report, as quickly and accurately as possible, the numbers in the order that you remember them.</p>" +
          "<hr>" +
          "<p>Press the button below to begin.</p>",
  data: {task_section: 'instructions'},
  post_trial_gap: 2000,
  choices: ['Start Experiment']
};

// ------------------------------------------------------------------------

// specify task procedure ------
var trial_procedure = {

  timeline: [
      {
        type: 'html-keyboard-response',
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: jsPsych.NO_KEYS,
        trial_duration: function(){
          return jsPsych.randomization.sampleWithoutReplacement([target_stimulus_pres_time], 1)[0];
        },
      },

      {
          type: 'cloze',
          text: '%%',
          button_text: 'Next',
          data: jsPsych.timelineVariable('data'),
          on_finish: function(data){
            data.task_section = 'spanresponse';
            console.log("SPAN: " + data.span);
            console.log("TASK SECTION: " + data.task_section);
          },
      }
  ]
};

var trial_procedure_delay = {

  timeline: [
      {
        type: 'html-keyboard-response',
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: jsPsych.NO_KEYS,
        trial_duration: function(){
          return jsPsych.randomization.sampleWithoutReplacement([target_stimulus_pres_time], 1)[0];
        },
      },

      {
        type: 'html-keyboard-response',
        stimulus: '<div style="font-size:'+STIM_FONT_SIZE+'px;">PLEASE WAIT</div>',
        choices: jsPsych.NO_KEYS,
        data: jsPsych.timelineVariable('data'),
        trial_duration: function(){
          return jsPsych.randomization.sampleWithoutReplacement([target_stimulus_pres_time-1500, target_stimulus_pres_time, target_stimulus_pres_time+1500], 1)[0];
      },
        data: {task_section: 'delay_phase'}
      },


      {
          type: 'cloze',
          text: '%%',
          button_text: 'Next',
          data: jsPsych.timelineVariable('data'),
          on_finish: function(data){
            data.task_section = 'spanresponse';
            console.log("SPAN: " + data.span);
            console.log("TASK SECTION: " + data.task_section);
          },
      }
  ]
};




var practice_timeline_variables = [
    { stimulus: randomStr(2, '123456789'), data: { span: '2'} },
      { stimulus: randomStr(3, '123456789'), data: { span: '3'} },
];

var test_timeline_variables = [
      { stimulus: randomStr(3, '123456789'), data: { span: '3'} },
      { stimulus: randomStr(4, '123456789'), data: { span: '4'} },
      { stimulus: randomStr(5, '123456789'), data: { span: '5'} },
      { stimulus: randomStr(6, '123456789'), data: { span: '6'} },
      { stimulus: randomStr(7, '123456789'), data: { span: '7'} },
      { stimulus: randomStr(8, '123456789'), data: { span: '8'} },
      { stimulus: randomStr(9, '123456789'), data: { span: '9'} },
      { stimulus: randomStr(10, '123456789'), data: { span: '10'} },
      { stimulus: randomStr(11, '123456789'), data: { span: '11'} },
];

var task_procedure_nodelay = {
  timeline: [trial_procedure],
  timeline_variables: practice_timeline_variables,
  randomize_order: false,
  repetitions: 1
};

var task_procedure_delay = {
  timeline: [trial_procedure_delay],
  timeline_variables: test_timeline_variables,
  randomize_order: false,
  repetitions: 1
};


// ------------------------------------------------------------------------

// specify debriefing ------
var debug_close = {
  type: "html-button-response",
  stimulus: function() {


    return "<h1><b>Experiment: </b>" + experiment_label + "</h1>" +
    "<a target='_blank' href='" + experiment_ref_url + "'>Learn More about this Experiment</a>" +
    "<hr>" +
    "Please take a picture of this code, or copy the code with your keyboard/mouse for entry in the Webcourses assignment." +
    "<h3>Code: <span style='background-color: yellow'> " + session_id + "</span></h3>" +
    "<hr>" +
    "<p>Press the button below or close this browser window to complete the experiment.</p>";
  },
  choices: ['Close this Experiment'],
  prompt: "<p>Thank you for your time.</p>",
  data: {task_section: 'debriefing'}
};

// specify debriefing ------
var debrief = {
  type: "html-button-response",
  stimulus: function() {
    
    // filter response phase
    var trials = jsPsych.data.get();

    var overall_rt = Math.round(trials.select('rt').mean());
    var overall_sd = Math.round(trials.select('rt').sd());

    // var trials_s2 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '2'});
    // var trials_s3 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '3'});
    // var trials_s4 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '4'});
    // var trials_s5 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '5'});
    // var trials_s6 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '6'});
    // var trials_s7 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '7'});
    // var trials_s8 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '8'});
    // var trials_s9 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '9'});
    // var trials_s10 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '10'});
    // var trials_s11 = jsPsych.data.get().filter({task_section: 'spanresponse', span: '11'});

    // var rt_s2 = Math.round(trials_s2.select('rt').mean());
    // var rt_s3 = Math.round(trials_s3.select('rt').mean());
    // var rt_s4 = Math.round(trials_s4.select('rt').mean());
    // var rt_s5 = Math.round(trials_s5.select('rt').mean());
    // var rt_s6 = Math.round(trials_s6.select('rt').mean());
    // var rt_s7 = Math.round(trials_s7.select('rt').mean());
    // var rt_s8 = Math.round(trials_s8.select('rt').mean());
    // var rt_s9 = Math.round(trials_s9.select('rt').mean());
    // var rt_s10 = Math.round(trials_s10.select('rt').mean());
    // var rt_s11 = Math.round(trials_s11.select('rt').mean());

    return "<h1><b>Experiment: </b>" + experiment_label + "</h1>" +
    "<a target='_blank' href='" + experiment_ref_url + "'>Learn More about this Experiment</a>" +
    "<hr>" +
    "<h2>Data Summary</h2>" +
    "<p>Your average response time was</p>"+
    "<h3>" + overall_rt + " ms" + " (SD: " + overall_sd + " ms)</h3>" +
    "<hr>" +
    "<center>" +
    // "<table>" +
    // "<tr>" +
    // "<td>" + "Span 2" + "</td>" +
    // "<td>" + "Span 3" + "</td>" +
    // "<td>" + "Span 4" + "</td>" +
    // "<td>" + "Span 5" + "</td>" +
    // "<td>" + "Span 6" + "</td>" +
    // "<td>" + "Span 7" + "</td>" +
    // "<td>" + "Span 8" + "</td>" +
    // "<td>" + "Span 9" + "</td>" +
    // "<td>" + "Span 10" + "</td>" +
    // "<td>" + "Span 11" + "</td>" +
    // "</tr>" +
    // "<tr>" +
    // "<td>" + rt_s2 + "</td>" +
    // "<td>" + rt_s3 + "</td>" +
    // "<td>" + rt_s4 + "</td>" +
    // "<td>" + rt_s5 + "</td>" +
    // "<td>" + rt_s6 + "</td>" +
    // "<td>" + rt_s7 + "</td>" +
    // "<td>" + rt_s8 + "</td>" +
    // "<td>" + rt_s9 + "</td>" +
    // "<td>" + rt_s10 + "</td>" +
    // "<td>" + rt_s11 + "</td>" +
    // "</tr>" +
    // "</table>" +
    // "<hr>" +
    // "RT (span 9) - RT (span 3) = " + (rt_s9 - rt_s3) +
    //"<hr>" +
    "</center>" +
    //"<hr>" +
    "Please take a picture of this code, or copy the code with your keyboard/mouse for entry in the Webcourses assignment." +
    "<h3>Code: <span style='background-color: yellow'> " + session_id + "</span></h3>" +
    "<hr>" +
    //"<button onclick='on_button_click()'>Want to see your data?</button>" +
    "<p>Press the button below or close this browser window to complete the experiment.</p>";
  },
  choices: ['Close this Experiment'],
  prompt: "<p>Thank you for your time.</p>",
  data: {task_section: 'debriefing'}
};

// ------------------------------------------------------------------------

// start the experiment -----
jsPsych.init({
  timeline: [welcome, instructions, task_procedure_nodelay, task_procedure_delay, debrief],

  // specify actions to execute on experiment close, finish, update in browser focus
  on_close: function() {
    console.log("ON_CLOSE: " + JSON.stringify(jsPsych.data.get()));
    save_tracking_token(API_URL, experiment_name, study_id, session_start, session_id, "on_close");
  },

  on_interaction_data_update: function(data) {
    console.log("INTERACTION: " + JSON.stringify(data));
    save_tracking_token(API_URL, experiment_name, study_id, session_start, session_id, "on_interaction_data_update");
  },

  on_finish: function() {
    console.log("ON_FINISH: " + JSON.stringify(jsPsych.data.get()));
    save_tracking_token(API_URL, experiment_name, study_id, session_start, session_id, "on_finish");
  }
});