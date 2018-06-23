const RADIUS_SCALE = 5;
const TEXT_PADDING = 10;
var CIRCLE_PADDING = 100;
var CIRCLE_SPREAD = 250;
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
            console.log(jobs);

            // make nodes
            nodes = makeNodes(jobs);
            console.log(nodes);
            // show the first one
            setPos(nodes[0], null);
            showNode(0);
        }
    });
};

function makeNodes(jobs){
    var nodes = [];
    for (var i=0; i<jobs.length; i++){
        var job = jobs[i];
        var newNode = {i: i};
        newNode.label = job.role + ", " + job.organisation;
        newNode.size = job.relevance;
        newNode.description = job.comment;
        nodes.push(newNode);
    }

    setNeighbours(jobs, nodes);
    setOrders(jobs, nodes);
    return nodes;
}

/**
 * set the neighbours property of each node based on related jobs
 * @param jobs
 * @param nodes
 */
function setNeighbours(jobs, nodes){
    //TODO: write this method properly
    nodes[0].neighbours = [];
    for(var i=1; i < nodes.length; i++){
        nodes[i].neighbours = [0];
        nodes[0].neighbours.push(i);
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

    // TODO: Do this better
    for (var i=0; i< jobs.length; i++){
        var order;
        var job = jobs[i];
        var year = job.end.substr(-4);
        order = 2018 - parseInt(year);
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
    console.log("closing info window");
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
    var range = getRange(nodes);

    var canvasWidth = $("#canvas").width();
    var canvasHeight = $("#canvas").height();

    var dy = (canvasHeight - 2*CIRCLE_PADDING)/range;
    var spacing = Math.min(dy, CIRCLE_SPREAD);
    var y = node.order*dy + CIRCLE_PADDING;

    var x = canvasWidth/2;
    if(parent != null){
        x = parent.x - CIRCLE_SPREAD;
    }
    while (checkTaken(x, y, filledSpots, spacing)) {
        x += CIRCLE_SPREAD;
    }
    filledSpots.push({x:x, y: y});
    node.x = x;
    node.y = y;
    console.log(node.x + ", " + node.y);
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
    return max-min + 1;
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