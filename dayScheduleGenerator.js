let moment = require('moment');
let forEach = require('lodash/forEach');
let parser = require('ical-parser');
let filter = require('lodash/filter');
let groupBy = require('lodash/groupBy');
let orderBy = require('lodash/orderBy');

const DAYS = {
    1: '20161006',
    2: '20161007',
    3: '20161008'
};

const EVENT_TIME_KEY = 'DTSTART;TZID=Europe/Lisbon';
const SPEAKER_REGEX = /\[speaker: (.*)\\\,/;
const TIME_FORMAT = 'HH:mm';

/**
 * Given a full ics schedule, returns a promise for JSON schedule for the given day.
 *
 * @param schedule
 * @param day
 * @returns {Promise}
 */
function generateDaySchedule(schedule, day) {
    return new Promise((resolve, reject) => {
        day = DAYS[day];

        if (!day) {
            reject('Invalid day');
        }

        parser.convert(schedule, function(err, jsonData) {
            if (err) {
                return reject(err);
            }

            let schedule = {};
            let allEvents = jsonData.VCALENDAR[0].VEVENT;
            let filteredEvents = filter(allEvents, event => ~(event[EVENT_TIME_KEY].indexOf(day)));
            let orderedEvents = orderBy(filteredEvents, [EVENT_TIME_KEY]);
            let eventGroups = groupBy(orderedEvents, EVENT_TIME_KEY);

            forEach(eventGroups, function(eventGroup, key) {
                let events = [];
                let time = moment(key).format(TIME_FORMAT);

                forEach(eventGroup, function(event) {
                    events.push({
                        summary: event.SUMMARY,
                        location: event.LOCATION,
                        speaker: getSpeaker(event)
                    });
                });

                schedule[time] = events;
            });

            resolve(schedule);
        });
    });
}

/**
 * Gets speaker for given event. Empty string if cannot find the speaker.
 *
 * @param event
 * @returns {string}
 */
function getSpeaker(event) {
    let description = event.DESCRIPTION;
    let speaker = '';

    if (description) {
        let regex = new RegExp(SPEAKER_REGEX);
        let matches = regex.exec(description);

        if (Array.isArray(matches)) {
            speaker = matches[1];
        }
    }

    return speaker;
}

module.exports = generateDaySchedule;