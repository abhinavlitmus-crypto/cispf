const crypto = require('crypto');
const sendGridMail = require('@sendgrid/mail');
const Logger = require('./Logger');
const mime = require('mime');
const fs = require('fs');
const config = require('../config');
const path = require('path');
const fileModel = require('../models/file');
const moment = require('moment');
const referralCodeGenerator = require('referral-code-generator');

// sendGridMail.setApiKey(config.sendGrid.apiKey);

function clearSearch(obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object") {
            clearSearch(value);
        } else {
            if (typeof value === 'undefined' || (typeof value === 'string' && value.length < 1)) {
                delete (obj[key]);
            }
        }
    }
}

function calculateDiscountPercentage(mrp, sellingPrice) {
    const discount = ((mrp - sellingPrice) / mrp) * 100;
    return Math.round(discount * 100) / 100 + " %"; // rounding to 2 decimal places
}

const getFullReadAccess = () => {
    return ["MEET_READ", "CALENDAR_READ"]
}
const getFullWriteAccess = () => {
    return ["MEET_WRITE", "CALENDAR_WRITE"]
}
const getFullAccess = () => {
    return ["MEET_WRITE", "MEET_READ", "CALENDAR_WRITE", "CALENDAR_READ"]
}
const extractRTOCode = (vehicleNumber) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleanedNumber = vehicleNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Regular expression to match the RTO code
    const match = cleanedNumber.match(/^[A-Z]{2}\d{1,2}/);

    if (match) {
        const rtoCode = match[0].replace(/^([A-Z]{2})0?(\d{1,2})$/, '$1$2'); // Remove leading zero if present
        return rtoCode.length > 2 ? rtoCode.slice(0, 2) + '-' + rtoCode.slice(2) : rtoCode; // Add hyphen after first two characters
    }

    return null; // Return null if the format doesn't match
};

function decodeBase64(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');

    return response;
}

async function uploadFileBase64(req, res, next) {

    const decodedImg = decodeBase64(req.body.file);
    const buffer = decodedImg.data;
    const type = decodedImg.type;
    const extension = mime.getExtension(type);
    const fileName = Date.now() + '' + Math.random() + '.' + extension;
    const filePath = path.join(__dirname, '..', '..', 'public', fileName);
    try {
        try {
            await fs.writeFileSync(filePath, buffer, 'utf8');
            req.file = { filename: fileName };
        } catch (e) {
            throw new Error(e);
        }
        next();
        // return fileName;
    } catch (err) {
        throw new Error(err);
    }
}

async function uploadMultipleFile(dataBase64Array, path, model, key, _id, deletingFiles) {
    const fileNames = await deleteMultipleFiles(path, model, key, _id, deletingFiles);
    if (Array.isArray(dataBase64Array) && dataBase64Array.length > 0) {
        const prms = dataBase64Array.map(async (v) => {
            return uploadFileBase64(v, path, model);
        });

        if (prms.length > 0) {
            return Promise.all(prms).then(res => {
                res.forEach(v => {
                    fileNames.push(v);
                })
                return fileNames;
            });
        }
    } else {
        return fileNames;
    }
}

async function deleteMultipleFiles(path, model, key, _id, deletingFiles) {
    let tpl, fileNames = [];

    if (_id) {
        tpl = await model.findById(_id);
        fileNames = tpl[key]?.filter(v => !deletingFiles?.includes(v));
    }

    if (_id && Array.isArray(deletingFiles) && deletingFiles.length > 0) {
        try {
            deletingFiles.map(v => {
                fs.unlink(path + v, () => { });
            });

        } catch (err) {

        }
    }
    return fileNames;
}

