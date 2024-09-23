// Import the required S3Client and PutObjectCommand from AWS SDK v3
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

async function uploadToS3(filename, fileData) {
  // Create a new S3 client instance
  const s3Client = new S3Client({
    region: process.env.AWS_REGION, // Make sure to set your AWS region
    credentials: {
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET,
    },
  });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: fileData,
    ACL: "public-read", // Grant public read access
  };

  console.log("params: ", params);

  try {
    // Upload file to S3 using the S3Client and PutObjectCommand
    const command = new PutObjectCommand(params);
    const s3Response = await s3Client.send(command);
    
    console.log("S3 upload response: ", s3Response);

    // Return the public URL of the uploaded file
    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
    return fileUrl;
  } catch (err) {
    console.error("Error uploading to S3: ", err);
    throw new Error("Something went wrong while uploading to S3");
  }
}

module.exports = {
  uploadToS3,
};
