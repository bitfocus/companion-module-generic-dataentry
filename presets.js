module.exports = function (self) {
	const presets = {}

	const makePreset = (opt, cat) => {
		let data0 = '',
			data1 = '',
			data2 = '',
			data3 = '',
			data1type = false,
			data2type = false,
			data3type = false,
			feedbacks = []
		if (Array.isArray(opt)) {
			data0 = opt[0].toString()
			if (opt.length > 1) {
				data1type = true
				data1 = opt[1].toString()
				feedbacks.push({
					feedbackId: 'modifier',
					options: {
						modifier: 1,
						location: 'anywhere',
					},
					style: {
						text: data1,
					},
				})
			}
			if (opt.length > 2) {
				data2type = true
				data2 = opt[2].toString()
				feedbacks.push({
					feedbackId: 'modifier',
					options: {
						modifier: 2,
						location: 'anywhere',
					},
					style: {
						text: data2,
					},
				})
			}
			if (opt.length > 3) {
				data3type = true
				data3 = opt[3].toString()
				feedbacks.push({
					feedbackId: 'modifier',
					options: {
						modifier: 3,
						location: 'anywhere',
					},
					style: {
						text: data3,
					},
				})
			}
		} else {
			data0 = opt.toString()
		}
		presets[`${cat}${data0}`] = {
			type: 'button',
			category: `${cat}`,
			name: `Insert ${data0}`,
			style: {
				text: `${data0}`,
				size: '44',
				color: '#fff',
				bgcolor: 'rgb(10,10,10)',
			},
			steps: [
				{
					down: [
						{
							actionId: 'insertData',
							options: {
								data0,
								data1type,
								data1,
								data2type,
								data2,
								data3type,
								data3,
								position: 'cursor',
							},
						},
					],
					up: [],
				},
			],
			feedbacks,
		}
	}

	for (let i = 0; i <= 9; i += 1) {
		makePreset(i, 'Numbers')
	}
	makePreset(',', 'Numbers')
	makePreset('.', 'Numbers')

	const uskeyb = [
		['a', 'A', 'á', 'Á'],
		['b', 'B', '฿', ''],
		['c', 'C', '©', 'ȼ'],
		['d', 'D', 'đ', 'Ð'],
		['e', 'E', 'é', 'É'],
		['f', 'F', 'f', 'F'],
		['g', 'G', 'g', 'G'],
		['h', 'H', 'h', 'H'],
		['i', 'I', 'í', 'Í'],
		['j', 'J', 'j', 'J'],
		['k', 'K', 'k', 'K'],
		['l', 'L', 'ø', 'Ø'],
		['m', 'M', 'μ', 'Μ'],
		['n', 'N', 'ñ', 'Ñ'],
		['o', 'O', 'ó', 'Ó'],
		['p', 'P', 'ö', 'Ö'],
		['q', 'Q', 'ä', 'Ä'],
		['r', 'R', '®', '℗'],
		['s', 'S', 'ß', '§'],
		['t', 'T', 'ϸ', 'Ϸ'],
		['u', 'U', 'ú', 'Ú'],
		['v', 'V', 'v', 'V'],
		['w', 'W', 'å', 'Å'],
		['x', 'X', 'x', 'X'],
		['y', 'Y', 'ü', 'Ü'],
		['z', 'Z', 'æ', 'Æ'],
		['1', '!', '¡', '¹'],
		['2', '@', '²', '@'],
		['3', '#', '³', '#'],
		['4', '$', '¤', '₤'],
		['5', '%', '€', '‰'],
		['6', ' ̂', '¼', ' ̂'],
		['7', '&', '½', '&'],
		['8', '*', '¾', '*'],
		['9', '(', '‘', '('],
		['0', ')', '’', ')'],
		['-', '_', '¥', '_'],
		['=', '+', '×', '÷'],
		['[', '{', '«', '‹'],
		[']', '}', '»', '›'],
		['\\', '|', '﹁', '¦'],
		[';', ':', '¶', '°'],
		["'", '"', '′', ' ̈'],
		[',', '<', 'ç', 'Ç'],
		['.', '>', '', '>'],
		['/', '?', '¿', '?'],
		['`', '~', '`', '~'],
	]

	for (const key of uskeyb) {
		makePreset(key, 'US Keyboard')
	}
	presets['space'] = {
		type: 'button',
		category: `US Keyboard`,
		name: `Space`,
		style: {
			text: `␣`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'insertData',
						options: {
							data0: ' ',
							data1type: false,
							data1: '',
							data2type: false,
							data2: '',
							data3type: false,
							data3: '',
							position: 'cursor',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_enter'] = {
		type: 'button',
		category: `Control`,
		name: `Enter`,
		style: {
			text: `⏎`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'enterData',
						options: {
							copy: 'default',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_shift'] = {
		type: 'button',
		category: `Control`,
		name: `Shift`,
		style: {
			text: `⇧`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'changeModifier',
						options: {
							modifier: 1,
							action: 'set',
						},
					},
				],
				up: [
					{
						actionId: 'changeModifier',
						options: {
							modifier: 1,
							action: 'release',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'modifier',
				options: {
					modifier: 1,
					location: 'anywhere',
				},
				style: {
					bgcolor: 'rgb(100, 100, 100)',
				},
			},
		],
	}

	presets['control_capslock'] = {
		type: 'button',
		category: `Control`,
		name: `Caps Lock`,
		style: {
			text: `⇪`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'changeModifier',
						options: {
							modifier: 1,
							action: 'toggleall',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'modifier',
				options: {
					modifier: 1,
					location: 'anywhere',
				},
				style: {
					bgcolor: 'rgb(100, 100, 100)',
				},
			},
		],
	}

	presets['control_shiftonetime'] = {
		type: 'button',
		category: `Control`,
		name: `Shift One Time`,
		style: {
			text: `⌤`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'changeModifier',
						options: {
							modifier: 1,
							action: 'onetime',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'modifier',
				options: {
					modifier: 1,
					location: 'anywhere',
				},
				style: {
					bgcolor: 'rgb(100, 100, 100)',
				},
			},
		],
	}

	presets['control_alt'] = {
		type: 'button',
		category: `Control`,
		name: `Alt`,
		style: {
			text: `⌥`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'changeModifier',
						options: {
							modifier: 2,
							action: 'onetime',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'modifier',
				options: {
					modifier: 2,
					location: 'anywhere',
				},
				style: {
					bgcolor: 'rgb(100, 100, 100)',
				},
			},
		],
	}

	presets['control_cursorleft'] = {
		type: 'button',
		category: `Control`,
		name: `Move cursor left`,
		style: {
			text: `🠜`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'cursorPosition',
						options: {
							operation: 'inc',
							amount: -1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_cursorright'] = {
		type: 'button',
		category: `Control`,
		name: `Move cursor right`,
		style: {
			text: `🠞`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'cursorPosition',
						options: {
							operation: 'inc',
							amount: 1,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_cursorstart'] = {
		type: 'button',
		category: `Control`,
		name: `Move cursor to start`,
		style: {
			text: `⇤`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'cursorPosition',
						options: {
							operation: 'abs',
							amount: 0,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_cursorend'] = {
		type: 'button',
		category: `Control`,
		name: `Move cursor to end`,
		style: {
			text: `⇥`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'cursorPosition',
						options: {
							operation: 'abs',
							amount: 65536,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_backspace'] = {
		type: 'button',
		category: `Control`,
		name: `Backspace`,
		style: {
			text: `⌫`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'deleteData',
						options: {
							amount: -1,
							position: 'cursor',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_delete'] = {
		type: 'button',
		category: `Control`,
		name: `Delete`,
		style: {
			text: `⌦`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'deleteData',
						options: {
							amount: 1,
							position: 'cursor',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['control_clear'] = {
		type: 'button',
		category: `Control`,
		name: `Clear Entry`,
		style: {
			text: `⌧`,
			size: '44',
			color: '#fff',
			bgcolor: 'rgb(10, 10, 10)',
		},
		steps: [
			{
				down: [
					{
						actionId: 'setData',
						options: {
							data: '',
						},
					},
					{
						actionId: 'cancelTimeout',
						delay: 10,
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	self.setPresetDefinitions(presets)
}
