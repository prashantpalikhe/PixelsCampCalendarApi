let cors = require('cors');
let https = require('https');
let express = require('express');
let app = express();
let router = express.Router();
let generateDaySchedule = require('./dayScheduleGenerator');

const PIXELS_CAMP_CALENDAR_API = 'https://api.pixels.camp/calendar/cal.ics';

app
    .use(cors())
    .use('/api', router);

router
    .route('/calendar/:day')
    .get(function(req, res) {
        https
            .get(PIXELS_CAMP_CALENDAR_API, function(response) {
                let fullSchedule = '';

                response.on('data', function onDataReceived(data) {
                    fullSchedule += data;
                });

                response.on('end', function onAllDataReceived() {
                    generateDaySchedule(fullSchedule, req.params.day)
                        .then(daySchedule => res.json(daySchedule));
                });
            })
    });

app.listen(3001, () => console.log('Listening on port 3001'));