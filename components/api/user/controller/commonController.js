
var Timezone = require("./../../../../models/Timezone");
var UserDesignation = require("./../../../../models/UserDesignation");

const getAllTimezones = async (req, res) => {
    try {
        await Timezone.find({}, function (err, getData) {
            if (err) {
                res.json({ status: 404, message: 'No data found.', data: "" });
            } else {
                res.json({ status: 200, message: 'all timezones', data: getData });
            }
        });
    } catch (db_error) {
        res.json({ status: 400, message: db_error });
    }

};


const getAllDesignation = async (req, res) => {
    try {
        await UserDesignation.find({}, function (err, getData) {
            if (err) {
                res.json({ status: 404, message: 'No data found.', data: "" });
            } else {
                res.json({ status: 200, message: 'all designation', data: getData });
            }
        });
    } catch (db_error) {
        res.json({ status: 400, message: db_error });
    }

};




module.exports = {
    getAllTimezones,
    getAllDesignation
};



