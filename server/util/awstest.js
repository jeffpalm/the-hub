require('dotenv').config()
const {
		AWS_ACCESS_KEY_ID: accessKeyId,
		AWS_SECRET_ACCESS_KEY: secretAccessKey
	} = process.env,
	aws = require('aws-sdk'),
	uuid = require('uuid'),
	bucketName = 'the-hub-development-' + uuid.v4(),
	keyName = 'hello_world.txt',
	options = {
		apiVersion: 'latest'
	}

console.log(accessKeyId)

aws.config.credentials = new aws.Credentials({
	accessKeyId,
	secretAccessKey,
	region: 'us-east-2'
})
const bucketPromise = new aws.S3(options)
	.createBucket({ Bucket: bucketName })
	.promise()

bucketPromise
	.then(data => {
		const objectParams = {
			Bucket: bucketName,
			Key: keyName,
			Body: 'Hello World'
		}
		const uploadPromise = new aws.S3(options).putObject(objectParams).promise()

		uploadPromise.then(data => {
			console.log(`Successfully uploaded data to ${bucketName}/${keyName}`)
		})
	})
	.catch(err => {
		console.error(err, err.stack)
	})
