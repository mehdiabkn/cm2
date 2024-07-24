import { useState } from "react";
import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";
  
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.mhd.mhd',
    projectId: '669335fb0034289dfde1',
    databaseId: '669337560016b6568ad0',
    userCollectionId: '66933773002d7e0383ae',
    videoCollectionId: '669337b3000969f7b95b',
    storageId: '669339c40003537474c8'
}

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
// Upload File

// Upload File
export async function uploadFile(file, type) {
    if (!file) return;
    const asset = { 
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri,
    };

    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
}
  

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
  // Create Video Post
  export async function createVideo(form) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          users: form.userId,
          url: videoUrl,

        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("users", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export const checkSession = async () => {
    try {
        const currentSession = await account.getSession('current');
        if (currentSession) {
            // Rediriger vers la page d'accueil
            console.log("patronummm");
            return 23561;
        } 
        
    } catch (error) {
        console.log("check session", error);
    }
    return false;
};


export async function addBookmark(videoId) {
  console.log("apanai");

  const bookmarked= await isBookmarked(videoId);
  console.log(bookmarked);
  try {
    if (!bookmarked){
      const currentAccount = await account.get();
      /* Recuperer les infos d'un user */
      const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      );
      const firstUser= user.documents[0];
      console.log(firstUser.bookmark);
      console.log(videoId);
      const newBookmark= firstUser.bookmark;
      newBookmark.push(videoId);
      const result = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        firstUser.$id,
        {
          bookmark: newBookmark
        }
      );
    } else {
      console.log("GUEUSHHHHHHH");
    }
    return true;
  } catch (error) {
    throw new Error(error);
  }
}

export async function isBookmarked(videoId) {
  try {
    const currentAccount = await account.get();
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );
    firstUser= user.documents[0];
    const valeur = firstUser.bookmark.some(item => item["$id"] === videoId)
    console.log("je suis isBookmarked et la valeur que je retourne est : ", valeur);
    return valeur; // est ce que parmi les élements composés notamment d'un attribut id, il y en a un dont l'id est videoId ? 
  } catch (error) {
    throw new Error(error);
  }
}


export async function removeBookmark(videoId) {
  try {
    const currentAccount = await account.get();

    /* Recuperer les infos d'un user */
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    const firstUser= user.documents[0];
    /* fin de ce qu'il faut mettre dans une FONCTION */

    const newBookmark= firstUser.bookmark;
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      firstUser.$id,
      {
        bookmark: newBookmark.filter(item => item["$id"] !== videoId)
      }
    );
    return true;
  } catch (error) {
    throw new Error(error);
  }
}


// Get all video Posts
export async function getBookmarks() {
  try {
    const currentAccount = await account.get();

    /* Recuperer les infos d'un user */
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    const firstUser= user.documents[0];
    /* fin de ce qu'il faut mettre dans une FONCTION */
    return firstUser.bookmark;
  } catch (error) {
    throw new Error(error);
  }
}
