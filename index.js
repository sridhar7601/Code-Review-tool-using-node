const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PythonShell } = require('python-shell');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// API endpoint for code review
app.post('/review', (req, res) => {
  const code = req.body.code;

  // Set up PythonShell options
  const options = {
    mode: 'text',
    pythonOptions: ['-m'],
    scriptPath: '', // Set the path to your Python script if necessary
    args: ['--output-format=json', '--score=no', '--msg-template="{line}:{msg}"', '-'], // Set desired analysis options
    pythonPath: 'python' // Specify the path to the Python interpreter if necessary
  };

  // Execute the code analysis tool with the provided code
  PythonShell.run('<analysis_tool_script>', options, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred during code analysis.' });
    }

    // Parse the analysis results and return as response
    const analysisResults = JSON.parse(results);

    res.json({ issues: analysisResults });
  });
});

// Start the server
const port = 3000; // Replace with your desired port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
