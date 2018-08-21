
window.onload = function (ev) {
    populateAllTags();
    hideClearButton();
}

function populateAllTags(){
    var allTagsArray = [];
    var tag;
    var lists = document.getElementsByClassName("tagList");
    for(var i=0; i<lists.length; i++){
        var listItems = lists[i].getElementsByTagName("li");
        for(var j=0; j<listItems.length; j++){
            tag = getTagLiContent(listItems[j]);
            if(!allTagsArray.includes(tag)){
                allTagsArray.push(tag);
            }
        }
    }

    var allTags = document.getElementById("allTags");

    for(i=0; i<allTagsArray.length; i++){
        tag = allTagsArray[i];

        var li = document.createElement("li");

        li.setAttribute("onclick", "hideInactive('"+tag+"')");
        li.innerHTML = tag;

        allTags.appendChild(li);
    }
}

function hideInactive(tag){
    var divs = document.getElementsByClassName("projectContainer");
    for(var i=0; i<divs.length; i++){
        var tags = getTags(divs[i]);
        if(tags.includes(tag)){
            divs[i].style.display = "block";
        }else{
            divs[i].style.display = "none";
        }
    }

    var allTags = document.getElementById("allTags").getElementsByTagName("li");
    for (i=0; i<allTags.length; i++){
        if(allTags[i].innerHTML === tag){
            allTags[i].className += " active";
        }else{
            allTags[i].classList.remove("active");
        }
    }

    showClearButton();
}

function getTags(projectContainer){
    var tagsListItems = projectContainer.getElementsByClassName("tagList")[0].getElementsByTagName("li");
    var tags = [];
    for(var j=0; j<tagsListItems.length; j++){
        tags += tagsListItems[j].innerHTML;
    }
    return tags;
}

function getTagLiContent(li){
    return li.innerHTML;
}

function showClearButton() {
    document.getElementById("clearFilters").style.display = "inline-block";
}

function hideClearButton() {
    document.getElementById("clearFilters").style.display = "none";

}

function stripActive(){
    var tags = document.getElementById("allTags").getElementsByTagName("li");
    for(var i=0; i<tags.length; i++){
        tags[i].classList.remove("active");
    }
}

function clearFilters(){
    var projects = document.getElementsByClassName("projectContainer");
    for (var i=0; i<projects.length; i++){
        projects[i].style.display = "block";
    }

    hideClearButton();
    stripActive();
}