'use strict';

var command = module.exports;

var AWS = require('aws-sdk');
var DOC = require("dynamodb-doc");

var db = new AWS.DynamoDB({region: 'ap-northeast-1'});
var docClient = new DOC.DynamoDB(db);

command.execute = function (tableName, whereList, fieldList, indexName) {

    var params = {};
    params.TableName = tableName;
    params.KeyConditions = whereList;

    docClient.query(params, function (err, data) {
        if (err) {
            throw new Error('Code = ' + err.code + ' Message = ' + err.message);
        } else {
            displayAll(data, fieldList);
        }
    });
};

function displayAll(data, fieldList) {

    if (!data.Items) {
        return true;
    }

    var len = data.Items.length;
    for (var i = 0; i < len; i++) {
        var item = data.Items[i];
        display(item, fieldList);
    }
}

function display(item, fieldList) {
    var cols = [];

    fieldList.forEach(function (row) {
        var value = item[row];
        if (value === undefined || value === null) {
            value = '_'; // TODO
        }
        cols.push(value);
    });

    // output
    console.log(cols.join(" "));
}
