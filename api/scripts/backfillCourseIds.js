require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const courseModel = require('../src/models/course');

async function run() {
    await mongoose.connect(config.dbConnectionUrl);

    const courses = await courseModel.find({});
    let updatedCourses = 0;

    for (const course of courses) {
        // Hydration auto-generates in-memory _id's for any module/lesson
        // that doesn't have one stored yet (schema used to disable _id on
        // these subdocuments). markModified forces mongoose to persist
        // those generated ids instead of discarding them.
        course.markModified('modules');
        await course.save();
        updatedCourses += 1;
    }

    console.log(`Done. ${updatedCourses}/${courses.length} course(s) re-saved with stable module/lesson ids.`);
    await mongoose.disconnect();
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
