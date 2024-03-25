
const zod = require("zod")

const username = zod.string().min(3).max(8);
const password = zod.string().min(8);
const first_name = zod.string().max(20);
const last_name = zod.string().max(20);


const updatebody = zod.object({
    password: password.optional(),
    username: username.optional(),
    lastname: last_name.optional()
});

module.exports = {
    password:password,
    username:username,
    first_name:first_name,
    last_name:last_name,
    updatebody:updatebody
}



