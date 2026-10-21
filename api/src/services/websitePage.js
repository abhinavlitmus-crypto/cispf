const { Types } = require("mongoose");
const websitePageModel = require("../models/websitePage");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");

const str = (v) => (typeof v === "string" ? v.trim() : "");

const arr = (v) => (Array.isArray(v) ? v : []);
const strArr = (v) => arr(v).filter((x) => typeof x === "string" && x);

// Keeps only the known fields per type so random keys can't end up in `details`
const CLEANERS = {
    EVENT: (details) => ({
        publishDate: details.publishDate || null,
        mainImage: str(details.mainImage),
        title: str(details.title),
        description: str(details.description),
        slug: str(details.slug),
        insideTitle: str(details.insideTitle),
        sections: arr(details.sections).map((s) => ({
            image: str(s?.image),
            date: s?.date || null,
            description: str(s?.description),
        })),
        featureImages: strArr(details.featureImages),
    }),
    POLICY_DISCUSSION: (details) => ({
        title: str(details.title),
        slug: str(details.slug),
        description: str(details.description),
        mainImage: str(details.mainImage),
        sections: arr(details.sections).map((s) => ({
            images: strArr(s?.images),
            date: s?.date || null,
            title: str(s?.title),
            authorName: str(s?.authorName),
            authorDesignation: str(s?.authorDesignation),
            mainImage: str(s?.mainImage),
            mainDescription: str(s?.mainDescription),
        })),
    }),
    TEAM: (details) => ({
        title: str(details.title),
        slug: str(details.slug),
        sections: arr(details.sections).map((s) => ({
            images: strArr(s?.images),
            name: str(s?.name),
            designation: str(s?.designation),
            description: str(s?.description),
        })),
    }),
};

function cleanDetails(type, details = {}) {
    const cleaner = CLEANERS[type];
    return cleaner ? cleaner(details || {}) : { ...details };
}

class websitePageService {
    static async details(_id) {
        const response = { data: {}, status: false };
        try {
            _id = Types.ObjectId(_id);
            response.data = await websitePageModel.findOne({ _id: _id, isDeleted: false });
            response.status = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Public website: one active page by type + slug
    static async detailsBySlug(type, slug) {
        const response = { data: {}, status: false };
        response.data = await websitePageModel.findOne({ type, "details.slug": slug, status: true, isDeleted: false });
        response.status = true;
        return response;
    }

    static async list(query = {}) {
        const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
        let response = { data: [], extra: { ...$extra }, status: false };
        try {
            const regex = query.key ? new RegExp(query.key, "i") : null;

            const search = {
                type: query.type,
                ...(regex ? { $or: [{ "details.title": regex }, { "details.slug": regex }] } : {}),
                isDeleted: false,
            };

            clearSearch(search);

            if (query.status !== undefined && query.status !== "") {
                search.status = query.status === true || query.status === "true";
            }

            const $aggregate = [
                { $match: search },
                { $sort: { "details.publishDate": -1, createdAt: -1 } },
                {
                    $project: {
                        type: 1,
                        details: 1,
                        status: 1,
                        updatedAt: 1,
                    },
                },
            ];

            response = await paginationAggregate(websitePageModel, $aggregate, $extra);
            response.status = true;
            return response;
        } catch (err) {
            throw err;
        }
    }

    static async save(data) {
        const _id = data._id;
        const response = { data: {}, status: false };
        try {
            const docData = _id ? await websitePageModel.findById(_id) : new websitePageModel();

            // type is fixed once the page is created
            if (!_id) docData.type = data.type;
            if (data.details !== undefined) {
                docData.details = cleanDetails(docData.type, data.details);
                docData.markModified("details");
            }
            docData.status = data.status !== undefined ? data.status : true;

            await docData.save();

            response.data = docData;
            response.status = true;
            return response;
        } catch (err) {
            console.log("error", err);
            throw err;
        }
    }

    static async delete(ids) {
        const response = { status: false, ids: [] };
        try {
            if (Array.isArray(ids)) {
                await websitePageModel.updateMany({ _id: { $in: ids } }, { isDeleted: true });
            } else if (typeof ids === "string") {
                await websitePageModel.updateOne({ _id: ids }, { isDeleted: true });
            }
            response.status = true;
            response.id = ids;
            return response;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = websitePageService;
