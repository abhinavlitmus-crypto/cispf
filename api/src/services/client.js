const { Types } = require("mongoose");
const clientModel = require("../models/client");
const { paginationAggregate } = require("../utilities/pagination");
const { clearSearch } = require("../utilities/Helper");
const { getChanges } = require("../utilities/getChanges");
const historyService = require("./history");
class clientService {
  // Author service :
  static async details(_id) {
    const response = { data: {}, status: false };
    try {
      _id = Types.ObjectId(_id);
      response.data = await clientModel.findOne({ _id: _id, isDeleted: false });
      response.status = true;
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async list(query = {}) {
    const $extra = { page: query.page, limit: query.limit, isAll: query.isAll };
    let response = { data: [], extra: { ...$extra }, status: false };
                 const searchId  = query.key?.split('-')[1] || "";
    try {
    // console.log("query in service",query);
      const search = {
        _id: query._id ? Types.ObjectId(query._id) : "",
        ...(query.key ? {
          $or: [
            { clientName: { $regex: new RegExp(query.key || ""), $options: "i" } },
            { location: { $regex: new RegExp(query.key || ""), $options: "i" } },
            {_id: Types.ObjectId(searchId)}
          ],
        } : []),
        isDeleted: false,
      };


      clearSearch(search);
     
     if(query.cType === "COUNSELLORS/ORW"){
      search.createdBy = Types.ObjectId( query.cId);
     }

    if(query.status){
      search.status = query.status? true : false;
    }
      const $aggregate = [
        { $match: search },

        { $sort: { createdAt: -1 } }, // alphabetical order
        {
          $project: {
            outreachDate: 1,
            location: 1,
            typeOfOutreach: 1,
            referralBy: 1,
            state: 1,
            city: 1,
            clientName: 1,
            gender: 1,
            age: 1,
            topology: 1,
            notes: 1,
            status: 1,
            updatedAt: 1
          },
        },
      ];

      response = await paginationAggregate(clientModel, $aggregate, $extra);
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
      const docData = _id ? await clientModel.findById(_id) : new clientModel();

      const oldData = docData.toObject()

      docData.outreachDate = data.outreachDate;
      docData.location = data.location;
      docData.typeOfOutreach = data.typeOfOutreach;
      docData.referralBy = data.referralBy;
      docData.clientName = data.clientName;
      docData.gender = data.gender;
      docData.age = data.age;
      docData.topology = data.topology;
      docData.notes = data.notes;
      docData.state = data.state;
      docData.city = data.city;
      if(!data._id) {
        docData.createdBy = data.cid._id;
      }

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
          tableName: "clientDetails",
          docId:docData._id,
          status: true,
        });

      }

      response.data = docData;
      response.status = true;
      return response;
    } catch (err) {
      console.log("error", err)
      throw err;
    }
  }

  static async delete(ids) {
    const response = { status: false, ids: [] };
    try {
      if (Array.isArray(ids)) {
        await clientModel.updateMany(
          { $or: [{ _id: { $in: ids } }] },
          { isDeleted: true }
        );
      } else if (typeof ids === "string") {
        await clientModel.updateOne({ _id: ids }, { isDeleted: true });
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

module.exports = clientService;