function encryptData(text) {
    let iv = crypto.randomBytes(config.crypto.ivLength);
    let cipher = crypto.createCipheriv(config.crypto.algorithm, Buffer.from(config.crypto.encryptionKey, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptData(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(config.crypto.algorithm, Buffer.from(config.crypto.encryptionKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

async function mailer(to, subject, html) {

    const mailOptions = {
        to,
        from: config.sendGrid.senderEmail,
        subject,
        html,
    };


    return new Promise(async (resolve, reject) => {
        try {
            const info = await sendGridMail.send(mailOptions);
            resolve(info);
        } catch (error) {
            Logger.error(
                `
                    Error while sending mail
                    To   			- ${to}
                    Subject   		- ${subject}
                    Reason   	    - ${error.message}
                `
            );
            reject(error);
        }
    })
}

function genFileUrl(fileName) {
    return config.localUploadBaseUrl() + "/" + fileName;
}
function genProdFileUrl(fileName) {
    return config.prodUploadBaseUrl() + "/" + fileName;
}
async function removeFile(fileName) {
    try {
        // const fileName = (await fileModel.findOne({ uid })).name;
        fs.unlink(path.join(__dirname, '..', '..', 'public', fileName), () => { });
        return true;
    } catch (err) {
        return false;
    }
}
async function genFileUrlFromId(fileId) {
    try {
        return config.localUploadBaseUrl() + "/" + (await fileModel.findById(fileId)).name;
    } catch (error) {
        return false;
    }
}

function hoursAndMinuteDiff(startingDate, endingDate = new Date()) {
    const milliSeconds = new Date(endingDate) - new Date(startingDate);
    let hours = parseInt(milliSeconds / 3600 / 1000);
    let seconds = parseInt((milliSeconds % (3600 * 1000)) / 1000 / 60);
    hours = hours === 0 ? "00" : (hours <= 9 ? "0" + hours : hours);
    seconds = seconds === 0 ? "00" : (seconds <= 9 ? "0" + seconds : seconds);
    return hours + ":" + seconds;
}

function convertMinutesToHoursAndMinutes(minutes) {
    let hours = parseInt(minutes / 60);
    let seconds = parseInt((minutes % (60)));
    hours = hours === 0 ? "00" : (hours <= 9 ? "0" + hours : hours);
    seconds = seconds === 0 ? "00" : (seconds <= 9 ? "0" + seconds : seconds);
    return hours + ":" + seconds;
}

function startEndDate(prms = 'today') {
    let startDate = moment().format('YYYY-MM-DD');
    let endDate = moment(startDate).add(1, 'days');
    return { startDate, endDate };
}

function genRandomNumber(otp_length) {
    let OTP = "";
    const digits = "0123456789";
    for (let i = 0; i < otp_length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}




function generatorReferralCode(text) {
    return referralCodeGenerator.alphaNumeric('uppercase', 3, 3, text);
}

function getDateWithoutTime(d = new Date) {
    return new Date(moment(new Date(d)).format('LL'));
}

function removeTimeFromDate(date) {
    const onlyDate = date.toISOString().split('T')?.[0];
    return new Date(onlyDate).getTime();
}

function convertGroupDateObjectToArray(data) {
    const result = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const yearMonth = key;
            const items = data[key];
            result.push({
                date: yearMonth,
                data: items
            });
        }
    }
    return result;
}
function groupByDateRange(data, dateField) {
    const today = new Date();
    let finalList = [];
    const groups = {};

    for (const item of data) {
        const itemDate = new Date(item[dateField]);
        //   This month and year are respective to createdAt date:
        const year = itemDate.getFullYear();
        const month = itemDate.getMonth();

        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();

        // Calculate relative date ranges
        const yesterdayRepectiveToToday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
        const lastWeekRepectiveToToday = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
        const lastMonthRepectiveToToday = new Date(todayYear, todayMonth - 1, 1);

        let groupKey;
        if (removeTimeFromDate(itemDate) === removeTimeFromDate(today)) {
            groupKey = "Today";
        } else if (removeTimeFromDate(itemDate) === removeTimeFromDate(yesterdayRepectiveToToday)) {
            groupKey = "Yesterday";
        } else if (removeTimeFromDate(itemDate) >= removeTimeFromDate(lastWeekRepectiveToToday) && removeTimeFromDate(itemDate) <= removeTimeFromDate(today)) {
            groupKey = "Last Week";
        } else if (itemDate.getMonth() === lastMonthRepectiveToToday.getMonth() && itemDate.getFullYear() === lastMonthRepectiveToToday.getFullYear()) {
            groupKey = "Last Month";
        } else {
            groupKey = `${year}-${month + 1}`; // format as YYYY-MM
        }

        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
    }
    return convertGroupDateObjectToArray(groups);
}

function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function kmToMeters(distanceInKms) {
    let result = Number(distanceInKms) * 1000;
    return result;
}

function removeSpecialChars(key) {
    return key
        ?.trim()
        .toLowerCase()
        ?.replace(/[^a-z0-9 _-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function changeBucketUrl(data) {
    if (typeof data == 'string' && data.includes('https://arramton-s3-bucket.s3.ap-south-1.amazonaws.com/')) {
        return data.replace('https://arramton-s3-bucket.s3.ap-south-1.amazonaws.com/', 'https://cache.arramton.com/');
    } else if (data && Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = changeBucketUrl(data[i]);
        }
    } else if (data && typeof data == 'object') {
        for (const [key, value] of Object.entries(data)) {
            data[key] = changeBucketUrl(value);
        }
    }
    return data;
}

function extractPartNumberInfo(text, searchTerm, searchTerm2) {
    const lowerText = text.toLowerCase();
    let index = lowerText.indexOf(searchTerm);
    if(index === -1){
        index = lowerText.indexOf(searchTerm2);
    }
    // Extract everything after "part number" if found
    const partNumberText = index !== -1 ? text.slice(index + searchTerm.length).trim() : text;

    // Regex to extract alphanumeric strings
    const alphanumericMatch = partNumberText.match(/\b(?=\w*\d)(?=\w*[A-Za-z])[A-Za-z0-9]+\b/g);
    return alphanumericMatch ? alphanumericMatch.join(',') : null; // Return alphanumeric part
};
module.exports = {
    clearSearch, decodeBase64, uploadFileBase64, uploadMultipleFile, deleteMultipleFiles, encryptData, decryptData, mailer, changeBucketUrl,
    genFileUrl, genFileUrlFromId, hoursAndMinuteDiff, startEndDate, convertMinutesToHoursAndMinutes, genRandomNumber, removeFile, generatorReferralCode, genProdFileUrl, getDateWithoutTime, groupByDateRange, addDays, kmToMeters, removeSpecialChars, getFullAccess, getFullReadAccess, getFullWriteAccess, calculateDiscountPercentage, extractPartNumberInfo
}
