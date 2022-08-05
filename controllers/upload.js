const express = require("express");

const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../util/s3Client");

const { v4: uuidv4 } = require("uuid");

const uploadRouter = express.Router();

uploadRouter.get("/image", async (req, res) => {
  try {
    const imageUploadInfo = await ImageUploadInfoGenerator();
    res.json({
      error: 0,
      message: "imageUploadURL Generation Successful",
      imageUploadUrl: imageUploadInfo.imageUploadUrl,
      imageName: imageUploadInfo.imageName,
    });
  } catch (e) {
    res.json({
      error: 1,
      message: e.message,
      imageUploadUrl: "",
      imageUploadInfo: "",
    });
  }
});

uploadRouter.get("/file", async (req, res) => {
  try {
    const fileUploadInfo = await FileUploadInfoGenerator();
    res.json({
      error: 0,
      message: "fileUploadURL Generation Successful",
      fileUploadUrl: fileUploadInfo.fileUploadUrl,
      fileName: fileUploadInfo.fileName,
    });
  } catch (e) {
    res.json({
      error: 1,
      message: e.message,
      imageUploadUrl: "",
      imageUploadInfo: "",
    });
  }
});

const ImageUploadInfoGenerator = async () => {
  try {
    const imageName = uuidv4();
    const bucketParams = {
      Bucket: "axra",
      Key: `ABee2Axra/${imageName}`,
      ContentType: "image/jpeg",
      ACL: "public-read",
    };

    const imageUploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(bucketParams),
      { expiresIn: 150 * 60 }
    ); // Adjustable expiration.
    console.log("URL:", imageUploadUrl);
    return { imageUploadUrl, imageName };
  } catch (e) {
    throw new Error(e.message);
  }
};

const FileUploadInfoGenerator = async () => {
  try {
    const fileName = uuidv4();
    const bucketParams = {
      Bucket: "axra",
      Key: `ABee2Axra/${fileName}`,
      ACL: "public-read",
    };

    const fileUploadUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(bucketParams),
      { expiresIn: 150 * 60 }
    ); // Adjustable expiration.
    console.log("URL:", fileUploadUrl);
    return { fileUploadUrl, fileName };
  } catch (e) {
    throw new Error(e.message);
  }
};

uploadRouter.delete("/image", async (req, res) => {
  try {
    const { imageName } = req.body;
    await deleteImage(imageName);
    res.json({ error: 0, message: "delete Image Successful" });
  } catch (e) {
    res.json({ error: 1, message: e.message });
  }
});

uploadRouter.delete("/file", async (req, res) => {
  try {
    const { fileName } = req.body;
    await deleteFile(fileName);
    res.json({ error: 0, message: "delete File Successful" });
  } catch (e) {
    res.json({ error: 1, message: e.message });
  }
});

const deleteImage = async (imageName) => {
  try {
    const bucketParams = {
      Bucket: "axra",
      Key: `ABee2Axra/${imageName}`,
    };

    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success", data);
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

const deleteFile = async (fileName) => {
  try {
    const bucketParams = {
      Bucket: "axra",
      Key: `ABee2Axra/${fileName}`,
    };

    const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
    console.log("Success", data);
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = uploadRouter;
