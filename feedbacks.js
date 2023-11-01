const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		modifier: {
			name: 'Modifier active',
			type: 'boolean',
			description: 'Shows if a modifier has been set from this control or from any control',
			defaultStyle: {
				bgcolor: 0x555555,
				color: 0x000000,
			},
			options: [
				{
					id: 'modifier',
					type: 'dropdown',
					label: 'Modifier',
					choices: [
						{ id: 1, label: 'Modifier 1' },
						{ id: 2, label: 'Modifier 2' },
						{ id: 3, label: 'Modifier 1+2' },
					],
					default: 1,
				},
				{
					id: 'location',
					type: 'dropdown',
					label: 'Is set on...',
					choices: [
						{ id: 'here', label: '...this button' },
						{ id: 'anywhere', label: '...any button' },
					],
					default: 'anywhere',
				},
			],
			callback: ({ options, controlId }) => {
				if (options.modifier === 1 || options.modifier === 2) {
					if (options.location === 'anywhere') {
						return self.modifier[options.modifier].effective
					} else if (options.location === 'here') {
						return self.modifier[options.modifier].controls.has(controlId)
					}
				} else if (options.modifier === 3) {
					if (options.location === 'anywhere') {
						return self.modifier[1].effective && self.modifier[2].effective
					} else if (options.location === 'here') {
						return self.modifier[1].controls.has(controlId) && self.modifier[2].controls.has(controlId)
					}
				}
			},
		},

		valid: {
			name: 'RegExp Validation',
			type: 'boolean',
			description: 'Shows if data matches a given Regular expression',
			defaultStyle: {
				bgcolor: 0x00c000,
				color: 0x000000,
			},
			options: [
				{
					id: 'data',
					type: 'dropdown',
					label: 'Data to watch',
					choices: [
						{ id: 'raw', label: 'Raw data' },
						{ id: 'formatted', label: 'Formatted Data' },
						{ id: 'raw_last', label: 'Raw_last' },
					],
					default: 'raw',
				},
				{
					id: 'regex',
					type: 'textinput',
					label: 'Regular Expression',
					default: '/.*/',
				},
			],
			callback: ({ options }) => {
				let string = ''
				switch (options.data) {
					case 'raw':
						string = self.entry_raw
						break

					case 'formatted':
						string = self.entry_formatted
						break

					case 'raw_last':
						string = self.entry_raw_last
						break
				}

				return self.buildRegex(options.regex).test(string)
			},
		},
	})
}
