/**
 * Parse seconds to days, hours, minutes, seconds string
 * @param {string|number} seconds
 */
module.exports.parseSeconds = seconds => {
  seconds = parseInt(seconds, 10);
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  const hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  const mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;

  return `${days} days, ${hrs} hours, ${mnts} minutes, ${seconds} seconds`;
};

/**
 * Set up logger
 * @param {boolean} verbose
 */
module.exports.logger = verbose => (...args) => verbose && console.log(...args);
