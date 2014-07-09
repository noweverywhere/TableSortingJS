Setting Up Development Environment
---
1. Install Node.js
Go to http://nodejs.org/, download and install latest version of node.js.
Or else use a package manager like apt-get to install node by entering a
command such as:
 > "sudo apt-get install nodejs".

2. Navigate to directory where source code is checked out and use
npm (node package manager) to install dependencies. This could be done by entering
the command:
 > "npm install".

3. **bold** To run test suite you must install the Karma package globally **bold**
this is done by entering the command on linux or mac
> "sudo npm install -g karma"
On Windows machines enter the command:
> "npm install -g karma"
and then add the node modules to your path by adding a variable NODE_PATH with the value
> %AppData%\npm\node_modules
to your global path.

4. **bold** To run tests **bold**
Using command line interface navigate to the directory where source is checked out
and enter the command:
> "npm test"
This will launch a browser window specified in /test/karma.conf.js, and show
test results in current command line terminal.

5. To see example DOM with code in use enter command
> "npm start"
then open browser tab to localhost:8080/index.html