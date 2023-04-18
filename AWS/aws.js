import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: "aqui ira tu key de tu usuario IAM",
  secretAccessKey: "aqui ira tu secrey key de tu usuario IAM",
  region: "us-east-1",
});

const s3 = new AWS.S3();
const sns = new AWS.SNS();

const paramsUser = {
  Bucket: "users-image-cervezaapp",
  ACL: "public-read",
};

const paramsProduct = {
  Bucket: "products-image-cervezaapp",
  ACL: "public-read",
};

s3.createBucket(paramsUser, function (err, data) {
  if (err) {
    console.log("Error al crear el bucket de usuarios", err);
  } else {
    console.log("Bucket creado correctamente", data.Location);
  }
});

s3.createBucket(paramsProduct, function (err, data) {
  if (err) {
    console.log("Error al crear el bucket de usuarios", err);
  } else {
    console.log("Bucket creado correctamente", data.Location);
  }
});

export { s3, sns }