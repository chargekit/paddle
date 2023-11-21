types:
	@npx tsc --noEmit

types-watch:
	@npx tsc --noEmit --watch

test: test-node test-web

test-node:
	@npx vitest run

test-web:
	@npx vitest run -c vitest.config.web.ts --browser.headless

test-node-watch:
	@npx vitest

test-web-watch:
	@npx vitest -c vitest.config.web.ts

build: prepare-build
	@env BABEL_ENV=esm npx babel src --config-file ./babel.config.js --source-root src --out-dir lib --extensions .mjs,.ts --out-file-extension .mjs --quiet
	@env BABEL_ENV=cjs npx babel src --config-file ./babel.config.js --source-root src --out-dir lib --extensions .mjs,.ts --out-file-extension .js --quiet
	@npx tsc -p tsconfig.lib.json 
	@node copy.mjs
	
build-watch: prepare-build
	@env BABEL_ENV=esm npx babel src --config-file ./babel.config.js --source-root src --out-dir lib --extensions .mjs,.ts --out-file-extension .mjs --watch &
	@env BABEL_ENV=cjs npx babel src --config-file ./babel.config.js --source-root src --out-dir lib --extensions .mjs,.ts --out-file-extension .js --watch &
	@npx tsc -p tsconfig.lib.json --watch &
	@node copy.mjs --watch

prepare-build:
	@rm -rf lib/*
	@mkdir -p lib

publish: build
	@cd lib && npm publish --access public

link:
	@cd lib && npm link