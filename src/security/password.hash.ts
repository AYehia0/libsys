// use bcrypt to hash the password before saving it to the database
// add salt to the password to make it more secure
// the salt is a random string that is added to the password before hashing it
// also create a function to compare the password with the hashed password

import bcrypt from "bcrypt";

// FIXME: using the async version of bcrypt takes too much time to hash and compare the password
export class Password {
    static hash(password: string): string {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALTNESS || "10"));
        return bcrypt.hashSync(password, salt);
    }

    static compare(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}
