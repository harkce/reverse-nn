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
