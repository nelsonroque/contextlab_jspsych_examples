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
var experiment_name = "demo_choice_rt";
var experiment_label = "Choice Reaction Time (Choice RT)";
var experiment_ref_url = "https://cognitionlab.com/portfolio/donders-response-types/"; // alternate: https://michaelbach.de/ot/sze-muelue/
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
  stimulus: "<p>In this experiment, a circle will appear in the center " +
          "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
          "press the letter F on the keyboard as fast as you can.</p>" +
          "<p>If the circle is <strong>orange</strong>, press the letter J " +
          "as fast as you can.</p>" +
          "<div style='width: 700px;'>"+
          "<div style='float: left;'><img src='img/blue.png'></img>" +
          "<p class='small'><strong>Press the F key</strong></p></div>" +
          "<div class='float: right;'><img src='img/orange.png'></img>" +
          "<p class='small'><strong>Press the J key</strong></p></div>" +
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
          type: "image-keyboard-response",
          stimulus: jsPsych.timelineVariable('stimulus'),
          choices: ['f', 'j'],
          data: jsPsych.timelineVariable('data'),
          on_finish: function(data){
            data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
            console.log("RESPONSE ACCURACY: " + data.correct);
          },
      }
  ]
};

var test_timeline_variables = [
      { stimulus: "img/blue.png", data: { task_section: 'test', correct_response: 'f' } },
      { stimulus: "img/orange.png", data: { task_section: 'test', correct_response: 'j' }}
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
    var trials = jsPsych.data.get().filter({task_section: 'test'});
    var correct_trials = trials.filter({correct: true});
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var overall_rt = Math.round(correct_trials.select('rt').mean());
    var overall_sd = Math.round(correct_trials.select('rt').sd());

    return "<h1><b>Experiment: </b>" + experiment_label + "</h1>" +
    "<a target='_blank' href='" + experiment_ref_url + "'>Learn More about this Experiment</a>" +
    "<hr>" +
    "<h2>Data Summary</h2>" +
    "<p>Your average response time was</p>"+
    "<h3>" + overall_rt + " ms" + " (SD: " + overall_sd + " ms)</h3>" +
    "<p>Your average accuracy was</p>"+
    "<h3>" + accuracy + " %</h3>" +
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
    save_completion_code(session_id);
  }
});