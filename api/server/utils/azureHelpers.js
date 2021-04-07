// A helper function used to read a Node.js readable stream into a string
import { BlobServiceClient } from '@azure/storage-blob';

const streamToString = async (readableStream) => new Promise((resolve, reject) => {
  const chunks = [];
  readableStream.on('data', (data) => {
    chunks.push(data.toString());
  });
  readableStream.on('end', () => {
    resolve(chunks.join(''));
  });
  readableStream.on('error', reject);
});

const streamToBuffer = async (readableStream) => new Promise((resolve, reject) => {
  const chunks = [];
  readableStream.on('data', (data) => {
    chunks.push(data);
  });
  readableStream.on('end', () => {
    resolve(Buffer.concat(chunks));
  });
  readableStream.on('error', reject);
});

const uploadBlob = async (fileName, file, containerName) => {
  try {
    const { AZURE_STORAGE_CONNECTION_STRING } = process.env;
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    // const containerName = 'isadocuments';

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const uploadBlobResponse = await blockBlobClient.upload(file, file.length);

    return { ...uploadBlobResponse, blobName: fileName };
  } catch (error) {
    throw error;
  }
};

const downloadBlob = async (containerName, fileName) => {
  try {
    const { AZURE_STORAGE_CONNECTION_STRING } = process.env;

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const fileBuffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

    return fileBuffer;
  } catch (error) {
    throw error;
  }
};

export default { streamToString, uploadBlob, downloadBlob };
