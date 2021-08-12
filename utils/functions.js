const mappingErrorMessages = (data) => {
	const errors = {};

	data.forEach((item) => {
		errors[item.param] = errors[item.param]
			? [...errors[item.param], item.msg]
			: [item.msg];
	});

	return errors;
};

module.exports = {
	mappingErrorMessages,
};
