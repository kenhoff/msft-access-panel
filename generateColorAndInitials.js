/* Color Hasher & Initial Generator*/
function getStringInitials(name){
	//console.log("Name: " + name);

	var str = name;
	var parts = str.split(" ");

	var length = parts.length;

	if (length == 1){
		var initials = "";
		initials += parts[0].charAt(0) + parts[0].charAt(1);
	} else {
		var initials = "";
		var last = length - 1;
		initials += parts[0].charAt(0) + parts[last].charAt(0);
	}

	initials = initials.toUpperCase();
	//console.log("Initials: " + initials);

	return initials;
}

function hashStringToColor(str){
	// get hash code first
	var hash = 0, i, chr, len;
  	if (str.length == 0) return hash;
  	for (i = 0, len = str.length; i < len; i++) {
    	chr = str.charCodeAt(i);
    	hash = ((hash << 5) - hash) + chr;
    	hash |= 0; // Convert to 32bit	vareger
  	}

  	// convert hash code to color
	var r = (hash & 0xFF0000) >> 16;
	var g = (hash & 0x00FF00) >> 8;
	var b = hash & 0x0000FF;
	// ensure we can use white text on these colors
	/*
	if (r > 180) r = (r/2)>>0;
	if (g > 180) g = (g/2)>>0;
	if (b > 180) b = (b/2)>>0;
	*/

	var rgb = {r: r, g: g, b: b};
	//console.log("rgb: " + r + " " + g + " " + b);
	return rgb;
}

function getDisplayObject(str){
	var rgb = hashStringToColor(str);
	var initials = getStringInitials(str);
	var displayObject = {r: rgb.r, g: rgb.g, b: rgb.b, initials: initials};
	console.log("String: " + str);
	console.log("Initials: " + displayObject.initials);
	console.log("RGB: " + displayObject.r + " " + displayObject.g + " " + displayObject.b);
	return displayObject;
}

$(document).ready(function(){
    console.log("Loading groups...");

	for (group of groups){
		var info = getDisplayObject(group.displayName);
		console.log(group.displayName);

		var groupString = '<a class="gridItem" target = "_blank" href = "/groups/'+ group.id + '"><icon style="background-color:rgb(' + info.r + ',' + info.g + ',' + info.b + ')"><h2>' + info.initials + '</h2></icon><h3>' + group.displayName + '</h3></a>';


		$("#grid").append(groupString);

	}

	console.log("Groups loaded!")
})


//<div class="foo" style="background-color:#13b4ff;"></div>
