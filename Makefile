SHELL=/bin/bash
env=skunkworks

clean::
	git clean -d -f && find . -name "node_modules" -type d -prune -print | xargs du -chs && find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;

install::
	npm i

test::
	npm run test && npm run coverage &&\
	#npm install -g codeclimate-test-reporter && CODECLIMATE_REPO_TOKEN= codeclimate-test-reporter < coverage/lcov.info

publish::
	npm publish --access public
