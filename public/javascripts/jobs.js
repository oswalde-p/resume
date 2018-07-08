const RADIUS_SCALE = 5;
const TEXT_PADDING = 10;
var CIRCLE_PADDING = 50;
var CIRCLE_SPREAD = 100;
var SPACING = 120;
var nodes;
var visible = [];
var filledSpots = [];
const description = "boo!";

window.onload = function(){
    // get job entries
    $.ajax({
        url: "/getAllJobs",
        type: "GET"
    }).done(function(jobs) {
        if (!jobs) {
        }else{

            // make nodes
            nodes = makeNodes(jobs);
            // show the first one
            var firstIx = findFirst(nodes);
            setPos(nodes[firstIx], null);
            showNode(firstIx);
        }
    });
};

function findFirst(nodes){
    var minOrder = 100000;
    var minIx = -1;
    for (var i=0; i < nodes.length; i++){
        if (nodes[i].order < minOrder){
            minOrder = nodes[i].order;
            minIx = i;

        }
    }
    console.log(minIx);
    return minIx;
}

function makeNodes(jobs){
    var nodes = [];
    for (var i=0; i<jobs.length; i++){
        var job = jobs[i];
        var newNode = {i: i};
        newNode.label = job.role + ", " + job.organisation;
        newNode.size = job.relevance;
        newNode.description = job.comment;
        newNode.neighbours = [];
        nodes.push(newNode);
    }


    setNeighbours(jobs, nodes);
    setOrders(jobs, nodes);
    console.log(nodes);
    return nodes;
}

/**
 * set the neighbours property of each node based on related jobs
 * @param jobs
 * @param nodes
 */
function setNeighbours(jobs, nodes){

    // get array of all nicknames
    var nicks = [];
    for(var i=0; i < jobs.length; i++){
        nicks.push(jobs[i].nick);
    }
    console.log(nicks);
    // use index of related nicknames to set neighbours

    for(i=1; i < jobs.length; i++){
        var job = jobs[i];
        for (var j=0; j<job.related.length; j++){
            var neighbIx = nicks.indexOf(job.related[j]);
            if (neighbIx >= 0) {
                nodes[i].neighbours.push(neighbIx);
                nodes[neighbIx].neighbours.push(i);
            }
        }
    }
}

/**
 * set the order param of each node, based on end date of job
 * @param jobs
 * @param nodes
 */
function setOrders(jobs, nodes){
    if (nodes.length != jobs.length){
        console.log("Error: jobs and nodes must be same length");
        return;
    }

    const today = new Date();
    for (var i=0; i< jobs.length; i++){
        var order;
        var job = jobs[i];
        var endDate = new Date(job.end);

        var diff = today.getTime() - endDate.getTime(); // mS
        order = Math.floor(diff/(1000*60*60*24*30));
        nodes[i].order = order;
    }

}

/**
 * show circle + label for nodes[index], update visible
 * @param nodes
 * @param index
 * @param visible
 */
function showNode(index){
    if(visible.includes(index)){
        return;
    }
    visible.push(index);

    var node = nodes[index];
    var sizeStr = (node.size*RADIUS_SCALE).toString();
    var g = d3.select("#canvas").append("g")
        .attr("transform", "translate("+node.x+","+node.y+")");

    var circle = g.append("circle")
        .attr("r", sizeStr)
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("onclick", "showNeighbours("+index+")")
        .attr("id", index.toString())
        .attr("class", "unexpanded ");

    var offset = Number(circle.attr("r")) + TEXT_PADDING;
    var label = g.append("text")
        .attr("dx", offset)
        .attr("dy", "-.35em")
        .text(node.label)
        .attr("class", "nodeLabel ")
        .attr("id", "label"+index);

    var textWidth = document.getElementById("label"+index).getComputedTextLength();

    g.append("text")
        .text("+")
        .attr("dx", (textWidth+ offset + TEXT_PADDING).toString())
        .attr("dy", ".35em")
        .attr("class", "moreInfo ")
        .attr("onclick", "showMore(" + index + ")");

}

/**
 * show all the neigbours of nodes[id], and draw lines
 * @param id
 */
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

/**
 * draw a line from start to end
 * @param start object with properties x and y
 * @param end
 */
function addLine(start, end){
    var line = d3.select("#canvas").append("line")
        .attr("x1", start.x)
        .attr("y1", start.y)
        .attr("x2", end.x)
        .attr("y2", end.y);
}

/**
 * show more info popup window of nodes[id]
 * @param id
 */
function showMore(id){
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

/**
 * close ALL popup info windows
 */
function closeWindow(){
    var windows = document.getElementsByClassName("infoWindow");
    for(var i=0; i< windows.length; i++){
        windows[i].parentNode.removeChild(windows[i]);
    }
}

/**
 * set the position of a node, based on its "order" property and parent position
 * lower order => top of page
 * @param node
 * @param parent
 */
function setPos(node, parent){
    // ordered
    var r = getRange(nodes);
    var range = r[0];
    var min = r[1];

    var canvasWidth = $("#canvas").width();
    var canvasHeight = $("#canvas").height();

    var dy = (canvasHeight - 2*CIRCLE_PADDING)/range;
    var spacing = SPACING;
    var y = (node.order-min)*dy + CIRCLE_PADDING;

    var x = canvasWidth/2;
    if(parent != null){
        var dx = CIRCLE_SPREAD;
        if(Math.random() > 0.49){
            dx *= -1
        }
        x = parent.x + dx;
    }
    while (checkTaken(x, y, filledSpots, spacing)) {
        x += CIRCLE_SPREAD;
    }
    filledSpots.push({x:x, y: y});
    node.x = x;
    node.y = y;
}

/**
 * check if a given x,y pair is too close to an existing position
 * @param x
 * @param y
 * @param filledSpots
 * @param spacing
 * @returns {boolean}
 */
function checkTaken(x, y, filledSpots, spacing){
    for (var i = 0; i < filledSpots.length; i++){
        if ((filledSpots[i].x >= x - spacing && filledSpots[i].x <= x + spacing) &&
            (filledSpots[i].y >= y - spacing && filledSpots[i].y <= y + spacing)){
            return true;
        }
    }
    return false;
}

/**
 * determine the number of levels needed to display nodes, based on order property
 * @param nodes
 * @returns {number}
 */
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
    return [max-min + 1, min];
}

/**
 * check that all the listed neighbours are consistent
 * @param nodes
 * @returns {boolean}
 */
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