const { inputRule } = require("graphql-shield");

exports.registerUserValidation = inputRule()(
  (yup, context) =>
    yup.object({
      // edit it later
      avatar: yup.mixed().test('fileType', 'Invalid file type', async (file) => {
        if (!file) return true
        const imageTypes = ["jpeg", "jpg", "png", "gif", "svg"];
        const {filename} = await file
        const ext = filename.split('.').pop()
        return imageTypes.includes(ext)
      }).test('fileSize', `File too large, max ${(process.env.IMAGE_MAX_SIZE / 1000000).toFixed(2)} MB `, async (file) => {
        if (!file) return true
        const size = context.req.headers["content-length"]
        return size <= parseInt(process.env.IMAGE_MAX_SIZE)
      }),
      confirmPassword: yup.string().required("Confirm Password is required").trim().oneOf([yup.ref('password')], 'Passwords must match'),
      password: yup.string().required("Password is required").trim(),
      email: yup.string().email('Invalid email format!').required("Email is required").trim(),
      name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters long").max(15, "Name must be at most 15 characters long").trim(),
    }),
)