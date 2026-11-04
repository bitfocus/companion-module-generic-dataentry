const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { createRequire } = require('node:module')
const { test } = require('node:test')
const { ActionManager } = require(
	path.resolve(path.dirname(require.resolve('@companion-module/base')), 'internal/actions.js'),
)

async function instance(config = {}) {
	const filename = path.resolve(process.env.DATAENTRY_SOURCE || path.resolve(__dirname, '..'), 'main.js')
	const sourceRequire = createRequire(filename)
	let Instance
	const timers = new Map()
	class Base {
		values = {}
		manager = new ActionManager(
			async ({ text }) => ({ text: await this.parseVariablesInString(text) }),
			() => {},
			() => {},
			() => {},
		)
		async execute(actionId, options = {}) {
			const result = await this.manager.handleExecuteAction({
				action: { id: 'test', controlId: 'bank:1', actionId, options },
			})
			assert.equal(result.success, true, result.errorMessage)
		}
		log() {}
		updateStatus() {}
		setActionDefinitions(actions) {
			this.actions = actions
			this.manager.setActionDefinitions(actions)
		}
		setFeedbackDefinitions(feedbacks) {
			this.feedbacks = feedbacks
		}
		setVariableDefinitions() {}
		setPresetDefinitions() {}
		setVariableValues(values) {
			Object.assign(this.values, values)
		}
		checkFeedbacks() {}
		saveConfig() {}
		async parseVariablesInString(value) {
			if (typeof value !== 'string') return value
			return value.replace(/\$\(custom:(data|nested)\)/g, (_, id) => (id === 'data' ? '42' : '$(custom:data)'))
		}
	}
	vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
		require(name) {
			return name === '@companion-module/base'
				? { InstanceBase: Base, InstanceStatus: { Ok: 'ok' }, runEntrypoint: (value) => (Instance = value) }
				: sourceRequire(name)
		},
		setTimeout(callback, delay) {
			const id = {}
			timers.set(id, { callback, delay })
			return id
		},
		clearTimeout(id) {
			timers.delete(id)
		},
	})
	const self = new Instance()
	await self.init({
		cursor: '|',
		maxlength: 64,
		formattype: 'none',
		copydata: 'raw',
		after: 'clear',
		criterialogic: 'or',
		...config,
	})
	return { self, timers }
}

test('insert action substitutes variables and publishes entry, cursor and length', async () => {
	const { self } = await instance()
	await self.execute('insertData', { position: 'cursor', data0: '$(custom:data)' })
	assert.equal(self.values.entry_raw, '42')
	assert.equal(self.values.entry_formatted, '42')
	assert.equal(self.values.entry_cursor, '42|')
	assert.equal(self.values.entry_cursor_position, 2)
	assert.equal(self.values.entry_raw_length, 2)
	assert.equal(self.feedbacks.valid.callback({ options: { data: 'raw', regex: '/^42$/' } }), true)
})

test('one-time modifier chooses alternate input and is released after insertion', async () => {
	const { self } = await instance()
	self.modifier[1].effective = true
	self.modifier[1].onetime = true
	await self.execute('insertData', { position: 'cursor', data0: 'lower', data1type: true, data1: 'UPPER' })
	assert.equal(self.entry_raw, 'UPPER')
	assert.equal(self.modifier[1].effective, false)
	assert.equal(self.modifier[1].onetime, false)
	assert.equal(self.feedbacks.modifier.callback({ options: { modifier: 1, location: 'anywhere' } }), false)
})

test('insertion enforces length limits, enter preserves history and clears the entry', async () => {
	const { self } = await instance({ maxlength: 3 })
	await self.execute('insertData', { position: '0', data0: 'abcdef' })
	assert.equal(self.entry_raw, 'abc')
	assert.equal(self.entry_cursor_position, 3)
	await self.enter()
	assert.equal(self.values.entry_last, 'abc')
	assert.equal(self.values.entrycounter, 1)
	assert.equal(self.values.entry_raw, '')
	await self.execute('insertData', { position: '0', data0: 'xyz' })
	await self.enter()
	assert.equal(self.values.entry_second_last, 'abc')
	assert.equal(self.values.entry_last, 'xyz')
	assert.equal(self.values.entrycounter, 2)
})

test('configured number, printf and regex formats resolve variables and produce formatted output', async () => {
	const { self } = await instance({ formattype: 'ecmanumber', formatecma: '0.00' })
	assert.equal(await self.formatData('42'), '42.00')
	self.config = { ...self.config, formattype: 'printf', formatprintf: 'Value: %s' }
	assert.equal(await self.formatData('42'), 'Value: 42')
	self.config = { ...self.config, formattype: 'regex', formatregex: '/^(.+)$/value-$1/' }
	assert.equal(await self.formatData('42'), 'value-42')
})

test('Unicode normalization keeps the cursor at the normalized text boundary', async () => {
	const { self } = await instance()
	await self.execute('setData', { data: 'e\u0301' })
	await self.execute('normalizeEntry')
	assert.equal(self.values.entry_raw, 'é')
	assert.equal(self.values.entry_cursor_position, 1)
	assert.equal(self.values.entry_cursor, 'é|')
})

test('inactivity timeout enters data, while config reload and destroy cancel pending timers', async () => {
	const { self, timers } = await instance({ autotime: true, timeout: 0.1 })
	await self.execute('insertData', { position: 'cursor', data0: 'abc' })
	assert.equal(timers.size, 1)
	const timer = [...timers.values()][0]
	assert.equal(timer.delay, 100)
	timer.callback()
	await new Promise(setImmediate)
	assert.equal(self.values.entry_last, 'abc')
	assert.equal(self.values.entry_raw, '')
	assert.equal(timers.size, 0)
	self.restartTimeout()
	await self.configUpdated(self.config)
	assert.equal(timers.size, 0)
	self.restartTimeout()
	await self.destroy()
	assert.equal(timers.size, 0)
})

test('SDK action execution expands variable-valued text once, preserving literal variable syntax', async () => {
	const { self } = await instance()
	await self.execute('insertData', { position: 'cursor', data0: '$(custom:nested)' })
	assert.equal(self.entry_raw, '$(custom:data)')
	await self.execute('setData', { data: '$(custom:nested)' })
	assert.equal(self.entry_raw, '$(custom:data)')
})

test('overwrite uses endposition, supports blank end, and deletion and cursor movement still work', async () => {
	const { self } = await instance()
	await self.execute('setData', { data: 'abcdef' })
	await self.execute('overwriteData', { startposition: '1', endposition: '3', data0: 'WXYZ' })
	assert.equal(self.entry_raw, 'aWXdef')
	assert.equal(self.entry_cursor_position, 3)
	await self.execute('overwriteData', { startposition: '4', endposition: '', data0: '1234' })
	assert.equal(self.entry_raw, 'aWXd1234')
	await self.execute('cursorPosition', { operation: 'abs', amount: 2 })
	await self.execute('deleteData', { position: 'cursor', amount: -1 })
	assert.equal(self.entry_raw, 'aXd1234')
	assert.equal(self.values.entry_cursor, 'a|Xd1234')
})
