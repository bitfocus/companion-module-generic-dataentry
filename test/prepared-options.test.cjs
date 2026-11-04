const assert = require('node:assert/strict')
const { test } = require('node:test')
const defineActions = require('../actions')

function fixture() {
	const self = {
		config: { maxlength: 64, cursor: '|' },
		entry_raw: '',
		entry_raw_length: 0,
		entry_cursor_position: 0,
		modifier: { 1: {}, 2: {} },
		setActionDefinitions(actions) {
			this.actions = actions
		},
		parseVariablesInString() {
			throw new Error('host already prepared action options')
		},
		formatData: async (value) => value,
		setVariableValues() {},
		checkEnter() {},
		checkFeedbacks() {},
	}
	defineActions(self)
	return self
}

test('prepared action text remains literal and numeric values become strings', async () => {
	const self = fixture()
	await self.actions.insertData.callback({ options: { position: 0, data0: '$(custom:nested)' } })
	assert.equal(self.entry_raw, '$(custom:nested)')
	await self.actions.setData.callback({ options: { data: '$(custom:nested)' } })
	assert.equal(self.entry_raw, '$(custom:nested)')
	await self.actions.setData.callback({ options: { data: 42 } })
	assert.equal(self.entry_raw, '42')
	await self.actions.insertData.callback({ options: { position: 1, data0: 0 } })
	assert.equal(self.entry_raw, '402')
})
