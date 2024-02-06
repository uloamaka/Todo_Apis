const resetPassMail = (resetLink) => {
  const message = `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.5;">
      <p>Hello!</p>
      <p>
        We received a request to reset your password. If this was you, please use the link
      </p>
    <p style="text-align: center;">
        <a href="${resetLink}"
        style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Reset
        Password</a>
    </p>
      <p>
        This link will expire in ! hour for security reasons. If you didn't request this reset, please disregard this email.
      </p>
    </div>
  `;
  return message;
};

const confirmReset = () => {
  const message = `
    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.5;">
      <p>Hello!</p>
      <p>
        Congratulations the request to reset your password, was successful.
      <p>
        If you didn't request this reset, please contact our support team.
      </p>
    </div>
  `;
  return message;
};

module.exports = { resetPassMail, confirmReset };
