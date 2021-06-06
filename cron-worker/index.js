const CronJob = require('cron').CronJob;

const fetchArxiv = require('./fetch-arxiv.js')

var job = new CronJob('0 0 * * 0', fetchArxiv, null, true, 'America/New_York'); // call fetchArxiv at 00:00 every Sunday.
job.start();
