# LectureQuizz
This project is a web-based tool where a lecturer can spontaneously ask
questions during a class and students can provide answers interactively via a laptop, tablet or a smart-
phone. The answers provided by the students can then be evaluated and if possible, also visualized. For
the time being the application supports the following question types and are subject to a specified DSL:
1. Yes/No questions: A question which can be answers with yes(true) or no(false).
2. Multiple-choice: A question with more than one answer to select.
3. Free text: For the question the student can elaborate its own answer and submit it.
The visualization of the provided answers is only possible for yes/no and multiple-choice question types.


### How to install and run the application
In order to install the tool, the following needs to be installed:
1. Download and install Node.js
2. Open Terminal (MacOS/Linux) / cmd(Windows) and navigate to the project folder and run `npm install`.
3. After the installation is complete, then run `npm start`.

### Configuration File
On the project folder a configuration file exists (config.js) where the following can be configured:
* PORT: the host port where the server will be running. (DEFAULT=3000)
* MASTER_CODE: the master code needed to create a session/room. (DEFAULT=1234)
