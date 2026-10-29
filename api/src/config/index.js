const config = {
  IsLocal: process.env.NODE_ENV === "local",
  IsProd: process.env.NODE_ENV === "prod",

  port: parseInt(process.env.PORT, 10) || 3000,
  dbConnectionUrl: process.env.DB_CONNECTION_URL,
  uploadServerIp: process.env.UPLOAD_SERVER_IP_ADD,

  appBaseUrl:
    process.env.NODE_ENV !== "prod"
      ? `http://localhost:${3000}`
      : `http://15.206.68.199:5635`,

  localUploadBaseUrl: function () {
    return `${process.env.LOCAL_UPLOAD_SERVER_IP_ADD}`;
  },

  prodUploadBaseUrl: function () {
    return "http://13.201.145.228:8505/";
  },
  forgetPassExpTime: process.env.FORGET_PASS_EXP_TIME || 30,
  resetPassword:
    process.env.NODE_ENV == "local"
      ? process.env.APPLICATION_API_BASE_URL + `/user/reset-password`
      : `http://localhost:${
          parseInt(process.env.PORT, 10) || 3003
        }/user/reset-password`,
  otpLoginExpDuration: 100000000,
  database: {
    host: process.env.DB_HOSTNAME,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  jwt: {
    expDuration: process.env.JWT_TIME,
    secretKey: process.env.JWT_SECREATE_kEY,
  },
  crypto: {
    algorithm: "aes-256-ctr",
    encryptionKey: Buffer.from(
      "FoCKvdLslUuB2x3EZlKate7XGottHski1LmyqJHvUht=",
      "base64"
    ),
    ivLength: 16,
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "info",
  },

cloudinary :{
  name : process.env.CLAUDINARY_NAME,
  key: process.env.CLAUDINARY_API_KEY ,
  secret:process.env.CLAUDINARY_API_SECRET
},
  


  TempFileDir: `${__dirname}/../../${process.env.TEMP_UPLOAD_DIR}`,
  logDir: process.env.LOG_DIR,

  WebUrl: process.env.WEB_URL || null,
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  awss3: {
    region: process.env.AWS_S3_REGION || "ap-south-1",
    accessKey: process.env.AWS_S3_ACCESSKEY,
    secretKey: process.env.AWS_S3_SECRET_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    uploadDirName: process.env.AWS_S3_UPLOAD_DIR_NAME || "",
  },
  googleCreds: {
    projectId: process.env.GCLOUD_PROJECT_ID,
    serviceAccountCreds: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  stripeCreds: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  },

  workable: {
    jobList: process.env.WORKABLE_JOB_LIST_API,
    accessToken: process.env.WORKABLE_TOKEN,
  },

  whatsapp: {
    apiVersion: process.env.WHATSAPP_API_VERSION,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    businessPhoneNumber: process.env.WHATSAPP_BUSINESS_PHONE_NUMBER,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  },

  nodemailer: {
    nodemailerPasscode: process.env.NODEMAILER_PASSCODE,
    nodemailerEmail: process.env.NODEMAILER_EMAIL,
    nodemailerSecurityEmail: process.env.NODEMAILER_SECURITY_EMAIL
  },

  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
    audienceId: process.env.MAILCHIMP_AUDIENCE_ID,
    tag: process.env.MAILCHIMP_TAG || "CISPF Website Newsletter",
    // The form's consent checkbox subscribes people directly; set "true" to send Mailchimp's confirmation email first.
    doubleOptIn: process.env.MAILCHIMP_DOUBLE_OPT_IN === "true",
  }
};

module.exports = config;
