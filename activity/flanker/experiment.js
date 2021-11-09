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
var experiment_name = "demo_flanker";
var experiment_label = "Flanker";
var experiment_ref_url = "https://en.wikipedia.org/wiki/Eriksen_flanker_task";
var experiment_trial_timeout = 30000;
var experiment_num_blocks = 3;

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
  stimulus: "<p>In this experiment, a set of arrows will appear in the center of the screen.</p>" +
          "<br>" +
          "<p>Your goal is to report, as quickly and accurately as possible, the direction of the central arrow in the set of arrows.</p>" +
          "<hr>" +
          "<div style='width: 80%;'>"+
          "<div style='float: left;'>&#x2190;&#x2190;&#x2190;&#x2190;&#x2190;" +
          "<p class='small'><strong>Press the LEFT (&#x2190;) button</strong></p></div>" +
          "<div class='float: right;'>&#x2192;&#x2192;&#x2192;&#x2192;&#x2192;" +
          "<p class='small'><strong>Press the RIGHT (&#x2192;) button</strong></p></div>" +
          "</div>"+
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
          stimulus: '<div style="font-size:'+STIM_FONT_SIZE+'px;">+</div>',
          choices: jsPsych.NO_KEYS,
          trial_duration: function(){
            return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
          },
          data: {task_section: 'fixation'}
          },
      {
          type: 'html-button-response',
          stimulus: jsPsych.timelineVariable('stimulus'),
          choices: ['<b>&#x2190;</b>', '<b>&#x2192;</b>'],
          prompt: "<p>Click or Touch Button above.</p>",
          on_finish: function(data){
            data.correct = data.button_press == data.correct_response;
            console.log("RESPONSE ACCURACY: " + data.correct);
          },
      }
  ]
};

var test_timeline_variables = [
      { stimulus: "<h1>&#x2190;&#x2190;&#x2190;&#x2190;&#x2190;</h1>", data: { task_section: 'test', direction: 'left' , congruent: 'true', correct_response: '<b>&#x2190;</b>'} },
      { stimulus: "<h1>&#x2192;&#x2192;&#x2192;&#x2192;&#x2192;</h1>", data: { task_section: 'test', direction: 'right' , congruent: 'true', correct_response: '<b>&#x2192;</b>'} },
      { stimulus: "<h1>&#x2190;&#x2190;&#x2192;&#x2190;&#x2190;</h1>", data: { task_section: 'test', direction: 'right' , congruent: 'false', correct_response: '<b>&#x2192;</b>'} },
      { stimulus: "<h1>&#x2192;&#x2192;&#x2190;&#x2192;&#x2192;</h1>", data: { task_section: 'test', direction: 'left' , congruent: 'false', correct_response: '<b>&#x2190;</b>'} },
      { stimulus: "<h1>&#x25A1;&#x25A1;&#x2190;&#x25A1;&#x25A1;</h1>", data: { task_section: 'test', direction: 'left' , congruent: 'neutral', correct_response: '<b>&#x2190;</b>'} },
      { stimulus: "<h1>&#x25A1;&#x25A1;&#x2192;&#x25A1;&#x25A1;</h1>", data: { task_section: 'test', direction: 'right' , congruent: 'neutral', correct_response: '<b>&#x2192;</b>'} },
];

var task_procedure = {
  timeline: [trial_procedure],
  timeline_variables: test_timeline_variables,
  randomize_order: true,
  repetitions: experiment_num_blocks
}


// ------------------------------------------------------------------------

// specify debriefing ------
var debrief = {
  type: "html-button-response",
  stimulus: function() {
    
    // filter response phase
    var trials = jsPsych.data.get().filter({correct: 'true'});

    var trials_con = trials.filter({congruent: 'true'});
    var trials_incon = trials.filter({congruent: 'false'});
    var trials_neutral = trials.filter({congruent: 'neutral'});

    var overall_rt = Math.round(trials.select('rt').mean());
    var overall_sd = Math.round(trials.select('rt').sd());

    return "<h1><b>Experiment: </b>" + experiment_label + "</h1>" +
    "<a target='_blank' href='" + experiment_ref_url + "'>Learn More about this Experiment</a>" +
    "<hr>" +
    "<h2>Data Summary</h2>" +
    "<p>Your average response time was</p>"+
    "<h3>" + overall_rt + " ms" + " (SD: " + overall_sd + " ms)</h3>" +
    "<hr>" +
    "<center>" +
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
  timeline: [welcome, instructions, task_procedure, debrief],

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