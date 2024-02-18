const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3001; // Or any other port you're using

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Define your REST API routes
app.post('/completions', async (req, res) => {
  try {
    // Get the message from the request body
    const { prompt, model, max_tokens } = req.body;

    // Make a request to the PredictionGuard API
    const response = await fetch("https://api.predictionguard.com/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "q1VuOjnffJ3NO2oFN8Q9m8vghYc84ld13jaqdF7E" // Replace with your access token
      },
      body: JSON.stringify({ prompt, model, max_tokens })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from PredictionGuard API');
    }

    // Parse the response as JSON
    const data = await response.json();

    // Send the completions back to the client
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://10.5.94.111:${port}`);
});
