const { combineRgb } = require('@companion-module/base')

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
			feedbacks = [],
			desc = '',
			size = '44',
			button = ''
		if (Array.isArray(opt)) {
			data0 = opt[0].toString()
			desc = data0
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
		} else if (typeof opt === 'object') {
			data0 = opt.data0
			desc = opt.desc || data0
			button = opt.button || data0
			if (opt.size) size = opt.size.toString()
		} else {
			data0 = opt.toString()
			desc = data0
		}
		presets[`${cat}${desc}`] = {
			type: 'button',
			category: `${cat}`,
			name: `Insert ${desc}`,
			style: {
				text: `${data0}`,
				size,
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(10, 10, 10),
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
		makePreset(i, 'Numpad')
	}
	makePreset(',', 'Numpad')
	makePreset('.', 'Numpad')

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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
					bgcolor: combineRgb(100, 100, 100),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
					bgcolor: combineRgb(100, 100, 100),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
					bgcolor: combineRgb(100, 100, 100),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
					bgcolor: combineRgb(100, 100, 100),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(10, 10, 10),
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

	const diacritics = [
		{ data0: '\u0300', button: ' ̀', desc: 'Combining Grave Accent' },
		{ data0: '\u0301', button: ' ́', desc: 'Combining Acute Accent ' },
		{ data0: '\u0302', button: ' ̂', desc: 'Combining Circumflex Accent' },
		{ data0: '\u0303', button: ' ̃', desc: 'Combining Tilde' },
		{ data0: '\u0304', button: ' ̄', desc: 'Combining Macron' },
		{ data0: '\u0305', button: ' ̅', desc: 'Combining Overline' },
		{ data0: '\u0306', button: ' ̆', desc: 'Combining Breve' },
		{ data0: '\u0307', button: ' ̇', desc: 'Combining Dot Above' },
		{ data0: '\u0308', button: ' ̈', desc: 'Combining Diaeresis' },
		{ data0: '\u0309', button: ' ̉', desc: 'Combining Hook Above' },
		{ data0: '\u030A', button: ' ̊', desc: 'Combining Ring Above' },
		{ data0: '\u030B', button: ' ̋', desc: 'Combining Double Acute Accent' },
		{ data0: '\u030C', button: ' ̌', desc: 'Combining Caron' },
		{ data0: '\u030D', button: ' ̍', desc: 'Combining Vertical Line Above' },
		{ data0: '\u030E', button: ' ̎', desc: 'Combining Double Vertical Line Above' },
		{ data0: '\u030F', button: ' ̏', desc: 'Combining Double Grave Accent' },
		{ data0: '\u0310', button: ' ̐', desc: 'Combining Candrabindu' },
		{ data0: '\u0311', button: ' ̑', desc: 'Combining Inverted Breve' },
		{ data0: '\u0312', button: ' ̒', desc: 'Combining Turned Comma Above' },
		{ data0: '\u0313', button: ' ̓', desc: 'Combining Comma Above' },
		{ data0: '\u0314', button: ' ̔', desc: 'Combining Reversed Comma Above' },
		{ data0: '\u0315', button: ' ̕', desc: 'Combining Comma Above Right' },
		{ data0: '\u0316', button: ' ̖', desc: 'Combining Grave Accent Below' },
		{ data0: '\u0317', button: ' ̗', desc: 'Combining Acute Accent Below' },
		{ data0: '\u0318', button: ' ̘', desc: 'Combining Left Tack Below' },
		{ data0: '\u0319', button: ' ̙', desc: 'Combining Right Tack Below' },
		{ data0: '\u031A', button: ' ̚', desc: 'Combining Left Angle Above' },
		{ data0: '\u031B', button: ' ̛', desc: 'Combining Horn' },
		{ data0: '\u031C', button: ' ̜', desc: 'Combining Left Half Ring Below' },
		{ data0: '\u031D', button: ' ̝', desc: 'Combining Up Tack Below' },
		{ data0: '\u031E', button: ' ̞', desc: 'Combining Down Tack Below' },
		{ data0: '\u031F', button: ' ̟', desc: 'Combining Plus Sign Below' },
		{ data0: '\u0320', button: ' ̠', desc: 'Combining Minus Sign Below' },
		{ data0: '\u0321', button: ' ̡', desc: 'Combining Palatalized Hook Below' },
		{ data0: '\u0322', button: ' ̢', desc: 'Combining Retroflex Hook Below' },
		{ data0: '\u0323', button: ' ̣', desc: 'Combining Dot Below' },
		{ data0: '\u0324', button: ' ̤', desc: 'Combining Diaeresis Below' },
		{ data0: '\u0325', button: ' ̥', desc: 'Combining Ring Below' },
		{ data0: '\u0326', button: ' ̦', desc: 'Combining Comma Below' },
		{ data0: '\u0327', button: ' ̧', desc: 'Combining Cedilla' },
		{ data0: '\u0328', button: ' ̨', desc: 'Combining Ogonek' },
		{ data0: '\u0329', button: ' ̩', desc: 'Combining Vertical Line Below' },
		{ data0: '\u032A', button: ' ̪', desc: 'Combining Bridge Below' },
		{ data0: '\u032B', button: ' ̫', desc: 'Combining Inverted Double Arch Below' },
		{ data0: '\u032C', button: ' ̬', desc: 'Combining Caron Below' },
		{ data0: '\u032D', button: ' ̭', desc: 'Combining Circumflex Accent Below' },
		{ data0: '\u032E', button: ' ̮', desc: 'Combining Breve Below' },
		{ data0: '\u032F', button: ' ̯', desc: 'Combining Inverted Breve Below' },
		{ data0: '\u0330', button: ' ̰', desc: 'Combining Tilde Below' },
		{ data0: '\u0331', button: ' ̱', desc: 'Combining Macron Below' },
		{ data0: '\u0332', button: ' ̲', desc: 'Combining Low Line' },
		{ data0: '\u0333', button: ' ̳', desc: 'Combining Double Low Line' },
		{ data0: '\u0334', button: ' ̴', desc: 'Combining Tilde Overlay' },
		{ data0: '\u0335', button: ' ̵', desc: 'Combining Short Stroke Overlay' },
		{ data0: '\u0336', button: ' ̶', desc: 'Combining Long Stroke Overlay' },
		{ data0: '\u0337', button: ' ̷', desc: 'Combining Short Solidus Overlay' },
		{ data0: '\u0338', button: ' ̸', desc: 'Combining Long Solidus Overlay' },
		{ data0: '\u0339', button: ' ̹', desc: 'Combining Right Half Ring Below' },
		{ data0: '\u033A', button: ' ̺', desc: 'Combining Inverted Bridge Below' },
		{ data0: '\u033B', button: ' ̻', desc: 'Combining Square Below' },
		{ data0: '\u033C', button: ' ̼', desc: 'Combining Seagull Below' },
		{ data0: '\u033D', button: ' ̽', desc: 'Combining X Above' },
		{ data0: '\u033E', button: ' ̾', desc: 'Combining Vertical Tilde' },
		{ data0: '\u033F', button: ' ̿', desc: 'Combining Double Overline' },
		{ data0: '\u0340', button: ' ̀', desc: 'Combining Grave Tone Mark' },
		{ data0: '\u0341', button: ' ́', desc: 'Combining Acute Tone Mark' },
		{ data0: '\u0342', button: ' ͂', desc: 'Combining Greek Perispomeni' },
		{ data0: '\u0343', button: ' ̓', desc: 'Combining Greek Koronis' },
		{ data0: '\u0344', button: ' ̈́', desc: 'Combining Greek Dialytika Tonos' },
		{ data0: '\u0345', button: ' ͅ', desc: 'Combining Greek Ypogegrammeni' },
		{ data0: '\u0346', button: ' ͆', desc: 'Combining Bridge Above' },
		{ data0: '\u0347', button: ' ͇', desc: 'Combining Equals Sign Below' },
		{ data0: '\u0348', button: ' ͈', desc: 'Combining Double Vertical Line Below' },
		{ data0: '\u0349', button: ' ͉', desc: 'Combining Left Angle Below' },
		{ data0: '\u034A', button: ' ͊', desc: 'Combining Not Tilde Above' },
		{ data0: '\u034B', button: ' ͋', desc: 'Combining Homothetic Above' },
		{ data0: '\u034C', button: ' ͌', desc: 'Combining Almost Equal To Above' },
		{ data0: '\u034D', button: ' ͍', desc: 'Combining Left Right Arrow Below' },
		{ data0: '\u034E', button: ' ͎', desc: 'Combining Upwards Arrow Below' },
		{ data0: '\u034F', button: ' ͏', desc: 'Combining Grapheme Joiner' },
		{ data0: '\u0350', button: ' ͐', desc: 'Combining Right Arrowhead Above' },
		{ data0: '\u0351', button: ' ͑', desc: 'Combining Left Half Ring Above' },
		{ data0: '\u0352', button: ' ͒', desc: 'Combining Fermata' },
		{ data0: '\u0353', button: ' ͓', desc: 'Combining X Below' },
		{ data0: '\u0354', button: ' ͔', desc: 'Combining Left Arrowhead Below' },
		{ data0: '\u0355', button: ' ͕', desc: 'Combining Right Arrowhead Below' },
		{ data0: '\u0356', button: ' ͖', desc: 'Combining Right Arrowhead And Up Arrowhead Below' },
		{ data0: '\u0357', button: ' ͗', desc: 'Combining Right Half Ring Above' },
		{ data0: '\u0358', button: ' ͘', desc: 'Combining Dot Above Right' },
		{ data0: '\u0359', button: ' ͙', desc: 'Combining Asterisk Below' },
		{ data0: '\u035A', button: ' ͚', desc: 'Combining Double Ring Below' },
		{ data0: '\u035B', button: ' ͛', desc: 'Combining Zigzag Above' },
		{ data0: '\u035C', button: ' ͜', desc: 'Combining Double Breve Below' },
		{ data0: '\u035D', button: ' ͝', desc: 'Combining Double Breve' },
		{ data0: '\u035E', button: ' ͞', desc: 'Combining Double Macron' },
		{ data0: '\u035F', button: ' ͟', desc: 'Combining Double Macron Below' },
		{ data0: '\u0360', button: ' ͠', desc: 'Combining Double Tilde' },
		{ data0: '\u0361', button: ' ͡', desc: 'Combining Double Inverted Breve' },
		{ data0: '\u0362', button: ' ͢', desc: 'Combining Double Rightwards Arrow Below' },
		{ data0: '\u0363', button: ' ͣ', desc: 'Combining Latin Small Letter A' },
		{ data0: '\u0364', button: ' ͤ', desc: 'Combining Latin Small Letter E' },
		{ data0: '\u0365', button: ' ͥ', desc: 'Combining Latin Small Letter I' },
		{ data0: '\u0366', button: ' ͦ', desc: 'Combining Latin Small Letter O' },
		{ data0: '\u0367', button: ' ͧ', desc: 'Combining Latin Small Letter U' },
		{ data0: '\u0368', button: ' ͨ', desc: 'Combining Latin Small Letter C' },
		{ data0: '\u0369', button: ' ͩ', desc: 'Combining Latin Small Letter D' },
		{ data0: '\u036A', button: ' ͪ', desc: 'Combining Latin Small Letter H' },
		{ data0: '\u036B', button: ' ͫ', desc: 'Combining Latin Small Letter M' },
		{ data0: '\u036C', button: ' ͬ', desc: 'Combining Latin Small Letter R' },
		{ data0: '\u036D', button: ' ͭ', desc: 'Combining Latin Small Letter T' },
		{ data0: '\u036E', button: ' ͮ', desc: 'Combining Latin Small Letter V' },
		{ data0: '\u036F', button: ' ͯ', desc: 'Combining Latin Small Letter X ' },
	]

	for (const dia of diacritics) {
		makePreset({ ...dia, size: '30' }, 'Diacritics')
		presets[`Diacritics${dia.desc}`].steps[0].down.push({
			actionId: 'normalizeEntry',
			options: [],
			delay: 5,
		})
	}

	self.setPresetDefinitions(presets)
}
