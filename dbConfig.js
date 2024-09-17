
// dbConfig.js
module.exports = {
  host: 'mysql.np.svc.cluster.local', // Replace with your MySQL host
  user: 'mysql', // Replace with your MySQL username
  password: 'mysql_p@ssw0rd', // Replace with your MySQL password
  database: 'sampledb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};