applications = [{
	"displayName": "Concur",
	"id": "concur",
	"image": "/img/concur.PNG",
	"url": "https://www.concur.com/en-us/login"
}, {
	"displayName": "Evernote",
	"id": "evernote",
	"image": "/img/evernote.PNG",
	"url": "https://www.evernote.com/Login.action"
}, {
	"displayName": "Fidelity",
	"id": "fidelity",
	"image": "/img/fidelity.PNG",
	"url": "https://login.fidelity.com/ftgw/Fas/Fidelity/RtlCust/Login/Init"
}, {
	"displayName": "GitHub",
	"id": "github",
	"image": "/img/github.PNG",
	"url": "https://github.com/login"
}, {
	"displayName": "Google Plus",
	"id": "googleplus",
	"image": "/img/googleplus.PNG",
	"url": "https://plus.google.com/"
}, {
	"displayName": "Marketo",
	"id": "marketo",
	"image": "/img/marketo.PNG",
	"url": "https://login.marketo.com/"
}, {
	"displayName": "Microsoft Skype",
	"id": "skype",
	"image": "/img/skype.PNG",
	"url": "https://login.skype.com/"
}, {
	"displayName": "Office 365 Sharepoint",
	"id": "o365sharepoint",
	"image": "/img/o365sharepoint.PNG",
	"url": "https://login.microsoftonline.com/"
}, {
	"displayName": "OneDrive",
	"id": "onedrive",
	"image": "/img/onedrive.PNG",
	"url": "https://onedrive.live.com"
}, {
	"displayName": "OnPrem Sales Track",
	"id": "onpremsalestrack",
	"image": "/img/onpremsalestrack.PNG",
	"url": "http://onpremsalestrack"
}, {
	"displayName": "Oracle",
	"id": "oracle",
	"image": "/img/oracle.PNG",
	"url": "https://login.oracle.com/mysso/signon.jsp"
}, {
	"displayName": "Salesforce",
	"id": "salesforce",
	"image": "/img/salesforce.PNG",
	"url": "https://login.salesforce.com/"
}, {
	"displayName": "Twitter",
	"id": "twitter",
	"image": "/img/twitter.PNG",
	"url": "https://twitter.com/login"
}, {
	"displayName": "Yammer",
	"id": "yammer",
	"image": "/img/yammer.PNG",
	"url": "http://developer.yammer.com/docs/authentication"
}]

// check to see if this is being used in the browser - if not, export module for use in dataGenerator.js
if (typeof window == 'undefined') {
	module.exports = applications
}
