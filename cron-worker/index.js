const CronJob = require('cron').CronJob;

const fetchArxiv = require('./fetch-arxiv.js')

var job = new CronJob('30 3 * * * *', fetchArxiv, null, true, 'America/New_York');
job.start();