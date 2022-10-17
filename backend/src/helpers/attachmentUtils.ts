import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


export function getAttachmentUrl(attachmentId: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
}

export async function createAttachmentUrl(id: string) {
    const uploadUrl = await s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: id,
        Expires: Number(urlExpiration)
    })
    return uploadUrl
}
