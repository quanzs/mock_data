function toRad(d) {  return d * Math.PI / 180; }
function getDisance(lat1, lng1, lat2, lng2) { //lat为纬度, lng为经度, 一定不要弄错
    var dis = 0;
    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return Math.round(dis * 6378137);
}

const ERROR_ARR = [
	"车锁损坏",
	"二维码破损",
	"轮圈需要维修",
	"其他"
];

function makeRandomPos(lat, lng) {
	lat = parseFloat(lat);
	lng = parseFloat(lng);
	var MAX_DISTANCE = 0.05;
	var arr = [];
	for(var i=0; i < 30;i++) {
		var latNew = lat + (Math.random() > 0.5 ? -1 : 1)*Math.random()*MAX_DISTANCE;
		var lngNew = lng + (Math.random() > 0.5 ? -1 : 1)*Math.random()*MAX_DISTANCE;
		var distance = getDisance(lat, lng, latNew, lngNew);
		arr.push({
			lat: latNew, 
			lng: lngNew, 
			distance: distance,
			id: "E00" + ("00000000" + parseInt(100000000*Math.random())).substr(-8),
			detail: ERROR_ARR[Math.floor(Math.random()*4)]
		});	
	}
	arr.sort(function(pre, next){
		return pre.distance - next.distance;
	});

	return arr;
}



var express = require('express');
var app = express();
var http = require('http').Server(app);

// 使用ejs模板引擎
app.set("view engine","ejs");
// 引入css静态资源
app.use("/", express.static('public'));

// 随机生成共享单车的数据
app.get('/api/broken-bikes', function (req, res, next) {
	var lat = req.query.lat;
	var lng = req.query.lng;
	if(lat == null || lng == null) {
		res.send(JSON.stringify({"err_message": "请输入经纬度"}));
		return;
	}
	var cars = makeRandomPos(lat, lng);
	res.setHeader('Content-type', 'application/json');
	res.send(JSON.stringify(cars));
});

// 随机生成共享单车的数据
app.get('/api/repair', function (req, res, next) {
	var id = req.query.id;
	var method = req.query.method;
	if(id == null) {
		res.send(JSON.stringify({"err_message": "请输入车辆编号"}));
		return;
	}
	if(method == null) {
		res.send(JSON.stringify({"err_message": "请选择维修方法"}));
		return;
	}
	res.setHeader('Content-type', 'application/json');
	var result = {
		"message": "维修完成。 车辆已经可以正常使用。"
	};
	res.send(JSON.stringify(result));
});

var server = http.listen(process.env.PORT || 8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});