function findPoint(position, points) {
	for (let i = 0; i < points.length; i++) {
		let posPoint = {
			"lat": points[i].lat,
			"lng": points[i].lng
		}
		if (JSON.stringify(position) == JSON.stringify(posPoint)) {
			return points[i].label
		}
	}
}

function djikstra(initial, destination){

	let distanceNode = {}
	for (let i = 0; i < points.length; i++) {
		distanceNode[points[i].label] = 0
	}

	let unvisitedNode = points.slice()

	let i = 0
	while (i < unvisitedNode.length) {
		delete unvisitedNode[i].type
		if (JSON.stringify(initial) == JSON.stringify(unvisitedNode[i])) {
			unvisitedNode.splice(i, 1)
			i = unvisitedNode.length
		}
		i++
	}

	let currentNode = initial
	let reachDestination = false

	while((unvisitedNode.length) && (!reachDestination)){
		delete currentNode.type
		if (JSON.stringify(currentNode) === JSON.stringify(destination)) {
			reachDestination = true
		}else{
			let posInitial = {
				"lat":currentNode.lat,
				"lng":currentNode.lng
			}

			for (let i = 0; i < paths.length; i++) {
				let pathIndex = 2;
				if (JSON.stringify(posInitial) == JSON.stringify(paths[i].path[0])) {
					pathIndex = 1
				}else if(JSON.stringify(posInitial) == JSON.stringify(paths[i].path[1])){
					pathIndex = 0
				}
				if (pathIndex != 2) {
					let curLabel = findPoint(paths[i].path[pathIndex], points)
					
					if ((distanceNode[curLabel] > distanceNode[curLabel] + distanceNode[currentNode.label]) || (distanceNode[curLabel] == 0)) {
						distanceNode[curLabel] = distanceNode[currentNode.label] + paths[i].distance
					}
				}
			}

			let min = 999
			let index
			for (let i = 0; i < unvisitedNode.length; i++) {
				if((distanceNode[unvisitedNode[i].label] < min) && (unvisitedNode[i].label !== initial.label) && (distanceNode[unvisitedNode[i].label] != 0)){
					min = distanceNode[unvisitedNode[i].label]
					currentNode = unvisitedNode[i]
					index = i
				}
			}
			unvisitedNode.splice(index, 1)
		}
	}
	console.log(distanceNode)
	return distanceNode[destination.label]
}

function deleteData(needle, haystack) {
	let i = 0
	while(i < haystack.length) {
		if (JSON.stringify(haystack[i]) == JSON.stringify(needle)) {
			haystack.splice(i, 1)
			i = haystack.length
		}
		i ++
	}
}

function euclidean(point1, point2) {
	return Math.sqrt( Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) )
}

function nearest(origin, objects) {
	let min = 999999,
		currentDistance,
		nearestObject
	for (var i = 0; i < objects.length; i++) {
		currentDistance = djikstra(origin, objects[i])
		if (min > currentDistance) {
			nearestObject = objects[i]
			min = currentDistance
		}
	}
	return nearestObject
}

function findNearest(objects){
	let allDistance = [],
		curObjects
	let objectsCount = objects.length
	for (var i = 0; i < objectsCount; i++) {
		let curCouple = {
			origin: {},
			nearest: {}
		}
		curCouple.origin = objects[i]
		curObjects = objects.slice()
		let j = 0
		while(j < curObjects.length) {
			if (JSON.stringify(curObjects[j]) == JSON.stringify(objects[i])) {
				curObjects.splice(j, 1)
				j = curObjects.length
			}
			j ++
		}
		curCouple.nearest = nearest(objects[i], curObjects)
		allDistance.push(curCouple)
	}
	return allDistance
}

function main(facility, objects) {
	let allObjects = objects
	allObjects.push(facility)	

	let nearest = findNearest(allObjects),
		nearestLength = nearest.length,
		reverseNN = []

	for (var i = 0; i < nearestLength; i++) {
		if (nearest[i].nearest == facility) {
			reverseNN.push(nearest[i].origin)
		}
	}

	return reverseNN
}

