


window.onload = showFirstNode;

var nodes = [
    {i: 0, label: "Super awesome node", neighbours:[1,2], size:10, order: 1},
    {i: 1, label: "Less awesome node", neighbours:[0], size:5, order: 2},
    {i: 2, label: "Ok node", neighbours:[0,3, 4, 5], size: 3, order: 2},
    {i: 3, label: "Pretty good node", neighbours:[2], size: 7, order: 3},
    {i: 4, label: "Pretty good node", neighbours:[2], size: 6, order: 4},
    {i: 5, label: "Pretty good node", neighbours:[2], size: 6, order: 3}

];

var filledSpots = [];

var expanded = [];
var canvasWidth = 1000;
var canvasHeight = 900;

var nextPos = {x: canvasWidth/2, y: canvasHeight/2};

function showFirstNode(){
    console.log(checkNodes(nodes));
    setPos(nodes[0], null);
    showNode(0);
}



function showNode(id){
    if(id in expanded){
        return;
    }
    expanded.push(id);
  var canvas = document.getElementById("canvas");
  var node = nodes[id];
  var sizeStr = (node.size*5).toString();
  var circle = d3.select("#canvas").append("circle")
      .attr("r", sizeStr)
      .attr("cx", node.x.toString())
      .attr("cy", node.y.toString())
      .attr("onclick", "showNeighbours("+id+")")
      .attr("id", id.toString())
      .attr("class", "unexpanded ");
}

function updateNextPos(){
    nextPos.x = Math.floor((Math.random() *(canvasWidth-50)) + 50);
    nextPos.y = Math.floor((Math.random() *(canvasHeight-50)) + 50);
}
function showNeighbours(id){
    $("#"+id).removeClass("unexpanded");
    $("#"+id).prop('onclick',null);
    for(var i=0; i < nodes[id].neighbours.length; i++){

        if(nodes[id].neighbours[i] in expanded){
            continue;
        }
        var newNode = nodes[nodes[id].neighbours[i]];

        setPos(newNode, nodes[id]);
        addLine(nodes[id], newNode);
        showNode(nodes[id].neighbours[i]);
    }
}

function addLine(start, end){
    console.log(end);
    var line = d3.select("#canvas").append("line")
        .attr("x1", start.x)
        .attr("y1", start.y)
        .attr("x2", end.x)
        .attr("y2", end.y);
}

/*
function setPos(node, parent){
    // random placement
    node.x = getRandom(0+50, canvasWidth - 50);
    node.y = getRandom(0+50, canvasHeight - 50);

}
*/

function setPos(node, parent){
    // ordered
    var padding = 100;
    var spread = 150;
    var range = getRange(nodes);

    var dy = (canvasHeight - 2*padding)/range;
    var spacing = Math.min(dy, spread);
    var y = node.order*dy + padding;

    var x = canvasWidth/2;
    if(parent != null){
        x = parent.x - spread;
    }
    while (checkTaken(x, y, filledSpots, spacing)) {
        x += spread;
    }
    filledSpots.push({x:x, y: y});
    node.x = x;
    node.y = y;
}

function checkTaken(x, y, filledSpots, spacing){
    console.log(filledSpots);
    console.log("x: " + x + ", y: " + y);
    for (var i = 0; i < filledSpots.length; i++){
        if ((filledSpots[i].x >= x - spacing && filledSpots[i].x <= x + spacing) &&
            (filledSpots[i].y >= y - spacing && filledSpots[i].y <= y + spacing)){
            return true;
        }
    }
    return false;
}

function getRange(nodes){
    var min = nodes[0].order;
    var max = nodes[0].order;
    for (var i=0; i< nodes.length; i++){
        var o = nodes[i].order;
        if(o > max){
            max = o;
        }
        if(o < min){
            min = o;
        }
    }
    return max-min + 1;
}

/*
function setPos(node, parent){
    // radial attempt
    if (parent == null){
        // first node
        node.x = canvasWidth/2;
        node.y = canvasHeight/2;
        return
    }
    var buffer = 70;


    var dx = 100 + getRandom(-50,50);
    var dy = 100;

    // children of first node go random direction
    if ((parent.x < canvasWidth/2 + buffer) &&
        (parent.x > canvasWidth/2 - buffer)) {
        if(Math.random() > 0.5) {
            dx *= -1;
        }
    }else if (parent.x < canvasWidth/2){
        // other nodes go out radially
        dx *= -1;
    }
    if ((parent.y < canvasHeight/2 + buffer) &&
        (parent.x > canvasHeight/2 - buffer)) {
        if(Math.random() > 0.5) {
            dy *= -1;
        }
    }else if (parent.y < canvasWidth/2){
        dy *= -1;
    }




    node.x = parent.x + dx;
    node.y = parent.y + dy;

}
*/

function getRandom(min, max){
    return Math.floor(Math.random()*(max-min + 1) + min);
}

function checkNodes(nodes){
    var badNeighbours = [];
    for (var i=0; i < nodes.length; i++){
        for(var j=0; j < nodes[i].neighbours.length; j++){
            var neighbour = nodes[i].neighbours[j];
            if(!checkNeighbour(i, neighbour, nodes)){
                badNeighbours.push({a:i, b:neighbour});
                console.log("Bad: "+ i + ", " + neighbour);
            }
        }
    }
    if (badNeighbours.length == 0){
        console.log("Good nodes!");
        return true;
    }else{
        return false;
    }
}

/**
 * return true if "other" is listed as a neighbour of "node"
 */
function checkNeighbour(nodeI, otherI, nodes){
    var node = nodes[otherI];
    return node.neighbours.includes(nodeI);

}