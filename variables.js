module.exports = async function (self) {
	self.setVariableDefinitions(
		self.variables.map((vari) => {
			return { variableId: vari.variableId, name: vari.name };
		}),
	);
};
