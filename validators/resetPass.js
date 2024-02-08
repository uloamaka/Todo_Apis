const { z } = require("zod");
const resetSchema = z.string().refine({
  newPassword: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .nonempty("Confirm password is required")
    .superRefine(
      (confirmPassword, ctx) =>
        confirmPassword === ctx.parent.newPassword ||
        z.error("New password and Confirm password must match"))

});

module.exports = {
  resetSchema,
};
