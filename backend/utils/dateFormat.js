function dateFormat(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0'); // 07
  const month = d.toLocaleString('en-GB', { month: 'short' }); // Jan
  const year = d.getFullYear(); // 2026
  return `${day} ${month} ${year}`;
}

module.exports=dateFormat;