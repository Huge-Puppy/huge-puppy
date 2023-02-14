// Parse the datetime string into a Date object
const parseTime = d3.timeParse('%Y-%m-%d');// %H:%M:%S');
// 2022-05-01 00:00:00+00:00,2022,6388.4
const stravaParseTime = d3.timeParse('%Y-%m-%d %H:%M:%S%Z');
