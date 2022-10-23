import { S3Client } from "@aws-sdk/client-s3";

// S3Client automatically loads and sets credentials from env
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html

const REGION = "ap-southeast-2";

const s3Client = new S3Client({region: REGION});

export {s3Client};