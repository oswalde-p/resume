


window.onload = showFirstNode;

var description = "This is a brand new problem, a problem without any clues. "+
    " if you know all the clues, its easy to get through. But you look confused."+
    " like you don't know what to do. It's hard to get an answer if you haven't got "+
    " a clue";
var nodes = [
    {i: 0, label: "Super awesome node", neighbours:[1,2], size:10, order: 1, description: description},
    {i: 1, label: "Less awesome node", neighbours:[0,6], size:5, order: 2, description: description},
    {i: 2, label: "Ok node", neighbours:[0,3, 4, 5], size: 3, order: 2, description: description},
    {i: 3, label: "Pretty good node", neighbours:[2], size: 7, order: 3, description: description},
    {i: 4, label: "Pretty good node", neighbours:[2], size: 6, order: 4, description: description},
    {i: 5, label: "Pretty good node", neighbours:[2], size: 6, order: 3, description: description},
    {i: 6, label: "Pretty good node", neighbours:[1], size: 6, order: 3, description: description}

];

var filledSpots = [];

var expanded = [];
var visible = [];

function showFirstNode(){
    console.log(checkNodes(nodes));
    setPos(nodes[0], null);
    showNode(0);
}



function showNode(id){
    console.log(visible);
    if(visible.includes(id)){
        return;
    }
    visible.push(id);
  var node = nodes[id];
  var sizeStr = (node.size*5).toString();
  var g = d3.select("#canvas").append("g")
      .attr("transform", "translate("+node.x+","+node.y+")");

  var circle = g.append("circle")
      .attr("r", sizeStr)
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("onclick", "showNeighbours("+id+")")
      .attr("id", id.toString())
      .attr("class", "unexpanded ");

  var offset = Number(circle.attr("r")) + 10;
  var label = g.append("text")
      .attr("dx", offset)
      .attr("dy", ".35em")
      .text(node.label)
      .attr("id", "label"+id);

  var textWidth = document.getElementById("label"+id).getComputedTextLength();
  console.log(textWidth);
  g.append("text")
      .text("+")
      .attr("dx", (textWidth+ offset + 10).toString())
      .attr("dy", ".35em")
      .attr("class", "moreInfo ")
      .attr("onclick", "showMore(" + id + ")");

}

function updateNextPos(){
    nextPos.x = Math.floor((Math.random() *(canvasWidth-50)) + 50);
    nextPos.y = Math.floor((Math.random() *(canvasHeight-50)) + 50);
}
function showNeighbours(id){
    $("#"+id).removeClass("unexpanded");
    $("#"+id).prop('onclick',null);
    for(var i=0; i < nodes[id].neighbours.length; i++){


        var newNode = nodes[nodes[id].neighbours[i]];
        if(visible.includes(nodes[id].neighbours[i])){
            addLine(nodes[id], newNode);
            continue;
        }
        setPos(newNode, nodes[id]);
        addLine(nodes[id], newNode);
        showNode(nodes[id].neighbours[i]);
    }
}

function addLine(start, end){
    var line = d3.select("#canvas").append("line")
        .attr("x1", start.x)
        .attr("y1", start.y)
        .attr("x2", end.x)
        .attr("y2", end.y);
}

function showMore(id){

   /* var text =  d3.select("#canvas").append("text")
        .attr("dx", nodes[id].x)
        .attr("dy", nodes[id].y)
        .text(nodes[id].description)
        .attr("class", "infoWindow "); */
   var div = document.createElement("div");
   div.className += "infoWindow ";

   var h2 = document.createElement("h2");
   h2.innerHTML = nodes[id].label;
   div.appendChild(h2);

   var p = document.createElement("p");
   p.innerHTML = nodes[id].description;
   div.appendChild(p);

   var btn = document.createElement("input");
   btn.setAttribute("id", "closeBtn");
   btn.setAttribute("type", "button");
   btn.setAttribute("value", "Close");
   btn.setAttribute("onclick", "closeWindow()");

    div.appendChild(btn);
   document.body.appendChild(div);
}

function closeWindow(){
    console.log("closing info window");
 var windows = document.getElementsByClassName("infoWindow");
 for(var i=0; i< windows.length; i++){
     windows[i].parentNode.removeChild(windows[i]);
 }
}
function setPos(node, parent){
    // ordered
    var padding = 100;
    var spread = 150;
    var range = getRange(nodes);

    var canvasWidth = $("#canvas").width();
    var canvasHeight = $("#canvas").height();

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