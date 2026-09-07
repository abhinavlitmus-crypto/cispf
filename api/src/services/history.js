const { Types } = require("mongoose");
const historyModel = require("../models/editHistory");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");

class historyService {
  // Author service :
//   static async details(_id) {
//     const response = { data: {}, status: false };
//     try {
//       _id = Types.ObjectId(_id);
//       response.data = await historyModel.findOne({
//         _id: _id,
//         isDeleted: false,
//       });
//       response.status = true;
//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }

 static async list(query = {}) {
  const $extra = {
    page: query.page,
    limit: query.limit,
    isAll: query.isAll,
  };

  let response = { data: [], extra: { ...$extra }, status: true };

  try {
    const search = {
      _id: query._id ? Types.ObjectId(query._id) : "",
      ...(query.editedBy ? { editedBy: Types.ObjectId(query.editedBy) } : {}),
      ...(query.tableName ? { tableName: query.tableName } : {}),
      ...(query.docId ? { docId: Types.ObjectId(query.docId) } : {}), // ✅ FIX
      isDeleted: false,
    };
    clearSearch(search);
    const $aggregate = [
  { $match: search },

  {
    $lookup: {
      from: "admins",          // ✅ collection name in Compass
      localField: "editedBy",
      foreignField: "_id",
      as: "editedByDetails",   // ✅ correct joined field name
    },
  },
  {
    $unwind: {
      path: "$editedByDetails", // ✅ must match "as"
      preserveNullAndEmptyArrays: true,
    },
  },

  { $sort: { createdAt: -1 } },

  {
    $project: {
      editedBy: 1,
      tableName: 1,
      oldData: 1,
      newData: 1,
      status: 1,
      docId: 1,
      createdAt: 1,

      editedByDetails: 1, // ✅ will contain admin doc now
    },
  },
];


    $aggregate.push({ $sort: { createdAt: -1 } });

    $aggregate.push({
      $project: {
        editedBy: 1,
        tableName: 1,
        oldData: 1,
        newData: 1,
        status: 1,
        docId:1,
        createdAt: 1,

        editedByDetails: 1,
      },
    });

    response = await paginationAggregate(historyModel, $aggregate, $extra);
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
    
      const docData =  new historyModel();
        docData.editedBy = data.editedBy
      docData.newData = data.changes.newData;
      docData.oldData= data.changes.oldData;
      docData.tableName = data.tableName;
       docData.docId = data.docId;
      docData.status = data.status !== undefined ? data.status : true;


      await docData.save();
      response.data = docData;
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

//   static async delete(ids) {
//     const response = { status: false, ids: [] };
//     try {
//       console.log("idfs from nbackend",ids)
//       if (Array.isArray(ids)) {
//         await historyModel.updateMany(
//           { $or: [{ _id: { $in: ids } }] },
//           { isDeleted: true }
//         );
//       } else if (typeof ids === "string") {
//         await historyModel.updateOne({ _id: ids }, { isDeleted: true });
//         response.id = ids;
//       }
//       response.status = true;
//       response.id = ids;

//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }
}

module.exports = historyService;
