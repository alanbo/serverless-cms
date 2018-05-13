module.exports = () => {
  const currentDatePlusYear = new Date();
  return currentDatePlusYear.setFullYear(currentDatePlusYear.getFullYear() + 1) - 86400000;
}