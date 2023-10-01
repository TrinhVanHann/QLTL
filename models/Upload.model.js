require('dotenv').config();

const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

var that = module.exports = {
    setFilePublic: async(fileId) =>{
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })

            const getUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink, webContentLink'
            })

            return getUrl;
        } catch (error) {
            console.error(error);
        }
    },
    uploadFile: async (file, parentId) => {
        try {
            const createFile = await drive.files.create({
                resource: {
                    name: file.originalname,
                    parents: [parentId]
                },
                media: {
                    mimeType: file.mimetype,
                    body: fs.createReadStream(file.path)
                },
                fields: 'id'
            })
            const fileId = createFile.data.id;
            const getUrl = await that.setFilePublic(fileId);

            return fileId

        } catch (error) {
            console.error(error);
        }
    },
    deleteFile: async (fileId) => {
        try {
            console.log('Delete File:::', fileId);
            const deleteFile = await drive.files.delete({
                fileId: fileId
            })
            console.log(deleteFile.data, deleteFile.status)
        } catch (error) {
            console.error(error);
        }
    },
    createFolder: async (name, parentId) => {
        try {
            const fileMetadata = {
                name: name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentId]
            };
            const file = await drive.files.create({
                resource: fileMetadata,
                fields: 'id',
            });
            console.log('Folder Id:', file.data.id);
            return file.data.id;
            
        } catch (err) {
            // TODO(developer) - Handle error
            throw err;
        }  
    }
}