export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  zk: {
    ip: process.env.ZK_IP,
    port: parseInt(process.env.ZK_PORT || '4370', 10),
    timeout: parseInt(process.env.ZK_TIMEOUT || '5000', 10),
    inport: parseInt(process.env.ZK_INPORT || '5200', 10),
  },
});
