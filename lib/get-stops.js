'use strict';

const http = require('http');

const getStops = function(req, res, next) {
  if(!req) return next(new Error('no latLon on OBA request'));
  let obaSURL = 'http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=' + process.env.OBA_KEY + '&lat=' + req.latLon.lat + '&lon=' + req.latLon.lng + '&radius=300&maxCount=10';

  http.get(obaSURL, (response, err) => {
    let body = '';
    response.on('data', (chunk) => {
      body += chunk;
    });
    response.on('end', () => {
      body = JSON.parse(body);
      let stopsList = body.data.list;
      let obaRURL = 'http://api.pugetsound.onebusaway.org/api/where/routes-for-location.json?key=' + process.env.OBA_KEY + '&lat=' + req.latLon.lat + '&lon=' + req.latLon.lng + '&radius=300&maxCount=100000';
      http.get(obaRURL, (routeResponse, err) => {
        if (err) return next(new Error(err));
        let routesBody = '';
        routeResponse.on('data', (rChunk) => {
          routesBody += rChunk;
        });
        routeResponse.on('end', () => {
          let routesList = JSON.parse(routesBody).data.list;
          putIn(stopsList, routesList);
          req.stopsList = stopsList;
          next();
        });
      });
    }).on('error', () => {
      return next(new Error(err, 'could not get list of stops'));
    });
  });
};

function putIn(array1, array2) {
  array1.forEach((stop) => {
    for (let i = 0; i < stop.routeIds.length; i++) {
      for (let j = 0; j < array2.length; j++) {
        if (stop.routeIds[i] === array2[j].id) {
          stop.routeIds[i] = array2[j];
        }
      }
    }
  });
}

module.exports = exports = getStops;
