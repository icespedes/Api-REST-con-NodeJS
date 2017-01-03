'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const uuidV1 = require('uuid/v1')

const UserSchema = new Schema({
	publicId: { type: String, unique: true }
	email: { type: String, unique: true, lowercase: true },
	displayName: String,
	avatar: String,
	password: { type: String, select: false },
	signUpDate: { type: Date, default: Date.now() },
	lastLogin: Date
})

//next para que pase al siguiente midleware para que no se quede aqui la funcion.
UserSchema.pre('save', (next) => {
	let user = this
	if (!user.isModified('password')) return next()

	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next()

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if (err) return next(err)

			user.password = hash
			next()
		})
	})
})

UserSchema.pre('save', next() => {
	let user = this

	user.publicId = uuidV1();

})



UserSchema.methods.gravatar = function() {
	if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

	const md5 = crypto.createHash('md5').update(this.email).digest('hex')
	return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

module.exports = mongoose.model('User', UserSchema)