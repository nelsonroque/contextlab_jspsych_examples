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
var experiment_name = "Stroop";
var experiment_label = "Stroop";
var experiment_ref_url = "";
var experiment_trial_timeout = 30000;
var experiment_num_blocks = 10;

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

var timeline = [];

// ------------------------------------------------------------------------

// specify welcome screen ------
var welcome = {
  type: "html-button-response",
  data: {task_section: 'welcome'},
  stimulus: "Welcome to the <b>" + experiment_label + "</b> experiment." +
  "<hr>",
  choices: ['Read Instructions']
};

timeline.push(welcome);

// ------------------------------------------------------------------------

// specify task instructions ------
var instructions_block = {
    type: "instructions",
    pages: ["<p>In this experiment, a word will appear in the center " +
        "of the screen.</p><p>When the word appears respond with the <strong>color</strong> " +
        "in which the word is printed as quickly as you can.</p><p> press <strong>R</strong> " +
        "for red, <strong>G</strong> for green, and <strong>B</strong> for blue.</p>"],
  data: {task_section: 'instructions'},
  post_trial_gap: 1000,
  show_clickable_nav: true,
  choices: ['Start Experiment']
};

timeline.push(instructions_block);

// ------------------------------------------------------------------------

// specify task procedure ------


/* stimuli specifications */
var trials = [
    {
        stimulus: "<p style='font-size: 50px; color: red;'>SHIP</p>",
        data: {word: 'BLANKET', color: 'red', stimulus_type: 'unrelated', correct_response: 'R'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: green;'>MONKEY</p>",
        data: {word: 'LADDER', color: 'green', stimulus_type: 'unrelated', correct_response: 'G'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: blue;'>ZAMBONI</p>",
        data: {word: 'APPLESAUCE', color: 'blue', stimulus_type: 'unrelated', correct_response: 'B'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: red;'>RED</p>",
        data: {word: 'RED', color: 'red', stimulus_type: 'congruent', correct_response: 'R'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: green;'>GREEN</p>",
        data: {word: 'GREEN', color: 'green', stimulus_type: 'congruent', correct_response: 'G'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: blue;'>BLUE</p>",
        data: {word: 'BLUE', color: 'blue', stimulus_type: 'congruent', correct_response: 'B'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: red;'>GREEN</p>",
        data: {word: 'GREEN', color: 'red', stimulus_type: 'incongruent', correct_response: 'R'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: green;'>BLUE</p>",
        data: {word: 'BLUE', color: 'green', stimulus_type: 'incongruent', correct_response: 'G'}
    },
    {
        stimulus: "<p style='font-size: 50px; color: blue;'>RED</p>",
        data: {word: 'RED', color: 'blue', stimulus_type: 'incongruent', correct_response: 'B'}
    }
];

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:'+STIM_FONT_SIZE+'px;">+</div>',
    choices: jsPsych.NO_KEYS,
    trial_duration: function(){
    return jsPsych.randomization.sampleWithoutReplacement([500], 1)[0];
    },
    data: {task_section: 'fixation'}
 };

var word = {
    type: "html-button-response",
    stimulus:  jsPsych.timelineVariable('stimulus'),
    choices: ['r','g', 'b'],
    data: jsPsych.timelineVariable('data'),
    // on_finish: function(d){
    //     d.correct = d.key_press == d.correct_response.charCodeAt(0);
    // }
};

var test_procedure = {
    timeline: [fixation, word],
    timeline_variables: trials,
    randomize_order: true
};
timeline.push(test_procedure);

var summary = {
    type: "html-button-response",
    stimulus: function(){
        var congruent_rt = jsPsych.data.get().filter({stimulus_type: 'congruent'}).select('rt').mean();
        var incongruent_rt = jsPsych.data.get().filter({stimulus_type: 'incongruent'}).select('rt').mean();
        var unrelated_rt = jsPsych.data.get().filter({stimulus_type: 'unrelated'}).select('rt').mean();
        var congruent_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'congruent'}).select('correct').mean();
        var incongruent_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'incongruent'}).select('correct').mean();
        var unrelated_pct = 100 * jsPsych.data.get().filter({stimulus_type: 'unrelated'}).select('correct').mean();
        return '<p>Your average response time on congruent trials was '+Math.round(congruent_rt)+'ms. '+
            'Your average response time on incongruent trials was '+Math.round(incongruent_rt)+'ms. '+
            'Your average response time on unrelated trials was '+Math.round(unrelated_rt)+'ms.</p>'+
            '<p>Your average percent correct on congruent trials was '+Math.round(congruent_pct)+'%. '+
            'Your average percent correct on incongruent trials was '+Math.round(incongruent_pct)+'%. '+
            'Your average percent correct on unrelated trials was '+Math.round(unrelated_pct)+'%.</p>'+
            '<p>Thanks for participating! Press "q" to finish the experiment.</p>';
    },
    choices: ['q'],
};
timeline.push(summary);

// ------------------------------------------------------------------------

// set properties in data -----

jsPsych.data.addProperties({
  session_id: session_id,
  session_start: session_start,
  study_id: study_id,
  participant_id: participant_id,
  experiment_name: experiment_name,
  // condition: condition,
  // counterbalance: counterbalance
});

// ------------------------------------------------------------------------

// start the experiment -----
jsPsych.init({
  timeline:timeline,

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