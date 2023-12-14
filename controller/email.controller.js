const asyncHandler = require("express-async-handler");
const { sendEmail, verifyYourAccount } = require("../utils/email");

const sendVerificationEmailsController = asyncHandler(async (req, res) => {
    try {
        console.log(req.body);
        let send = sendEmail(verifyYourAccount(req.body ));

        if (send)
            res.status(200).json({ success: true });
        else
            throw createError(401, `Error to send email`);


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});

const sendEmailsMultiController = asyncHandler(async (req, res) => {
    try {
        let send = sendEmail(multipleMails({ data }));
        if (send)
            res.json({ success: true });
        else
            throw createError(401, `Error to send email`);


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
});


module.exports = { sendVerificationEmailsController, sendEmailsMultiController };
