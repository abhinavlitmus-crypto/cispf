const config = {
  env: process.env.REACT_APP_ENV || "local",
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:4500/admin/",
};

export default config;
