const express = require('express');
const fetchJobs = require('./api/fetchJobs');
const fetchSchedules = require('./api/fetchSchedules');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const main = async () => {
    try {
        const jobUrls = await fetchJobs(); // Fetch jobs

        // Validate jobUrls
        if (!Array.isArray(jobUrls) || jobUrls.length === 0) {
            console.log("No job URLs available.");
            return null; // Return null if there are no jobs
        }

        const job = jobUrls[0]; // Get the first job URL
       
        const jobDetails = await fetchSchedules(job.jobId);

        // Validate jobDetails
        if (!Array.isArray(jobDetails) || jobDetails.length === 0) {
            console.log("No schedule details available for job ID:", job.jobId);
            return null; // Return null if there are no schedules
        }

        return jobDetails[0]; // Return the first schedule detail
    } catch (error) {
        console.error('Error in main function:', error);
        throw error; // Re-throw error to be caught in the route handler
    }
};

app.get("/", (req, res) => {
    res.send(`<h1>Welcome</h1>`);
});

app.get('/jobs', async (req, res) => {
    try {
        const jobData = await main();

        // Check if jobData is null (indicating no jobs or schedules)
        if (!jobData) {
            return res.status(404).send('No job data available');
        }

        const jobId = jobData.jobId;
        const scheduleId = jobData.scheduleId;

        const url = `https://hiring.amazon.ca/application/ca/?CS=true&jobId=${jobId}&locale=en-CA&scheduleId=${scheduleId}&ssoEnabled=1#/consent?CS=true&jobId=${jobId}&locale=en-CA&scheduleId=${scheduleId}&ssoEnabled=1`;
        console.log("Going to URL ", url);
        res.send(`Found
        <script>
            window.open('${url}', '_blank');
        </script>
    `);
    } catch (error) {
        console.error('Failed to fetch job data:', error);
        res.status(500).send('Failed to fetch job data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
