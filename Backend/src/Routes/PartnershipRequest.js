const express = require('express');
const router = express.Router();

router.post('/api/partnership-request', async (req, res) => {
    try {
        const { firstName, lastName, function: jobFunction, organizationName, inquiryType } = req.body;

        // Store the information in the database
        // This is a placeholder - replace with your actual database logic
        await db.partnershipRequests.create({
            firstName,
            lastName,
            function: jobFunction,
            organizationName,
            inquiryType,
            createdAt: new Date()
        });

        // Send email to admin
        // This is a placeholder - replace with your actual email sending logic
        await sendEmail({
            to: 'admin@nlnext.com',
            subject: 'New Partnership Request',
            body: `New request from ${firstName} ${lastName} of ${organizationName}`
        });

        res.status(200).json({ message: 'Request submitted successfully' });
    } catch (error) {
        console.error('Error processing partnership request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

module.exports = router;