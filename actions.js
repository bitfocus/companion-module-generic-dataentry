const { splice } = require('./upgrades');

module.exports = function (self) {
	self.setActionDefinitions({
		insertData: {
			name: 'Insert Data',
			options: [
				{
					id: 'data0',
					type: 'textinput',
					label: 'Data without modifier',
					default: '',
					useVariables: true,
				},
				{
					id: 'data1type',
					type: 'checkbox',
					label: 'Use different data with modifier 1',
					default: false,
				},
				{
					id: 'data1',
					type: 'textinput',
					label: 'Data with modifier 1',
					default: '',
					useVariables: true,
					isVisible: (opt) => opt.data1type,
				},
				{
					id: 'data2type',
					type: 'checkbox',
					label: 'Use different data with modifier 2',
					default: false,
				},
				{
					id: 'data2',
					type: 'textinput',
					label: 'Data with modifier 2',
					default: '',
					useVariables: true,
					isVisible: (opt) => opt.data2type,
				},
				{
					id: 'data3type',
					type: 'checkbox',
					label: 'Use different data with modifier 1+2',
					default: false,
				},
				{
					id: 'data3',
					type: 'textinput',
					label: 'Data with modifier 1+2',
					default: '',
					useVariables: true,
					isVisible: (opt) => opt.data3type,
				},
				{
					id: 'position',
					type: 'textinput',
					label: 'Insert Position',
					default: 'cursor',
					useVariables: true,
					tooltip:
						'any positive number counts from start, any negative number counts from end, anything not a number uses the cursor position',
				},
			],
			callback: async ({ options }) => {
				// Calculate insertion position
				let posstring = await self.parseVariablesInString(options.position);
				let pos = parseInt(posstring);
				if (isNaN(pos)) {
					pos = self.entry_cursor_position;
				} else {
					if (pos > 0) pos = Math.min(pos, self.entry_raw_length);
					else if (pos < 0) pos = Math.max(self.entry_raw_length - pos, 0);
					else {
						if (posstring.charAt(0) === '-') pos = self.entry_raw_length;
						else pos = 0;
					}
				}

				// Find data to insert
				let data = '';
				if (self.modifier[1].effective && self.modifier[2].effective) {
					if (options.data3type) data = await self.parseVariablesInString(options.data3);
					else data = await self.parseVariablesInString(options.data0);
				} else if (!self.modifier[1].effective && self.modifier[2].effective) {
					if (options.data2type) data = await self.parseVariablesInString(options.data2);
					else data = await self.parseVariablesInString(options.data0);
				} else if (self.modifier[1].effective && !self.modifier[2].effective) {
					if (options.data1type) data = await self.parseVariablesInString(options.data1);
					else data = await self.parseVariablesInString(options.data0);
				} else {
					data = await self.parseVariablesInString(options.data0);
				}

				// Do insertion
				self.entry_raw = self.entry_raw.slice(0, pos) + data + self.entry_raw.slice(pos);
				self.entry_cursor_position = pos + data.length;

				self.entry_raw_length = self.entry_raw.length;

				// Truncate if necessary
				if (self.entry_raw_length > self.config.maxlength) {
					self.entry_raw = self.entry_raw.slice(0, self.config.maxlength);
					self.entry_raw_length = self.config.maxlength;
				}
				if (self.entry_cursor_position > self.config.maxlength) {
					self.entry_cursor_position = self.config.maxlength;
				}

				// Update variables
				self.entry_formatted = await self.formatData(self.entry_raw);
				self.entry_cursor =
					self.entry_raw.slice(0, self.entry_cursor_position) +
					self.config.cursor +
					self.entry_raw.slice(self.entry_cursor_position);
				self.setVariableValues({
					entry_raw: self.entry_raw,
					entry_raw_length: self.entry_raw_length,
					entry_formatted: self.entry_formatted,
					entry_cursor: self.entry_cursor,
					entry_cursor_position: self.entry_cursor_position,
				});

				// Check enter criteria
				self.checkEnter();
				if (self.config.autotime) {
					self.restartTimeout();
				}

				// Check feedback 'valid'
				self.checkFeedbacks('valid');

				// Release onetime modifiers
				let didrelease = false;
				for (const idx of [1, 2]) {
					if (self.modifier[idx].onetime) {
						self.releaseModifier(idx);
						didrelease = true;
					}
				}
				if (didrelease) self.checkFeedbacks('modifier');
			},
		},

		overwriteData: {
			name: 'Overwrite Data',
			options: [
				{
					id: 'data0',
					type: 'textinput',
					label: 'Data without modifier',
					default: '',
					useVariables: true,
				},
				{
					id: 'data1type',
					type: 'checkbox',
					label: 'Use different data with modifier 1',
					default: false,
				},
				{
					id: 'data1',
					type: 'textinput',
					label: 'Data with modifier 1',
					default: '',
					useVariables: true,
					isVisible: (opt) => opt.data1type,
				},
				{
					id: 'data2type',
					type: 'checkbox',
					label: 'Use different data with modifier 2',
					default: false,
				},
				{
					id: 'data2',
					type: 'textinput',
					label: 'Data with modifier 2',
					default: '',
					useVariables: true,
					isVisible: (opt) => opt.data2type,
				},
				{
					id: 'data3type',
					type: 'checkbox',
					label: 'Use different data with modifier 1+2',
					default: false,
				},
				{
					id: 'data3',
					type: 'textinput',
					label: 'Data with modifier 1+2',
					default: '',
					useVariables: true,
					isVisible: (opt) => opt.data3type,
				},
				{
					id: 'startposition',
					type: 'textinput',
					label: 'Start Position',
					default: 'cursor',
					useVariables: true,
					tooltip:
						'any positive number counts from start, any negative number counts from end, anything not a number uses the cursor position',
				},
				{
					id: 'endposition',
					type: 'textinput',
					label: 'End Position',
					default: '',
					useVariables: true,
					tooltip:
						'empty will overwrite with all data and occasionally increase length, any positive number counts from start, any negative number counts from end, use -0 to limit to existing length, anything not a number uses the cursor position',
				},
			],
			callback: async ({ options }) => {
				// Calculate start position
				let startstring = await self.parseVariablesInString(options.startposition);
				let start = parseInt(startstring);
				if (isNaN(start)) {
					start = self.entry_cursor_position;
				} else {
					if (start > 0) start = Math.min(start, self.entry_raw_length);
					else if (start < 0) start = Math.max(self.entry_raw_length - start, 0);
					else {
						if (startstring.charAt(0) === '-') start = self.entry_raw_length;
						else start = 0;
					}
				}

				// Calculate end position
				let endstring = await self.parseVariablesInString(options.position);
				let end;
				if (endstring === '') {
					end = null;
				} else {
					end = parseInt(endstring);
					if (isNaN(end)) {
						end = self.entry_cursor_position;
					} else {
						if (end > 0) end = Math.min(end, self.entry_raw_length);
						else if (end < 0) end = Math.max(self.entry_raw_length - end, 0);
						else {
							if (endstring.charAt(0) === '-') end = self.entry_raw_length;
							else end = 0;
						}
					}
				}

				// Find data to overwrite
				let data = '';
				if (self.modifier[1].effective && self.modifier[2].effective) {
					if (options.data3type) data = await self.parseVariablesInString(options.data3);
					else data = await self.parseVariablesInString(options.data0);
				} else if (!self.modifier[1].effective && self.modifier[2].effective) {
					if (options.data2type) data = await self.parseVariablesInString(options.data2);
					else data = await self.parseVariablesInString(options.data0);
				} else if (self.modifier[1].effective && !self.modifier[2].effective) {
					if (options.data1type) data = await self.parseVariablesInString(options.data1);
					else data = await self.parseVariablesInString(options.data0);
				} else {
					data = await self.parseVariablesInString(options.data0);
				}

				if (end !== null) {
					let overwritelength = end - start;
					if (overwritelength < data.length) {
						data = data.slice(0, overwritelength);
					}
				}

				// Do overwrite
				if (start + data.length > self.entry_raw_length) {
					self.entry_raw = self.entry_raw.slice(0, start) + data;
				} else {
					self.entry_raw = self.entry_raw.slice(0, start) + data + self.entry_raw.slice(start + data.length);
				}

				self.entry_cursor_position = start + data.length;
				self.entry_raw_length = self.entry_raw.length;

				// Truncate if necessary
				if (self.entry_raw_length > self.config.maxlength) {
					self.entry_raw = self.entry_raw.slice(0, self.config.maxlength);
					self.entry_raw_length = self.config.maxlength;
				}
				if (self.entry_cursor_position > self.config.maxlength) {
					self.entry_cursor_position = self.config.maxlength;
				}

				// Update variables
				self.entry_formatted = await self.formatData(self.entry_raw);
				self.entry_cursor =
					self.entry_raw.slice(0, self.entry_cursor_position) +
					self.config.cursor +
					self.entry_raw.slice(self.entry_cursor_position);
				self.setVariableValues({
					entry_raw: self.entry_raw,
					entry_raw_length: self.entry_raw_length,
					entry_formatted: self.entry_formatted,
					entry_cursor: self.entry_cursor,
					entry_cursor_position: self.entry_cursor_position,
				});

				// Check enter criteria
				self.checkEnter();
				if (self.config.autotime) {
					self.restartTimeout();
				}

				// Check feedback 'valid'
				self.checkFeedbacks('valid');

				// Release onetime modifiers
				let didrelease = false;
				for (const idx of [1, 2]) {
					if (self.modifier[idx].onetime) {
						self.releaseModifier(idx);
						didrelease = true;
					}
				}
				if (didrelease) self.checkFeedbacks('modifier');
			},
		},

		deleteData: {
			name: 'Delete Data',
			options: [
				{
					id: 'amount',
					type: 'number',
					label: 'Amount to delete',
					default: -1,
					min: -65536,
					max: 65536,
					step: 1,
					tooltip: 'negative numbers delete to the left, positive numbers delete to the right',
				},
				{
					id: 'position',
					type: 'textinput',
					label: 'Position',
					default: 'cursor',
					useVariables: true,
					tooltip:
						'any positive number counts from start, any negative number counts from end, anything not a number uses the cursor position',
				},
			],
			callback: async ({ options }) => {
				// Calculate position
				let posstring = await self.parseVariablesInString(options.position);
				let pos = parseInt(posstring);
				if (isNaN(pos)) {
					pos = self.entry_cursor_position;
				} else {
					if (pos > 0) pos = Math.min(pos, self.entry_raw_length);
					else if (pos < 0) pos = Math.max(self.entry_raw_length - pos, 0);
					else {
						if (posstring.charAt(0) === '-') pos = self.entry_raw_length;
						else pos = 0;
					}
				}

				// Do deletion
				if (options.amount > 0) {
					self.entry_raw =
						self.entry_raw.slice(0, pos) + self.entry_raw.slice(Math.min(pos + options.amount, self.entry_raw_length));
					self.entry_cursor_position = pos;
				} else if (options.amount < 0) {
					let leftleftover = Math.max(pos + options.amount, 0);
					self.entry_raw = self.entry_raw.slice(0, leftleftover) + self.entry_raw.slice(pos);
					self.entry_cursor_position = leftleftover;
				}

				self.entry_raw_length = self.entry_raw.length;

				// Update variables
				self.entry_formatted = await self.formatData(self.entry_raw);
				self.entry_cursor =
					self.entry_raw.slice(0, self.entry_cursor_position) +
					self.config.cursor +
					self.entry_raw.slice(self.entry_cursor_position);
				self.setVariableValues({
					entry_raw: self.entry_raw,
					entry_raw_length: self.entry_raw_length,
					entry_formatted: self.entry_formatted,
					entry_cursor: self.entry_cursor,
					entry_cursor_position: self.entry_cursor_position,
				});

				// Check enter criteria
				self.checkEnter();
				if (self.config.autotime) {
					self.restartTimeout();
				}

				// Check feedback 'valid'
				self.checkFeedbacks('valid');

				// Release onetime modifiers
				let didrelease = false;
				for (const idx of [1, 2]) {
					if (self.modifier[idx].onetime) {
						self.releaseModifier(idx);
						didrelease = true;
					}
				}
				if (didrelease) self.checkFeedbacks('modifier');
			},
		},

		setData: {
			name: 'Set Data',
			options: [
				{
					id: 'data',
					type: 'textinput',
					label: 'Data',
					default: '',
					useVariables: true,
				},
			],
			callback: async ({ options }) => {
				let data = await self.parseVariablesInString(options.data);

				// Do set
				self.entry_raw = data;

				self.entry_cursor_position = data.length;

				// Truncate if necessary
				if (self.entry_raw_length > self.config.maxlength) {
					self.entry_raw = self.entry_raw.slice(0, self.config.maxlength);
					self.entry_raw_length = self.config.maxlength;
				}
				if (self.entry_cursor_position > self.config.maxlength) {
					self.entry_cursor_position = self.config.maxlength;
				}

				self.entry_raw_length = self.entry_raw.length;

				// Update variables
				self.entry_formatted = await self.formatData(self.entry_raw);
				self.entry_cursor =
					self.entry_raw.slice(0, self.entry_cursor_position) +
					self.config.cursor +
					self.entry_raw.slice(self.entry_cursor_position);
				self.setVariableValues({
					entry_raw: self.entry_raw,
					entry_raw_length: self.entry_raw_length,
					entry_formatted: self.entry_formatted,
					entry_cursor: self.entry_cursor,
					entry_cursor_position: self.entry_cursor_position,
				});

				// Check enter criteria
				self.checkEnter();
				if (self.config.autotime) {
					self.restartTimeout();
				}

				// Check feedback 'valid'
				self.checkFeedbacks('valid');

				// Release onetime modifiers
				let didrelease = false;
				for (const idx of [1, 2]) {
					if (self.modifier[idx].onetime) {
						self.releaseModifier(idx);
						didrelease = true;
					}
				}
				if (didrelease) self.checkFeedbacks('modifier');
			},
		},

		normalizeEntry: {
			name: 'Normalize Unicode',
			options: [],
			callback: async () => {
				let beforeCursor = self.entry_raw.slice(0, self.entry_cursor_position);
				let afterCursor = self.entry_raw.slice(self.entry_cursor_position);
				beforeCursor = beforeCursor.normalize();
				afterCursor = afterCursor.normalize();
				self.entry_cursor_position = beforeCursor.length;
				self.entry_raw = beforeCursor + afterCursor;

				// Truncate if necessary
				if (self.entry_raw_length > self.config.maxlength) {
					self.entry_raw = self.entry_raw.slice(0, self.config.maxlength);
					self.entry_raw_length = self.config.maxlength;
				}
				if (self.entry_cursor_position > self.config.maxlength) {
					self.entry_cursor_position = self.config.maxlength;
				}

				self.entry_raw_length = self.entry_raw.length;

				// Update variables
				self.entry_formatted = await self.formatData(self.entry_raw);
				self.entry_cursor = beforeCursor + self.config.cursor + afterCursor;
				self.setVariableValues({
					entry_raw: self.entry_raw,
					entry_raw_length: self.entry_raw_length,
					entry_formatted: self.entry_formatted,
					entry_cursor: self.entry_cursor,
					entry_cursor_position: self.entry_cursor_position,
				});
			},
		},

		cursorPosition: {
			name: 'Set Cursor Cosition',
			options: [
				{
					id: 'operation',
					type: 'dropdown',
					label: 'Operation',
					choices: [
						{ id: 'inc', label: 'Incremental' },
						{ id: 'abs', label: 'Absolute' },
					],
					default: 'inc',
				},
				{
					id: 'amount',
					type: 'number',
					label: 'Movement',
					default: 0,
					min: -65536,
					max: 65536,
					step: 1,
				},
			],
			callback: async ({ options }) => {
				// Calculate position
				let pos = self.entry_cursor_position;
				if (options.operation === 'abs') {
					pos = options.amount;
				} else if (options.operation === 'inc') {
					pos += options.amount;
				}

				pos = Math.min(pos, self.entry_raw.length);
				pos = Math.max(pos, 0);

				self.entry_cursor_position = pos;

				if (self.config.autotime) {
					self.restartTimeout();
				}

				// Update variables
				self.entry_cursor =
					self.entry_raw.slice(0, self.entry_cursor_position) +
					self.config.cursor +
					self.entry_raw.slice(self.entry_cursor_position);
				self.setVariableValues({
					entry_cursor: self.entry_cursor,
					entry_cursor_position: self.entry_cursor_position,
				});
			},
		},

		enterData: {
			name: 'Enter Data',
			options: [
				{
					id: 'copy',
					type: 'dropdown',
					label: 'Action',
					choices: [
						{ id: 'default', label: 'Do default copy' },
						{ id: 'raw', label: 'Copy raw data' },
						{ id: 'formatted', label: 'Copy formatted data' },
						{ id: 'none', label: 'Do only increase counter' },
					],
					default: 'default',
				},
			],
			callback: async ({ options }) => {
				self.cancelTimeout();

				if (options.copy === 'default') self.enter();
				else self.enter(options.copy);

				// Release onetime modifiers
				let didrelease = false;
				for (const idx of [1, 2]) {
					if (self.modifier[idx].onetime) {
						self.releaseModifier(idx);
						didrelease = true;
					}
				}
				if (didrelease) self.checkFeedbacks('modifier');
			},
		},

		changeModifier: {
			name: 'Change Modifier',
			options: [
				{
					id: 'modifier',
					type: 'dropdown',
					label: 'Modifier',
					choices: [
						{ id: 1, label: 'Modifier 1' },
						{ id: 2, label: 'Modifier 2' },
					],
					default: 1,
				},
				{
					id: 'action',
					type: 'dropdown',
					label: 'Action',
					choices: [
						{ id: 'set', label: 'set this button' },
						{ id: 'release', label: 'release this button' },
						{ id: 'releaseall', label: 'release all buttons' },
						{ id: 'toggle', label: 'toggle this button' },
						{ id: 'toggleall', label: 'toggle modifier (set this / release all)' },
						{ id: 'onetime', label: 'set for one modification' },
					],
					default: 'onetime',
				},
			],
			callback: ({ options, controlId }) => {
				const me = `${controlId}`;
				switch (options.action) {
				case 'set':
					self.modifier[options.modifier].controls.add(me);
					self.modifier[options.modifier].effective = true;
					self.modifier[options.modifier].onetime = false;
					break;

				case 'release':
					self.modifier[options.modifier].controls.delete(me);
					self.modifier[options.modifier].effective = self.modifier[options.modifier].controls.size ? true : false;
					self.modifier[options.modifier].onetime = false;
					break;

				case 'releaseall':
					self.modifier[options.modifier].controls.clear();
					self.modifier[options.modifier].effective = false;
					self.modifier[options.modifier].onetime = false;
					break;

				case 'toggle':
					if (self.modifier[options.modifier].controls.has(me)) {
						self.modifier[options.modifier].controls.delete(me);
					} else {
						self.modifier[options.modifier].controls.add(me);
					}
					self.modifier[options.modifier].effective = self.modifier[options.modifier].controls.size ? true : false;
					self.modifier[options.modifier].onetime = false;
					break;

				case 'toggleall':
					if (self.modifier[options.modifier].controls.size) {
						self.modifier[options.modifier].controls.clear();
						self.modifier[options.modifier].effective = false;
					} else {
						self.modifier[options.modifier].controls.add(me);
						self.modifier[options.modifier].effective = true;
					}
					self.modifier[options.modifier].onetime = false;
					break;

				case 'onetime':
					if (self.modifier[options.modifier].controls.size) {
						self.modifier[options.modifier].controls.clear();
						self.modifier[options.modifier].effective = false;
						self.modifier[options.modifier].onetime = false;
					} else {
						self.modifier[options.modifier].controls.add(me);
						self.modifier[options.modifier].effective = true;
						self.modifier[options.modifier].onetime = true;
					}
					break;
				}
				self.checkFeedbacks('modifier');
				// self.log('debug', `Modifier ${options.modifier} has ${Array.from(self.modifier[options.modifier].controls)}`)
			},
		},

		cancelTimeout: {
			name: 'Cancel Timeout',
			options: [],
			callback: () => {
				self.cancelTimeout();
			},
		},

		setEnterCriteria: {
			name: 'Set Enter Criteria',
			options: [
				{
					id: 'autolengthraw',
					label: 'Automatic enter when raw length is reached',
					type: 'checkbox',
					default: self.config.autolengthraw || false,
				},
				{
					type: 'number',
					id: 'enterlengthraw',
					label: 'Length',
					min: 1,
					max: 65536,
					step: 1,
					default: self.config.enterlengthraw || 4,
					isVisible: (conf) => {
						return conf.autolengthraw === true;
					},
				},
				{
					id: 'autolengthformatted',
					label: 'Automatic enter when formatted length is reached',
					type: 'checkbox',
					default: self.config.autolengthformatted || false,
				},
				{
					type: 'number',
					id: 'enterlengthformatted',
					label: 'Length',
					min: 1,
					max: 65536,
					step: 1,
					default: self.config.enterlengthformatted || 4,
					isVisible: (conf) => {
						return conf.autolengthformatted === true;
					},
				},
				{
					id: 'autoregex',
					label: 'Automatic enter when regular expression matches',
					type: 'checkbox',
					default: self.config.autoregex || false,
				},
				{
					id: 'enterregex',
					label: 'Regular expression',
					type: 'textinput',
					default: self.config.enterregex || '/.*/i',
					regex: '/^/(.+)\\/([gmiyusvd]?)$/',
					isVisible: (conf) => {
						return conf.autoregex === true;
					},
				},
				{
					id: 'autotime',
					label: 'Automatic enter after inactivity timeout',
					type: 'checkbox',
					default: self.config.autotime || false,
				},
				{
					type: 'number',
					id: 'timeout',
					label: 'Timeout (s)',
					min: 0.1,
					max: 30,
					step: 0.1,
					default: self.config.timeout || 2.5,
					isVisible: (conf) => {
						return conf.autotime === true;
					},
				},
				{
					type: 'dropdown',
					id: 'criterialogic',
					label: 'Enter Criteria',
					choices: [
						{ id: 'or', label: 'Any checked criterion is met (OR)' },
						{ id: 'and', label: 'All checked cruteria are met (AND)' },
					],
					default: self.config.criterialogic || 'or',
				},
			],
			callback: async ({ options }) => {
				const newconfig = {
					...self.config,
					...options,
				};
				self.config = newconfig;
				self.saveConfig(newconfig);
				self.updateActions();
			},
		},

		setFormat: {
			name: 'Set Format',
			options: [
				{
					type: 'dropdown',
					id: 'formattype',
					label: 'Format Type',
					choices: [
						{ id: 'none', label: 'None' },
						{ id: 'ecmaauto', label: 'ECMA-376 automatic' },
						{ id: 'ecmastring', label: 'ECMA-376 text' },
						{ id: 'ecmanumber', label: 'ECMA-376 number' },
						{ id: 'ecmadate', label: 'ECMA-376 date' },
						{ id: 'ecmatime', label: 'ECMA-376 time' },
						{ id: 'ecmabool', label: 'ECMA-376 boolean' },
						{ id: 'printf', label: 'Printf format' },
						{ id: 'regex', label: 'Regular Expression' },
					],
					default: self.config.formattype,
				},
				{
					type: 'textinput',
					id: 'formatecma',
					label: 'ECMA-376 format expression',
					default: self.config.formatecma,
					useVariables: true,
					isVisible: (opt) => {
						return opt.formattype.startsWith('ecma');
					},
				},
				{
					type: 'textinput',
					id: 'formatprintf',
					label: 'printf format expression',
					default: self.config.formatfrintf,
					useVariables: true,
					isVisible: (opt) => {
						return opt.formattype === 'printf';
					},
				},
				{
					type: 'textinput',
					id: 'formatregex',
					label: 'Regular replacement expression',
					default: self.config.formatregex,
					useVariables: true,
					isVisible: (opt) => {
						return opt.formattype === 'regex';
					},
				},
			],
			callback: async ({ options }) => {
				const newconfig = {
					...self.config,
					...options,
				};
				self.config = newconfig;
				self.saveConfig(newconfig);
				self.updateActions();

				// Update variables
				self.entry_formatted = await self.formatData(self.entry_raw);
				self.setVariableValues({
					entry_formatted: self.entry_formatted,
				});
			},
		},
	});
};
