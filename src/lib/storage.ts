export async function uploadImage(file: Buffer, contentType: string, key: string): Promise<string> {
  // Dynamically import S3Client only when needed
  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
  const s3 = new S3Client({
    endpoint: process.env.STORAGE_ENDPOINT,
    region: 'auto',
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY!,
    },
  })
  await s3.send(new PutObjectCommand({ Bucket: process.env.STORAGE_BUCKET_NAME!, Key: key, Body: file, ContentType: contentType }))
  return `${process.env.STORAGE_PUBLIC_URL}/${key}`
}
