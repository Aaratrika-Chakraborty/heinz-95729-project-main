const fs = require('fs')
const express = require('express')
const serveStatic = require('serve-static')
const { spawn } = require('child_process')  // Child process to integrate python into server code
const app = express()
const { once } = require('events')
const path = require('path');



// serve this directory as a static web server
app.use(serveStatic(__dirname))

const pypath = './ml/src/knn.py'
var vars = ['Cab','Creative','Cafe/Espresso Bars','Carry in Wine and Beer','$15-$30','Quiet for Conversation']
vars.splice(0, 0, pypath)

//Python Integration Portion

//Make sure Python is running in the environment ex. Output on console should be your verion number (i.e. Python 3.6.2)
//const childPython = spawn('python', ['--version']);

//Test to make sure directory is properly integrated and python script will run
//const childPython = spawn('python', ['./ml/src/testing/test.py'])

//Test for inputting system arguments into python scripts
//Gets python file and runs the python script with an array index 0 is the python file, and every index after that should be feature number
//const childPython = spawn('python', ['./ml/src/testing/test2.py',12])

//Machine Learning Python Script
//const childPython = spawn('python', vars)

async function ml_alg(features){
      const childPython = spawn('python', vars)
      var result = '';

      childPython.stdout.on('data', (data) => 
      {
  
        result += data.toString();
        console.log(result);

      });

      childPython.stdout.on('close', (code) => 
      {
        
        console.log(`Child process exited with code ${code}`);
        //console.log("I am the result on closed: ", result);
        //console.log(typeof(result));
        return result;

      });

      childPython.stderr.on('data', (err) => 
      {

        console.log(`stderr: ${err}`);
        return("Error");

      });

      await once(childPython, 'close');

      return result;
        
  }

async function grabvals(features) {

  try
  {
    const output = await ml_alg(features);
    console.log("I am the output",output);
    //     app.post('/example', (req, res) => {
    //   res.send(`Full name is:${req.body.fname} ${req.body.lname}.`);
    // });
  }

  catch(err) 
  {
    console.log(err);
    throw(err);
  }
}

var feats = grabvals(vars)
//console.log("The end result",feats);


// 404 - return the SPA index for any files that aren't found
app.use(function (req, res, next) {
  'use strict'

  res.writeHead(200, { 'Content-Type': 'text/html' })
  fs.createReadStream('./index.html').pipe(res)
})




// response to port 3001
app.listen(3001)
console.log('The app is running at http://localhost:3001')
