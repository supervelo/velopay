const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const DAY_IN_MONTH = 30;
const MONTH_IN_QUARTER = 3;
const QUARTER_IN_YEAR = 4;
/**
 *
 * @param {string} period
 * @returns the period value in seconds
 */
function getTimeStep(period) {
  switch (period) {
    case "second":
      return 1;
    case "minute":
      return SECONDS_IN_MINUTE;
    case "hour":
      return SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
    case "day":
      return SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;
    case "month":
      return SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAY_IN_MONTH;
    case "quarter":
      return (
        SECONDS_IN_MINUTE *
        MINUTES_IN_HOUR *
        HOURS_IN_DAY *
        DAY_IN_MONTH *
        MONTH_IN_QUARTER
      );
    case "year":
      return (
        SECONDS_IN_MINUTE *
        MINUTES_IN_HOUR *
        HOURS_IN_DAY *
        DAY_IN_MONTH *
        MONTH_IN_QUARTER *
        QUARTER_IN_YEAR
      );
    default:
      return 1;
  }
}
module.exports = { getTimeStep };
