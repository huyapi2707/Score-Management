import pyrebase

firebaseConfig = {
    'apiKey': "AIzaSyDA19hOUUIdUsOMiNbb_W41v9yKaqR1fek",
    'authDomain': "lms-chats.firebaseapp.com",
    'projectId': "lms-chats",
    'storageBucket': "lms-chats.appspot.com",
    'messagingSenderId': "74220990475",
    'appId': "1:74220990475:web:5a84c7a3748ae7a4e8570e",
    'databaseURL': "https://lms-chats-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

firebase = pyrebase.initialize_app(firebaseConfig)
firebase_database = firebase.database()