// var paths = [
// 	{
// 		"path":[
// 			{
// 				"lat":-6.974053629849131,
// 				"lng":107.63068556785583
// 			},{
// 				"lat":-6.9740216814801705,
// 				"lng":107.63258457183838
// 			}
// 		],
// 		"distance":209.62739981198234
// 	},{
// 		"path":[
// 			{
// 				"lat":-6.9740216814801705,
// 				"lng":107.63258457183838
// 			},{
// 				"lat":-6.974905585550999,
// 				"lng":107.63248801231384
// 			}
// 		],
// 		"distance":98.8617749367696
// 	},{
// 		"path":[
// 			{
// 				"lat":-6.9740216814801705,
// 				"lng":107.63258457183838
// 			},{
// 				"lat":-6.973233621022547,
// 				"lng":107.63333559036255
// 			}
// 		],
// 		"distance":120.62234603989829
// 	},{
// 		"path":[
// 			{
// 				"lat":-6.973233621022547,
// 				"lng":107.63333559036255
// 			},{
// 				"lat":-6.971039824118229,
// 				"lng":107.63085722923279
// 			}
// 		],
// 		"distance":366.51362670908395
// 	},{
// 		"path":[
// 			{
// 				"lat":-6.971039824118229,
// 				"lng":107.63085722923279
// 			},{
// 				"lat":-6.970560595272182,
// 				"lng":107.63122200965881
// 			}
// 		],
// 		"distance":66.78781645107686
// 	},{
// 		"path":[
// 			{
// 				"lat":-6.970560595272182,
// 				"lng":107.63122200965881
// 			},{
// 				"lat":-6.972562703642207,
// 				"lng":107.63407588005066
// 			}
// 		],
// 		"distance":385.72021184311643
// 	},{
// 		"path":[
// 			{
// 				"lat":-6.973233621022547,
// 				"lng":107.63333559036255
// 			},{
// 				"lat":-6.972562703642207,
// 				"lng":107.63407588005066
// 			}
// 		],
// 		"distance":110.64214521990755
// 	},{
// 		"path":[
// 			{
// 				"lat":-6.972562703642207,
// 				"lng":107.63407588005066
// 			},{
// 				"lat":-6.972882188228873,
// 				"lng":107.63617873191833
// 			}
// 		],
// 		"distance":234.8001077534132
// 	}
// ]

// var points = [
// 	{
// 		"id":1,
// 		"label":"A",
// 		"lat":-6.974053629849131,
// 		"lng":107.63068556785583,
// 		"type":"point"
// 	},{
// 		"id":2,
// 		"label":"B",
// 		"lat":-6.9740216814801705,
// 		"lng":107.63258457183838,
// 		"type":"point"
// 	},{
// 		"id":3,
// 		"label":"C",
// 		"lat":-6.974905585550999,
// 		"lng":107.63248801231384,
// 		"type":"point"
// 	},{
// 		"id":4,
// 		"label":"D",
// 		"lat":-6.972562703642207,
// 		"lng":107.63407588005066,
// 		"type":"point"
// 	},{
// 		"id":5,
// 		"label":"E",
// 		"lat":-6.973233621022547,
// 		"lng":107.63333559036255,
// 		"type":"point"
// 	},{
// 		"id":6,
// 		"label":"F",
// 		"lat":-6.971039824118229,
// 		"lng":107.63085722923279,
// 		"type":"point"
// 	},{
// 		"id":7,
// 		"label":"G",
// 		"lat":-6.970560595272182,
// 		"lng":107.63122200965881,
// 		"type":"point"
// 	},{
// 		"id":8,
// 		"label":"H",
// 		"lat":-6.972882188228873,
// 		"lng":107.63617873191833,
// 		"type":"point"
// 	}
// ]

// let objects2 = [
// 	{
// 		"id":1,
// 		"label":"A",
// 		"lat":-6.974053629849131,
// 		"lng":107.63068556785583
// 	},{
// 		"id":8,
// 		"label":"H",
// 		"lat":-6.972882188228873,
// 		"lng":107.63617873191833
// 	},{
// 		"id":6,
// 		"label":"F",
// 		"lat":-6.971039824118229,
// 		"lng":107.63085722923279
// 	},{
// 		"id":7,
// 		"label":"G",
// 		"lat":-6.970560595272182,
// 		"lng":107.63122200965881
// 	}
// ]

// let facility = {"id":1,"label":"A","lat":-6.974042980393057,"lng":107.6306962966919}

var head = document.querySelector(".modal-header").innerHTML
var body = document.querySelector(".modal-body").innerHTML

function call_main() {
	document.querySelector(".modal-header").innerHTML = head
	document.querySelector(".modal-body").innerHTML = ""
	let objs = objects.slice()
	for (var i = 0; i < objs.length; i++) {
		if (objs[i].id == $('#facility').val()) {
			objs.splice(i, 1)
		} 
	}
	let facility = getPoint($('#facility').val())
	let nnObjects = main(facility, objs)
	var htmlData = ""
	for (var i = 0; i < nnObjects.length; i++) {
		htmlData += "<h3>" + nnObjects[i].label + "</h3><br>"
	}
	document.querySelector(".modal-header").innerHTML += facility.label
	document.querySelector(".modal-body").innerHTML = htmlData
}

//objects of querying
// let objects = [
// 	{
// 		name: 'A',
// 		x: 2.5,
// 		y: 1.5
// 	}, 
// 	{
// 		name: 'B',
// 		x: 3.5,
// 		y: 4.5
// 	}, 
// 	{
// 		name: 'C',
// 		x: 2,
// 		y: 1
// 	}, 
// 	{
// 		name: 'D',
// 		x: 1,
// 		y: 1
// 	}, 
// ];

//reverse NN object
// let facility = {
// 	name: 'X',
// 	x: 1,
// 	y: 1

// }

// main(facility, objects)
