$(document).ready(function() {
	// console.log("Loading applications...")
	for (app of applications) {
		// console.log(app.displayName);
		appString = '<a class="gridItem" target = "_blank" href = "' + app.url + '"><img src="'+ app.image + '"><h3>' + app.displayName + '</h3><i class="fa fa-ellipsis-h fa-2x"></i></a>'
		// console.log(appString)
		$("#grid").append(appString);
	}
	// console.log("Applications loaded");
})
