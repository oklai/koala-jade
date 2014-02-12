/*!
 * Jade compiler
 * 
 * Copyright 2013 Ziad Khoury Hanna
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *  http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var fs          = require('fs'),
	path        = require('path'),
	FileManager = global.getFileManager(),
	Compiler    = require(FileManager.appScriptsDir + '/Compiler');

/**
 * Jade Compiler
 * @param {object} config The Current Compiler config
 */
function JadeCompiler(config) {
   Compiler.call(this, config);
}
require('util').inherits(JadeCompiler, Compiler);

module.exports = JadeCompiler;

/**
 * compile jade file
 * @param  {Object} file      compile file object
 * @param  {Object} emitter  compile event emitter
 */
JadeCompiler.prototype.compile = function (file, emitter) {
	//compile file by use system command
	var globalSettings = this.getGlobalSettings();
	if (globalSettings.advanced.useCommand) {
		this.compileWithCommand(file, emitter);
	} else {
		this.compileWithLib(file, emitter);
	}
};

/**
 * compile jade file with node lib
 * @param  {Object} file      compile file object
 * @param  {Object} handlers  compile event handlers
 */
JadeCompiler.prototype.compileWithLib = function (file, emitter) {
	var jade = require('jade'),
		self = this,
		filePath = file.src,
		output = file.output,
		settings = file.settings || {};

	var triggerError = function (message) {
		emitter.emit('fail');
		emitter.emit('always');

		self.throwError(message, filePath);
	};

	//read code content
	fs.readFile(filePath, 'utf8', function (rErr, code) {
		if (rErr) {
			triggerError(rErr.message);
			return false;
		}

		var html;
		try {
			var options = {};
			if(settings.prettyHtml) {
				options.pretty = settings.prettyHtml;
			}
			html = jade.render(code, options );
		} catch (e) {
			triggerError(e.message);
			return false;
		}

		//write jst code into output
		fs.writeFile(output, html, 'utf8', function (wErr) {
			if (wErr) {
				triggerError(wErr.message);
			} else {
				emitter.emit('done');
				emitter.emit('always');
			}
		});
	});
};

/**
 * compile file with system command
 * @param  {Object}   file    compile file object
 * @param  {Object}   emitter  compile event emitter
 */
JadeCompiler.prototype.compileWithCommand = function (file, emitter) {
	var exec         = require('child_process').exec,
		self         = this,
		filePath     = file.src,
		output       = file.output,
		settings = file.settings || {},
		argv = [
		'< "' + filePath + '"',
		'> "' + output + '"'
		];

	if(settings.prettyHtml) {
		argv = ['--pretty'].concat(argv);
	}

	var globalSettings  = this.getGlobalSettings(),
		jadePath = globalSettings.advanced.commandPath || 'jade';

	if (jadePath.match(/ /)) {
		jadePath = '"'+ jadePath +'"';
	}

	global.debug(jadePath);
	exec([jadePath].concat(argv).join(' '), {cwd: path.dirname(filePath), timeout: 5000}, function (error, stdout, stderr) {
		if (error !== null) {
			emitter.emit('fail');
			self.throwError(stderr, filePath);
		} else {
			emitter.emit('done');
		}

		// do always handler
		emitter.emit('always');
	});
};
