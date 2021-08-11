exports.showMessage = (req, res) => {
	res.status(200).send(req.params.message);
};

exports.registerUser = (req, res) => {
	res.status(200).json(req.body);
};
