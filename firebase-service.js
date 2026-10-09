// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "rafaq-messenger.firebaseapp.com",
  databaseURL: "https://rafaq-messenger-default-rtdb.firebaseio.com",
  projectId: "rafaq-messenger",
  storageBucket: "rafaq-messenger.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Global User State
window.currentUser = null;
window.currentUsername = null;

// Check if user is logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    window.currentUser = user;
    // Get username from database
    db.ref("users/" + user.uid + "/username").once("value", (snapshot) => {
      window.currentUsername = snapshot.val();
      console.log("مرحبا:", window.currentUsername);
    });
  } else {
    window.currentUser = null;
    window.currentUsername = null;
  }
});

// ===== AUTHENTICATION FUNCTIONS =====

// Sign Up with Username and Password
function signUpUser(username, password) {
  // Generate a fake email from username
  const email = username.toLowerCase() + "@rafaq.local";

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Save username in database
      db.ref("users/" + user.uid).set({
        username: username,
        createdAt: new Date().toISOString(),
        status: "online",
        lastSeen: new Date().toISOString()
      }).then(() => {
        console.log("تم إنشاء الحساب بنجاح:", username);
        window.currentUser = user;
        window.currentUsername = username;
        window.location.href = "index.html";
      });
    })
    .catch((error) => {
      let message = "حدث خطأ";
      if (error.code === "auth/email-already-in-use") {
        message = "اسم المستخدم مستخدم بالفعل";
      } else if (error.code === "auth/weak-password") {
        message = "كلمة المرور ضعيفة جداً (6 أحرف على الأقل)";
      }
      alert(message);
      console.error("خطأ في التسجيل:", error);
    });
}

// Sign In with Username and Password
function signInUser(username, password) {
  const email = username.toLowerCase() + "@rafaq.local";

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.currentUser = user;
      
      // Update user status
      db.ref("users/" + user.uid + "/status").set("online");
      db.ref("users/" + user.uid + "/lastSeen").set(new Date().toISOString());
      
      console.log("تم تسجيل الدخول بنجاح:", username);
      window.location.href = "index.html";
    })
    .catch((error) => {
      let message = "خطأ في تسجيل الدخول";
      if (error.code === "auth/user-not-found") {
        message = "اسم المستخدم غير موجود";
      } else if (error.code === "auth/wrong-password") {
        message = "كلمة المرور غير صحيحة";
      }
      alert(message);
      console.error("خطأ في الدخول:", error);
    });
}

// Sign Out
function signOutUser() {
  if (window.currentUser) {
    db.ref("users/" + window.currentUser.uid + "/status").set("offline");
  }
  
  auth.signOut()
    .then(() => {
      window.currentUser = null;
      window.currentUsername = null;
      console.log("تم تسجيل الخروج");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("خطأ في تسجيل الخروج:", error);
    });
}

// ===== MESSAGES FUNCTIONS =====

// Send Message to Group
function sendMessageToGroup(messageText) {
  if (!window.currentUser || !window.currentUsername) {
    alert("يجب تسجيل الدخول أولاً");
    return;
  }

  const message = {
    text: messageText,
    sender: window.currentUsername,
    senderId: window.currentUser.uid,
    timestamp: new Date().toISOString(),
    timestampNum: Date.now()
  };

  db.ref("messages").push(message)
    .then(() => {
      console.log("تم إرسال الرسالة");
    })
    .catch((error) => {
      console.error("خطأ في إرسال الرسالة:", error);
    });
}

// Listen to Messages (Real-time)
function listenToMessages(callback) {
  db.ref("messages")
    .orderByChild("timestampNum")
    .on("child_added", (snapshot) => {
      const message = snapshot.val();
      callback(message);
    });
}

// Get All Messages
function getAllMessages(callback) {
  db.ref("messages")
    .orderByChild("timestampNum")
    .once("value", (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val());
      });
      callback(messages);
    });
}

// ===== USER FUNCTIONS =====

// Get User Profile
function getUserProfile(callback) {
  if (!window.currentUser) {
    callback(null);
    return;
  }

  db.ref("users/" + window.currentUser.uid).once("value", (snapshot) => {
    callback(snapshot.val());
  });
}

// Update User Profile
function updateUserProfile(updates) {
  if (!window.currentUser) return;

  db.ref("users/" + window.currentUser.uid).update(updates)
    .then(() => {
      console.log("تم تحديث الملف الشخصي");
    })
    .catch((error) => {
      console.error("خطأ في تحديث الملف:", error);
    });
}

// Get All Group Members
function getGroupMembers(callback) {
  db.ref("users").on("value", (snapshot) => {
    const members = [];
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      members.push({
        uid: childSnapshot.key,
        ...user
      });
    });
    callback(members);
  });
}

// ===== GROUP FUNCTIONS =====

// Get Group Info
function getGroupInfo(callback) {
  db.ref("group").once("value", (snapshot) => {
    callback(snapshot.val() || {
      name: "مجموعة رفاق",
      description: "أصدقاء، فريق، أفكار، تنفيذ.",
      createdAt: new Date().toISOString()
    });
  });
}

// Update Group Info
function updateGroupInfo(updates) {
  db.ref("group").update(updates)
    .then(() => {
      console.log("تم تحديث معلومات المجموعة");
    })
    .catch((error) => {
      console.error("خطأ في تحديث المجموعة:", error);
    });
}

// ===== HELPER FUNCTIONS =====

// Check if user is logged in
function isLoggedIn() {
  return window.currentUser !== null;
}

// Get current username
function getCurrentUsername() {
  return window.currentUsername;
}

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Format date
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return "اليوم";
  }
  
  return date.toLocaleDateString("ar-SA");
}
