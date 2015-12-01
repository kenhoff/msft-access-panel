// USAGE:
// install node: http://nodejs.org/
// command line:
// 		node dataGenerator.js

// NOTE: currently unusable. fix require("./applications.json") before use.

NUMBER_OF_SIGN_INS = 100
USER_UPN = "abbysantiago@contoso.com"
USER_DISPLAYNAME = "Abby Santiago"

applications = require("./applications.js")
console.log (applications)

ipAddresses = [
	"23.101.60.234",
	"23.102.157.61",
	"23.103.183.0",
	"104.46.60.252",
	"134.170.27.64",
	"134.170.48.0",
	"134.170.65.64",
	"134.170.128.192",
	"134.170.170.64",
	"191.232.2.64"
]

userAgents = [
	"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
	"Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.0",
	"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A"
]

function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

signIns = []

for (var i = 0; i < NUMBER_OF_SIGN_INS; i++) {
	signIn = {}
	signIn["user"] = {}
	signIn["user"].displayName = USER_DISPLAYNAME
	signIn["user"].upn = USER_UPN
	signIn.datetime = randomDate(new Date(2012, 0, 1), new Date())
	signIn.ipAddress = ipAddresses[Math.floor(Math.random() * ipAddresses.length)];
	signIn.userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
	signIn["application"] = {}
	app = applications[Math.floor(Math.random() * applications.length)];
	signIn["application"].displayName = app.displayName
	signIn["application"].id = app.id
	signIn.latitude = ((Math.random() * 180) - 90) // -90 inclusive to 90 exclusive
	signIn.longitude = ((Math.random() * 180) - 90)
	signIns.push(signIn)
		// console.log(names[i])
}

var fs = require('fs');
fs.writeFile("sign-ins.json", "signIns = " + JSON.stringify(signIns), function(err) {
	if (err) {
		return console.log(err);
	}
	console.log("sign-ins.json created!");
});
