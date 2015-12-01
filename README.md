# access-panel
The Access Panel redesign for the 2015 Microsoft //oneweek Hackathon

## Getting started
- Fork this repo!
- Clone your fork
- Create your feature branch: `git checkout -b my-new-feature`

## Usage
Requires [node.js](http://nodejs.org/)
- `npm install` (might have to `sudo npm install` if you're on a Mac)
- If you're working on server-side things:
	- Install nodemon globally: `npm install nodemon -g`
	- `nodemon server.js`
- If you're **not** working on server-side things:
	- `node server.js`
- [http://localhost:5000/apps](http://localhost:5000)

### Endpoints
- [/apps](http://localhost:5000/apps)
- [/apps/activity](http://localhost:5000/apps/activity)
- [/groups](http://localhost:5000/groups)
- [/groups/join](http://localhost:5000/groups/join)
- [/groups/[specific group]](???)
- [/profile](http://localhost:5000/profile)

## Contributing
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request :D

### To recieve updates from the original repo:
- Add the original repo as a remote to your repo called "upstream": `git remote add upstream git@github.com:kenhoff/access-panel.git`
	- Or, you might need to use HTTPS: `git remote add upstream https://github.com/kenhoff/access-panel.git`
- Checkout your repo's master branch: `git checkout master`
- Pull updates from the original repo's master branch, and merge them into your current (master) branch: `git pull upstream master`
- **Make sure you rerun `npm install`!**
- To update your working branch:
	- Checkout your working branch: `git checkout working-branch`
	- Merge your master branch (which now contains changes from the original repo's master branch) into your current (working) branch: `git merge master`
- Continue working on your working branch
- More info at [Syncing a fork](https://help.github.com/articles/syncing-a-fork/)

## Credits
Hackathon Team
- Jasmine Perez (t-japere@microsoft.com)
- Christina Gilbert (t-chgi@microsoft.com)
- Elena Morozova (t-elmo@microsoft.com)
- Erin Greenlee (t-ergr@microsoft.com)
- Ken Hoff (kenhoff@microsoft.com)

## License
Microsoft proprietary
