const { Types } = require("mongoose");
const punchModel = require("../models/punch");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const client = require("../models/client");
const user = require("../models/user");

class punchService {
  // Author service 
  static async details(_id) {
    const response = { data: {}, status: false };
    try {
      _id = Types.ObjectId(_id);
      response.data = await punchModel.findOne({ _id: _id, isDeleted: false });
      response.status = true;
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async list(query = {}) {
    const $extra = {
      page: query.page,
      limit: query.limit,
      isAll: query.isAll,
      // date: query.selected,
    };
    console.log("query in the punch list service", query);
    let response = { data: [], extra: { ...$extra }, status: false };

    try {
      const search = { isDeleted: false };

      if (query._id) {
        search._id = Types.ObjectId(query._id);
      }
      if (query.selected) {
        const selectedDate = new Date(query.selected);

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        search.date = {
          $gte: startOfDay,
          $lt: endOfDay,
        };
      }


      clearSearch(search);

      const $aggregate = [
        { $match: search },

        // ✅ JOIN admins using clientId -> admins._id
        {
          $lookup: {
            from: "admins",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },

        // ✅ flatten userDetails
        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "userDetails.userType": { $ne: "SuperAdmin" }
          },
        },

        // ✅ Search by admin name (or whatever field exists in admins)
        ...(query.key
          ? [
            {
              $match: {
                "userDetails.name": { $regex: new RegExp(query.key, "i") },
              },
            },
          ]
          : []),

        // ✅ sort alphabetically by admin name
        {
          $sort: {
            "userDetails.name": 1,
          },
        },

        // ✅ final output
        {
          $project: {
            userId: 1,
            details: 1,
            date: 1,
            status: 1,
            userDetails: 1
          },
        },
      ];

      response = await paginationAggregate(punchModel, $aggregate, $extra);
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }



  static async save(data) {
    const response = { data: {}, status: false };
    try {
      const { userId, date, details } = data; // details = [{punchIn, punchOut}]

      let doc = await punchModel.findOne({ userId, date });

      if (doc) {
        // append all punch objects
        details.forEach(punch => {
          doc.details.push({
            punchIn: punch.punchIn,
            punchOut: punch.punchOut ?? null,
          });
        });
      } else {
        // create new doc
        doc = new punchModel({
          userId,
          date,
          details: details.map(punch => ({
            punchIn: punch.punchIn,
            punchOut: punch.punchOut ?? null,
          })),
          status: data.status !== undefined ? data.status : true,
        });
      }

      await doc.save();

      response.data = doc;
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }
  static async update(data) {
    const response = { data: {}, status: false };
    try {
      const { userId, date } = data;
     

      let Doc = await punchModel.findOne({ userId, date })

      if (!Doc) {
        throw new Error("No punch-in record found for today")
      }

      let updated = false;
      for (let i = Doc.details.length - 1; i >= 0; i--) {
        if (Doc.details[i].punchOut === null) {
          Doc.details[i].punchOut = new Date();
          updated = true;
          break;
        }
      }
      if (!updated) {
        throw new Error("No active punch-in session found");
      }

      await Doc.save();
      response.data = Doc;
      response.status = true;
      return response;
    } catch (error) {
      throw (error)
    }
    // try {
    //     const { userId, date, details } = data; // details = [{punchIn, punchOut}]

    //     let doc = await punchModel.findOne({ userId, date });

    //     if (doc) {
    //         // append all punch objects
    //         details.forEach(punch => {
    //             doc.details.push({
    //                 punchIn: punch.punchIn,
    //                 punchOut: punch.punchOut ?? null,
    //             });
    //         });
    //     } else {
    //         // create new doc
    //         doc = new punchModel({
    //             userId,
    //             date,
    //             details: details.map(punch => ({
    //                 punchIn: punch.punchIn,
    //                 punchOut: punch.punchOut ?? null,
    //             })),
    //             status: data.status !== undefined ? data.status : true,
    //         });
    //     }

    //     await doc.save();

    //     response.data = doc;
    //     response.status = true;
    //     return response;
    // } catch (err) {
    //     throw err;
    // }
  }



  static async delete(ids) {
    const response = { status: false, ids: [] };
    try {
      if (Array.isArray(ids)) {
        await punchModel.updateMany(
          { $or: [{ _id: { $in: ids } }] },
          { isDeleted: true }
        );
      } else if (typeof ids === "string") {
        await punchModel.updateOne({ _id: ids }, { isDeleted: true });
        response.id = ids;
      }
      response.status = true;
      response.id = ids;

      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = punchService;
