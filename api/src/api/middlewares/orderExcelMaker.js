
const fastcsv = require('fast-csv');
const fs = require("fs");
const path = require("path");
const orderService = require("../../services/order");
const { Types } = require("mongoose");
const { validate } = require('../../models/orderDetail');
const moment = require("moment");

function orderExcelMaker(req, res, next) {

    async function handleBulkExport() {
        try {

            const rawData = await orderService.downloadCSV(req.query);
            const data = []
              rawData.data?.forEach(val=>{
                  val?.orderDetails.forEach(vv=>{
                      data.push(
                          {
                      orderId: val?.orderId,
                      "Customer Name": val?.userDetails?.username ? val?.userDetails?.username : "None",
                      Phone: val?.userDetails?.phone ? val?.userDetails?.phone : "None",
                      Email: val?.userDetails?.email ? val?.userDetails?.email : "None",
                      Address: val?.addressDetails ? JSON.parse(val?.addressDetails)?.address + JSON.parse(val?.addressDetails)?.state + JSON.parse(val?.addressDetails)?.pin : "None",
                      "Order Total": val?.priceDetails?.price ? val?.priceDetails?.price : "None",
                      DiscountPrice: val?.priceDetails?.discountPrice ? val?.priceDetails?.price : "None",
                      "Final Price": val?.priceDetails?.finalPrice ? val?.priceDetails?.finalPrice : "None",
                      "Product Name": vv?.name || "None",
                      Quantity: vv.quantity || "None",
                      "Product Price": vv.price || "None",
                      Date: val?.createdAt ?  moment( val?.createdAt).format("dddd, MMMM Do YYYY") : "None",
                      })
                  })
              })
              // Convert data to CSV format
              const csvStream = fastcsv.format({ headers: true });
              const fileName = Date.now() + '' + Math.random() + '.' + 'csv';
              const tempFilePath = path.join(__dirname, '..', '..', '..', 'public', fileName);
              csvStream.pipe(fs.createWriteStream(tempFilePath)); // Change the path as needed

              // Write data to CSV file
              data?.forEach(row => csvStream.write(row));
              csvStream.end();

              req.body.filename = fileName
            req.body.rawData = rawData;
            next();

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    handleBulkExport();
}

module.exports = {
    orderExcelMaker
};
