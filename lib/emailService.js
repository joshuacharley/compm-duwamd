const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendBidAlert = async (bids) => {
  const emailHtml = `
    <h2>New Relevant Bids Found</h2>
    <p>The following bids matching your services have been identified:</p>
    ${bids
      .map(
        (bid) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
        <h3 style="color: #2563eb;">${bid.title}</h3>
        <p><strong>Source:</strong> ${bid.source}</p>
        <p><strong>Category:</strong> ${bid.bidCategory}</p>
        <p><strong>Services:</strong> ${bid.services.join(", ")}</p>
        <p><strong>Published:</strong> ${new Date(
          bid.publishDate
        ).toLocaleDateString()}</p>
        ${
          bid.closingDate
            ? `<p><strong>Closing Date:</strong> ${new Date(
                bid.closingDate
              ).toLocaleDateString()}</p>`
            : ""
        }
        ${
          bid.description
            ? `<p><strong>Description:</strong> ${bid.description}</p>`
            : ""
        }
        <a href="${
          bid.url
        }" style="display: inline-block; margin-top: 10px; padding: 8px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">View Bid</a>
      </div>
    `
      )
      .join("")}
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: "New Relevant Bids Alert",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Bid alert email sent successfully");
  } catch (error) {
    console.error("Error sending bid alert email:", error);
    throw error;
  }
};

module.exports = { sendBidAlert };
