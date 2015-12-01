express = require('express')
harp = require('harp')

app = express()

app.set('views', '.') // looks for template files in the project's root
app.set('view engine', 'jade') // is going to use jade to render template files

app.get("/1234/:paramOne", function(req, res) {
	res.send(req.params.paramOne)
})

app.get("/jadetest", function(req, res) {
	res.render('jadetest', {
			"name": "Bob"
		}) // find ./jadetest.jade, and show it with variables
})

app.get("/groups/:groupID", function (req,res) {
	res.render('groupProfile', {
		"name": req.params.groupID
	})
})

app.get("/apps/activity", function(req, res) {
	res.render('appActivity')
})

app.use(harp.mount(__dirname)) // still serve everything else via harp

app.listen(process.env.PORT || 5000)
console.log("Listening on http://localhost:5000")
