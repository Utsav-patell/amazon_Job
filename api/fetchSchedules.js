const axios = require('axios');

const fetchSchedules = async (jobId) => {
    if (!jobId || jobId==="") {
        console.log("No job URLs provided.");
        return [];
    }

    const url = 'https://e5mquma77feepi2bdn4d6h3mpu.appsync-api.us-east-1.amazonaws.com/graphql';
    const allSchedules = [];

    // for (const jobUrl of jobUrls) {
         // Extracting jobId from the response
       
        console.log("Processing Job ID:", jobId);

        const payloadCA = {
            "operationName": "searchScheduleCards",
            "variables": {
                "searchScheduleRequest": {
                    "locale": "en-CA",
                    "country": "Canada",
                    "keyWords": "",
                    "equalFilters": [],
                    "containFilters": [
                        {
                            "key": "isPrivateSchedule",
                            "val": [
                                "false"
                            ]
                        }
                    ],
                    "rangeFilters": [],
                    "orFilters": [],
                    "dateFilters": [
                        {
                            "key": "firstDayOnSite",
                            "range": {
                                "startDate": "2024-09-29"
                            }
                        }
                    ],
                    "sorters": [
                        {
                            "fieldName": "totalPayRateMax",
                            "ascending": "false"
                        }
                    ],
                    "pageSize": 1000,
                    "jobId": jobId  // Use jobId from the jobUrls array
                }
            },
            "query": "query searchScheduleCards($searchScheduleRequest: SearchScheduleRequest!) {\n  searchScheduleCards(searchScheduleRequest: $searchScheduleRequest) {\n    nextToken\n    scheduleCards {\n      hireStartDate\n      address\n      basePay\n      bonusSchedule\n      city\n      currencyCode\n      dataSource\n      distance\n      employmentType\n      externalJobTitle\n      featuredSchedule\n      firstDayOnSite\n      hoursPerWeek\n      image\n      jobId\n      jobPreviewVideo\n      language\n      postalCode\n      priorityRank\n      scheduleBannerText\n      scheduleId\n      scheduleText\n      scheduleType\n      signOnBonus\n      state\n      surgePay\n      tagLine\n      geoClusterId\n      geoClusterName\n      siteId\n      scheduleBusinessCategory\n      totalPayRate\n      financeWeekStartDate\n      laborDemandAvailableCount\n      scheduleBusinessCategoryL10N\n      firstDayOnSiteL10N\n      financeWeekStartDateL10N\n      scheduleTypeL10N\n      employmentTypeL10N\n      basePayL10N\n      signOnBonusL10N\n      totalPayRateL10N\n      distanceL10N\n      requiredLanguage\n      monthlyBasePay\n      monthlyBasePayL10N\n      vendorKamName\n      vendorId\n      vendorName\n      kamPhone\n      kamCorrespondenceEmail\n      kamStreet\n      kamCity\n      kamDistrict\n      kamState\n      kamCountry\n      kamPostalCode\n      __typename\n    }\n    __typename\n  }\n}\n"
        };

        try {
            const response = await axios.post(url, payloadCA, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 8zeVcJNsa09ybN7j9gn7FLFlhSgpkDNzNUEqo6QL28D==' // Replace with your actual token
                }
            });

            const scheduleData = response.data.data?.searchScheduleCards?.scheduleCards;
            // console.log(scheduleData);

            if (!scheduleData || scheduleData.length === 0) {
                console.log(`No schedules found for Job ID ${jobId}.`);
           
            }

            const scheduleDetails = scheduleData.map(schedule => ({
                scheduleId: schedule.scheduleId,
                jobId: schedule.jobId,
                hireStartDate: schedule.hireStartDate,
                totalPayRate: schedule.totalPayRate,
            }));

            allSchedules.push(...scheduleDetails);

        } catch (error) {
            console.error(`Error fetching schedules for Job ID ${jobId}:`, error.response?.data || error.message);
        }

    console.log(allSchedules)
    return allSchedules;
};

module.exports = fetchSchedules;
