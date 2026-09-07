const { Types } = require("mongoose");
const documentModel = require("../models/documents");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const { getChanges } = require("../utilities/getChanges");
const historyService = require("./history");

class documentService {
  // Author service :
  static async details(_id) {
    const response = { data: {}, status: false };
    try {
      _id = Types.ObjectId(_id);
      response.data = await documentModel.findOne({
        _id: _id,
        isDeleted: false,
      });
      response.status = true;
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async list(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: true };

    try {
      const search = {
        _id: query._id ? Types.ObjectId(query._id) : "",
        docName: query.key
          ? { $regex: new RegExp(query.key || ""), $options: "i" }
          : "",
        isDeleted: false,
      };

      clearSearch(search);

      const $aggregate = [
        { $match: search },

        {
          $project: {
            docName: 1,
            Url: 1,
          },
        },
      ];

      response = await paginationAggregate(documentModel, $aggregate, $extra);
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
      const docData = _id
        ? await documentModel.findById(_id)
        : new documentModel();
      
      const oldData = docData.toObject()


      docData.docName = data.docName;
      docData.Url = data.Url;

      docData.status = data.status !== undefined ? data.status : true;

      // docData.status = data.status ? data.status : true;

      await docData.save();

      const changes = getChanges(oldData, docData.toObject())
            if ( _id &&
             ( Object.keys(changes.newData).length > 0 ||
              Object.keys(changes.oldData).length > 0)
            ) {
      
              const res = await historyService.save({
                changes,
                editedBy: data?.cid?._id,
                tableName: "documentDetails",
                docId:docData._id,
                status: true,
              });
      
            }
      

      response.data = docData;
      response.status = true;
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async delete(ids) {
    const response = { status: false, ids: [] };
    try {
      if (Array.isArray(ids)) {
        await documentModel.updateMany(
          { $or: [{ _id: { $in: ids } }] },
          { isDeleted: true }
        );
      } else if (typeof ids === "string") {
        await documentModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = documentService;
