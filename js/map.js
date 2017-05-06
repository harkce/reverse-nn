var map;
var mode = "idle";
var points = [];
var objects = [];
var paths = [];
var markers = [];
var lines = [];
var idcount = 0;
var labelcount = 65;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: -6.974125, lng: 107.630381 },
		zoom: 17
	});

	google.maps.event.addListener(map, 'click', function(event) {
		if (mode == "addpoint") {
			addMarker(event.latLng, map);
		}
	});

}

function addMarker(location, map) {
	idcount++;
	var txt = String.fromCharCode(labelcount);
	labelcount++;
	var marker = new google.maps.Marker({
		id: idcount,
		position: location,
		label: txt,
		map: map
	});
	markers.push(marker);
	points.push({id: idcount, label: txt, lat: location.lat(), lng: location.lng(), type: "point"});
	$('#pathfrom').append($('<option>', {
		value: location,
		text: txt
	}));

	$('#pathto').append($('<option>', {
		value: location,
		text: txt
	}));

	$('#selectobject').append($('<option>', {
		value: idcount,
		text: txt
	}));
}

function toRad(degrees) {
	return degrees * Math.PI / 180;
}

function distancelatlng(p1,p2) {
	var R = 6371e3;
	var rad1 = toRad(p1.lat());
	var rad2 = toRad(p2.lat());
	var dlat = toRad((p2.lat()-p1.lat()));
	var dlng = toRad((p2.lng()-p1.lng()));

	var a = Math.sin(dlat/2) * Math.sin(dlat/2) +
	        Math.cos(rad1) * Math.cos(rad2) *
	        Math.sin(dlng/2) * Math.sin(dlng/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;
}

function addPath() {
	if (mode == "addpath") {
		var p1 = getLatLng($('#pathfrom').val());
		var p2 = getLatLng($('#pathto').val());
		var distance = distancelatlng(p1,p2);
		var coord = [
			{lat: p1.lat(), lng: p1.lng()},
			{lat: p2.lat(), lng: p2.lng()}
		];

		var info = {
			path: coord,
			distance: distance
		};

		paths.push(info);

		var path = new google.maps.Polyline({
			path: coord,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		lines.push(path);

		path.setMap(map);
	}
}

function getMarker(id) {
	marklen = markers.length;
	for (var i = 0; i < marklen; i++) {
		if (markers[i].id == id) {
			return markers[i];
		}
	}
	return 0;
}

function getPoint(id) {
	ptslen = points.length;
	for (var i = 0; i < ptslen; i++) {
		if (points[i].id == id) {
			return points[i];
		}
	}
	return 0;
}

function addObject() {
	var value = $('#selectobject').val();
	var marker = getMarker(value);
	var point = getPoint(value);
	if (mode == "addobject" && marker != 0) {
		$("#selectobject option[value='" + value + "']").remove();
		marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
		point.type = "object";
		objects.push({id: marker.id, label: marker.label, lat: marker.position.lat(), lng: marker.position.lng()});
	}

	$('#facility').append($('<option>', {
		value: value,
		text: point.label
	}));
}

function getLatLng(str) {
	str = str.slice(1,-1);
	var latlng = str.split(/, ?/);
    return new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1])); 
}

function modeAddPoint() {
	if (mode == "addpoint") {
		mode = "idle";
		$('#addpoint').text("Add");
	} else if (mode == "idle") {
		mode = "addpoint";
		$('#addpoint').text("Done");
	}
}

function modeAddPath() {
	if (mode == "addpath") {
		mode = "idle";
		$('#modepath').text("Add");
		$('#addpath').hide();
	} else if (mode == "idle") {
		mode = "addpath";
		$('#modepath').text("Done");
		$('#addpath').show();
	}
}

function modeAddObject() {
	if (mode == "addobject") {
		mode = "idle";
		$('#modeobject').text("Add");
		$('#addobject').hide();
	} else if (mode == "idle") {
		mode = "addobject";
		$('#modeobject').text("Done");
		$('#addobject').show();
	}
}

function save() {
	var pts = {points: points};
	var pth = {paths: paths};
	$.ajax({
		type: "POST",
		url: "server.php",
		data: {
			type: 'save',
			point: JSON.stringify(pts),
			path: JSON.stringify(pth),
		},
		success: function(data) {
			alert("Save success");
		},
		async: false
	});
}

function load() {
	reset();
	var pts;
	$.ajax({
		type: "GET",
		url: "data/points.json",
		success: function(data) {
			pts = data.points;
		},
		async: false
	});
	for (var i = 0; i < pts.length; i++) {
		idcount++;
		labelcount++;
		var marker = new google.maps.Marker({
			id: pts[i].id,
			position: {lat: pts[i].lat, lng: pts[i].lng},
			label: pts[i].label,
			map: map
		});
		markers.push(marker);
		points.push({id: pts[i].id, label: pts[i].label, lat: pts[i].lat, lng: pts[i].lng, type: pts[i].type});
		$('#pathfrom').append($('<option>', {
			value: "(" + pts[i].lat + ", " + pts[i].lng + ")",
			text: pts[i].label
		}));

		$('#pathto').append($('<option>', {
			value: "(" + pts[i].lat + ", " + pts[i].lng + ")",
			text: pts[i].label
		}));

		$('#selectobject').append($('<option>', {
			value: pts[i].id,
			text: pts[i].label
		}));

		if (pts[i].type === "object") {
			var value = pts[i].id;
			var marker = getMarker(value);
			var point = getPoint(value);
			if (marker != 0) {
				$("#selectobject option[value='" + value + "']").remove();
				marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
				point.type = "object";
				objects.push({id: marker.id, label: marker.label, lat: marker.position.lat(), lng: marker.position.lng()});
			}
			$('#facility').append($('<option>', {
				value: pts[i].id,
				text: pts[i].label
			}));
		}
	}

	var pth;
	$.ajax({
		type: "GET",
		url: "data/paths.json",
		success: function(data) {
			pth = data.paths;
		},
		async: false
	});
	for (var i = 0; i < pth.length; i++) {
		var distance = pth[i].distance;
		var coord = pth[i].path;

		var info = {
			path: coord,
			distance: distance
		};

		paths.push(info);

		var path = new google.maps.Polyline({
			path: coord,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		lines.push(path);

		path.setMap(map);
	}
}

function reset() {
	idcount = 0;
	labelcount = 65;
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	for (var i = 0; i < lines.length; i++) {
		lines[i].setMap(null);
	}
	$('#pathfrom')
		.find('option')
		.remove()
		.end()
		.append('<option value="">- From -</option>')
		.val('');
	$('#pathto')
		.find('option')
		.remove()
		.end()
		.append('<option value="">- To -</option>')
		.val('');
	$('#selectobject')
		.find('option')
		.remove()
		.end()
		.append('<option value="">- Object -</option>')
		.val('');
	$('#facility')
		.find('option')
		.remove()
		.end()
		.append('<option value="">- Facility -</option>')
		.val('');
	points = [];
	objects = [];
	paths = [];
	markers = [];
	lines = [];
}