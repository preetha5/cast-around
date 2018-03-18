'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://house-hunter-01:demo@ds263138.mlab.com:63138/cast-around-dev';
// exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
//                       'mongodb://localhost/test-restaurants-app';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
'mongodb://test_user:test@ds117489.mlab.com:17489/cast_around_test';
exports.PORT = process.env.PORT || 8080;