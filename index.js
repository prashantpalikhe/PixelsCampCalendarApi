let cors = require('cors');

let express = require('express');
let app = express();
let router = express.Router();
let generateDaySchedule = require('./dayScheduleGenerator');
let httpRequest = require('./httpRequest');

const PIXELS_CAMP_CALENDAR_API = 'https://api.pixels.camp/calendar/cal.ics';
const VALID_DAYS = [1, 2, 3];

app
    .use(cors())
    .use('/api', router)
    .listen(3001, () => console.log('Listening on port 3001'));

router
    .route('/calendar/:day')
    .get(function(req, res) {
        if (!VALID_DAYS.includes(parseInt(req.params.day, 10))) {
            res.sendStatus(400);

        } else {
            httpRequest(PIXELS_CAMP_CALENDAR_API)
                .then((schedule) => generateDaySchedule(schedule, req.params.day))
                .then((daySchedule) => res.json(daySchedule))
                .catch(() => res.sendStatus(500));
        }
    });
