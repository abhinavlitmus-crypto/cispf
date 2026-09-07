const { Types } = require("mongoose");
const progressModel = require("../models/progress");
const courseModel = require("../models/course");

const COMPLETION_THRESHOLD = 90;

function buildProgressShape(course, progress) {
    const modules = (course.modules || []).map((module) => {
        const moduleProgress = progress?.modules?.find(
            (m) => String(m.moduleId) === String(module._id)
        );

        const lessons = (module.lessons || []).map((lesson) => {
            const lessonProgress = moduleProgress?.lessons?.find(
                (l) => String(l.lessonId) === String(lesson._id)
            );

            return {
                lessonId: lesson._id,
                title: lesson.title,
                duration: lesson.duration || 0,
                watchedSeconds: lessonProgress?.watchedSeconds || 0,
                watchedPercent: lessonProgress?.watchedPercent || 0,
                isCompleted: lessonProgress?.isCompleted || false,
                lastWatchedAt: lessonProgress?.lastWatchedAt || null,
            };
        });

        return {
            moduleId: module._id,
            title: module.title,
            completionPercent: moduleProgress?.completionPercent || 0,
            isCompleted: moduleProgress?.isCompleted || false,
            lessons,
        };
    });

    return {
        courseId: course._id,
        title: course.title,
        thumbNail: course.thumbNail,
        completionPercent: progress?.completionPercent || 0,
        isCompleted: progress?.isCompleted || false,
        modules,
    };
}

class progressService {
    static async updateLessonProgress({ userId, courseId, moduleId, lessonId, watchedSeconds, markCompleted }) {
        const response = { data: {}, status: false };
        try {
            const course = await courseModel.findOne({ _id: courseId, isDeleted: false });
            if (!course) {
                throw new Error("Course not found");
            }

            const module = course.modules.id(moduleId);
            if (!module) {
                throw new Error("Module not found");
            }

            const lesson = module.lessons.id(lessonId);
            if (!lesson) {
                throw new Error("Lesson not found");
            }

            let progress = await progressModel.findOne({ userId, courseId });
            if (!progress) {
                progress = new progressModel({ userId, courseId, modules: [] });
            }

            let moduleProgress = progress.modules.find(
                (m) => String(m.moduleId) === String(moduleId)
            );
            if (!moduleProgress) {
                moduleProgress = { moduleId, lessons: [], completionPercent: 0, isCompleted: false };
                progress.modules.push(moduleProgress);
                moduleProgress = progress.modules[progress.modules.length - 1];
            }

            let lessonProgress = moduleProgress.lessons.find(
                (l) => String(l.lessonId) === String(lessonId)
            );
            if (!lessonProgress) {
                moduleProgress.lessons.push({ lessonId });
                lessonProgress = moduleProgress.lessons[moduleProgress.lessons.length - 1];
            }

            const duration = lesson.duration || 0;
            let cappedWatchedSeconds;
            let watchedPercent;

            if (markCompleted) {
                // explicit "mark as completed" override: always 100%, regardless
                // of how much of the video was actually watched.
                cappedWatchedSeconds = duration || Math.max(watchedSeconds || 0, lessonProgress.watchedSeconds || 0);
                watchedPercent = 100;
            } else {
                cappedWatchedSeconds = duration ? Math.min(watchedSeconds, duration) : watchedSeconds;
                watchedPercent = duration
                    ? Math.min(100, Math.round((cappedWatchedSeconds / duration) * 100))
                    : 0;
            }

            lessonProgress.watchedSeconds = Math.max(lessonProgress.watchedSeconds || 0, cappedWatchedSeconds);
            lessonProgress.watchedPercent = Math.max(lessonProgress.watchedPercent || 0, watchedPercent);
            lessonProgress.isCompleted = markCompleted || lessonProgress.isCompleted || lessonProgress.watchedPercent >= COMPLETION_THRESHOLD;
            lessonProgress.lastWatchedAt = new Date();

            // recompute module completion (count-based)
            const totalLessonsInModule = module.lessons.length;
            const completedLessonsInModule = moduleProgress.lessons.filter((l) => l.isCompleted).length;
            moduleProgress.completionPercent = totalLessonsInModule
                ? Math.round((completedLessonsInModule / totalLessonsInModule) * 100)
                : 0;
            moduleProgress.isCompleted = moduleProgress.completionPercent === 100;

            const totalModules = course.modules.length;
            const sumModulePercent = course.modules.reduce((sum, m) => {
                const mProgress = progress.modules.find(
                    (mp) => String(mp.moduleId) === String(m._id)
                );
                return sum + (mProgress?.completionPercent || 0);
            }, 0);
            progress.completionPercent = totalModules
                ? Math.round(sumModulePercent / totalModules)
                : 0;
            progress.isCompleted = progress.completionPercent === 100;

            await progress.save();

            response.data = buildProgressShape(course, progress);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async getCourseProgress(userId, courseId) {
        const response = { data: {}, status: false };
        try {
            const course = await courseModel.findOne({ _id: courseId, isDeleted: false });
            if (!course) {
                return response;
            }
            const progress = await progressModel.findOne({ userId, courseId, isDeleted: false });

            response.data = buildProgressShape(course, progress);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async getUserProgress(userId) {
        const response = { data: [], status: false };
        try {
            const progressList = await progressModel.find({ userId, isDeleted: false });
            const courseIds = progressList.map((p) => p.courseId);
            const courses = await courseModel.find({ _id: { $in: courseIds }, isDeleted: false });

            response.data = progressList
                .map((progress) => {
                    const course = courses.find((c) => String(c._id) === String(progress.courseId));
                    if (!course) return null;
                    return buildProgressShape(course, progress);
                })
                .filter(Boolean);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = progressService;
