const axios = require('axios');

const fetchJobs = async () => {
  const url = 'https://e5mquma77feepi2bdn4d6h3mpu.appsync-api.us-east-1.amazonaws.com/graphql';

  const payloadCA = {
    "operationName": "searchJobCardsByLocation",
    "variables": {
        "searchJobRequest": {
            "locale": "en-CA",
            "country": "Canada",
            "pageSize": 100,
            "geoQueryClause": {
                "lat": 43.685271,
                "lng": -79.759924,
                "unit": "km",
                "distance": 100
            },
            "dateFilters": [
                {
                    "key": "firstDayOnSite",
                    "range": {
                        "startDate": "2024-09-29"
                    }
                }
            ]
        }
    },
    "query": "query searchJobCardsByLocation($searchJobRequest: SearchJobRequest!) {\n  searchJobCardsByLocation(searchJobRequest: $searchJobRequest) {\n    nextToken\n    jobCards {\n      jobId\n      language\n      dataSource\n      requisitionType\n      jobTitle\n      jobType\n      employmentType\n      city\n      state\n      postalCode\n      locationName\n      totalPayRateMin\n      totalPayRateMax\n      tagLine\n      bannerText\n      image\n      jobPreviewVideo\n      distance\n      featuredJob\n      bonusJob\n      bonusPay\n      scheduleCount\n      currencyCode\n      geoClusterDescription\n      surgePay\n      jobTypeL10N\n      employmentTypeL10N\n      bonusPayL10N\n      surgePayL10N\n      totalPayRateMinL10N\n      totalPayRateMaxL10N\n      distanceL10N\n      monthlyBasePayMin\n      monthlyBasePayMinL10N\n      monthlyBasePayMax\n      monthlyBasePayMaxL10N\n      jobContainerJobMetaL1\n      virtualLocation\n      poolingEnabled\n      __typename\n    }\n    __typename\n  }\n}\n"
}
  try {
    const response = await axios.post(url, payloadCA, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 8zeVcJNsa09ybN7j9gn7FLFlhSgpkDNzNUEqo6QL28D==' // Replace with your actual token
      }
    });

    const jobCards = response.data.data.searchJobCardsByLocation.jobCards;

    // Check if jobCards is empty
    if (jobCards.length === 0) {
      console.log("No jobs found.");
      return []; // Return an empty array or handle accordingly
    }

    // Extract job IDs and construct URLs if jobs are found
    const jobUrls = jobCards.map(job => ({
      jobId: job.jobId,
      jobTitle: job.jobTitle,
      url: `https://hiring.amazon.ca/app#/jobDetail?jobId=${job.jobId}&locale=en-CA`
    }));
console.log(jobUrls);
    return jobUrls;

  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

module.exports = fetchJobs;
