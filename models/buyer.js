const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// import function to validate email from validator package
// we will destruct it where we only take the email

const {isEmail} = require('validator');


// Define a schema for your data model
const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // minlength: 3,
        // maxlength: 50
    },
    email: {
        type: String,
        required: [
            true, 'please enter an email'
        ],
        unique: true,

        // validate property to only allow actual emails

        validate: [isEmail, 'please enter valid email']

    },
    password: {
        type: String,
        required: true,
        // validators right now arent doing anything
        minlength: [6, 'Minimum password length is 6 characters']
    },
    phone: {
        type: String,
        required: true,
        unique: true
    }
});


// before the doc is saved to db
// reason this was created was because we are going to use this to hash passwords before we add them to the db
// generate a salt which attaches to the password (string) then we hash it and store it to db
// buyerSchema.pre('save' , async function(next) {
// const salt = await bcrypt.genSalt();
// this.password = await bcrypt.hash(this.password , salt);
// next();
// });

// method which is static to log in user , checks password and email then compares inputs and db saved creds

buyerSchema.statics.login = async function (email, password) {
    const buyer = await this.findOne({email});
    if (buyer) {
        const auth = await bcrypt.compare(password, buyer.password);
        if (auth) {
            return buyer;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
}


// Create a model from the schema
const Buyer = mongoose.model('buyer', buyerSchema);

// Export the model
module.exports = Buyer;
