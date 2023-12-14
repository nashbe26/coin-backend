const mongoose = require('mongoose');

const Transaction = new mongoose.Schema(
	{
		price: { type: String, required: true },
		method: { type: String, required: true },
		transactionDoneDate: { type: Date },
		user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
		prod_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
		seller_id: { type: mongoose.Types.ObjectId, ref: 'User' },
		pay_int: { type: String, required: true },
		status:{ type: String, required: true }

	},
	{ timestamps: true }
);

module.exports = mongoose.model('Transaction', Transaction);
