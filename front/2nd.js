let username = null;
let unique_id = null;
let file = null;



window.addEventListener("load", function () {
    loadUsers();
});
let offset = 0;

function lodemore() {

    offset += 5;

    fetch("https://rakhi-website-ja55.onrender.com/getdata?offset=" + offset)
        .then(response => response.json())
        .then(users => {

            console.log("NEXT 5 USERS:", users);

            if (users.length === 0) {
                document.querySelector(".lodemore").style.display = "none";
                return;
            }

        
            addUsers(users);

            
            if (users.length < 5) {
                document.querySelector(".lodemore").style.display = "none";
            }

        })
        .catch(error => {
            console.error("LOAD MORE ERROR:", error);
        });
}



function loadUsers() {

    console.log("LOAD USERS START");

    fetch("https://rakhi-website-ja55.onrender.com/getdata")
        .then(response => {

            console.log("GETDATA RESPONSE:", response.status);

            return response.json();
        })
        .then(users => {

            console.log("GETDATA USERS:", users);

            const mid = document.getElementById("mid");

            if (!mid) {
                console.log("ERROR: mid nahi mila");
                return;
            }

            mid.innerHTML = "";

            users.forEach(user => {

                const addp = document.createElement("div");
                addp.classList.add("addp");


                const profileBtn = document.createElement("button");
                profileBtn.className = "i";


                const img = document.createElement("img");
                img.alt = "profile";

                if (user.profile_pic) {
                    img.src =
                        "data:image/jpeg;base64," +
                        user.profile_pic;
                } else {
                    img.src = "noprofile.png";
                }

                profileBtn.appendChild(img);


                const name = document.createElement("div");
                name.className = "n";
                name.textContent = user.name || "";


                const forDiv = document.createElement("div");
                forDiv.className = "for";
                forDiv.textContent =
                    "for:" + (user.broname || "");


                const commentDiv = document.createElement("div");
                commentDiv.className = "c";
                commentDiv.textContent =
                    user.comment || "";


               const likeButton = document.createElement("button");
likeButton.className = "l";
likeButton.textContent = "like: ";

likeButton.addEventListener("click", function () {
likeButton.textContent = "❤️";
});


const replyButton = document.createElement("button");
replyButton.className = "r";
replyButton.textContent = "comment";

replyButton.addEventListener("click", function () {
    pop(user.unique_id);

});
const shareButton = document.createElement("button");
shareButton.className = "share";
shareButton.textContent = "share";

shareButton.addEventListener("click", async function () {

    const link =
        "https://rakhi-website.onrender.com/2nd.html?post=" + user.unique_id;

    const message =
        user.name + " ne aapke liye kuch bheja hai ❤️\n\n" + link;

    
    await navigator.clipboard.writeText(message);

    
    const choice = confirm(
        "Link copy ho gaya ❤️\n\n" +
        "WhatsApp\n" +
        "Instagram"
    );

    if (choice) {

        // WhatsApp
        const whatsapp =
            "https://wa.me/?text=" +
            encodeURIComponent(message);

        window.open(whatsapp, "_blank");

    } else {

        
        window.open(
            "https://www.instagram.com/",
            "_blank"
        );
    }

});



                addp.appendChild(profileBtn);
                addp.appendChild(name);
                addp.appendChild(forDiv);
                addp.appendChild(commentDiv);
                addp.appendChild(likeButton);
                addp.appendChild(replyButton);
                addp.appendChild(shareButton);

                mid.appendChild(addp);
            });

        })
        .catch(error => {
            console.error("GETDATA ERROR:", error);
        });
}

function comment() {

    document.getElementById("popup").style.display = "block";

    document.getElementById("main").style.display = "none";
}
document.getElementById("profilePic").addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const image = document.getElementById("pimg");

    image.src = URL.createObjectURL(file);

});


function creat() {

    const btn = document.getElementById("4");

    if (btn.disabled) {
        return;
    }

    const file =
        document.getElementById("profilePic").files[0];

    const username =
        document.getElementById("name").value.trim();

    const broname =
        document.getElementById("broname").value.trim();

    const commentText =
        document.getElementById("comment").value.trim();

    // Pehle validation
    if (username === "" || broname === "" || commentText === "") {
        alert("Please fill all three fields first.");
        return;
    }

    // Validation successful hone ke baad hi button disable hoga
    btn.disabled = true;
    btn.innerText = "Creating...";

    const formData = new FormData();

    if (file) {
        formData.append("profilePic", file);
    }

    formData.append("name", username);
    formData.append("broname", broname);
    formData.append("comment", commentText);

    fetch("https://rakhi-website-ja55.onrender.com/userprofile", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        console.log("POST RESPONSE:", data);

        unique_id = data.unique_id;

        document.getElementById("popup").style.display = "none";
        document.getElementById("main").style.display = "block";

        loadUsers();

    })
    .catch(error => {

        console.error("POST ERROR:", error);

        btn.disabled = false;
        btn.innerText = "Create Profile ✨";
    });
}




     
let postid = null;

function pop(id) {

    postid = id;

    document.getElementById("main").style.display = "none";
    document.getElementById("pop").style.display = "block";

    fetch("https://rakhi-website-ja55.onrender.com/allcomment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            postid: postid
        })
    })
    .then(res => res.json())
    .then(data => {

        const body = document.querySelector(".body");

        body.innerHTML = "";

        
        data.forEach(item => {

            body.innerHTML += `
                <div class="text">
                    ${item.comment}
                </div>
            `;

        });

    })
    .catch(err => {
        console.log("Comment error:", err);
    });
}


 function cancle()
{
   document.getElementById("main").style.display="block"
document.getElementById("pop").style.display="none" 
}
function docomment() {

    let new2div = document.createElement("div");

    new2div.classList.add("text");

    new2div.innerText =
        document.getElementById("yourname").value + ": " +
        document.getElementById("inp").value;

    document.querySelector(".body").appendChild(new2div);

    fetch("https://rakhi-website-ja55.onrender.com/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            postid: postid,
            comment:
                document.getElementById("yourname").value + ": " +
                document.getElementById("inp").value
        })
    })
    .then(res => res.json())
    .then(data => {

    console.log("Server response:", data);

    if (data.success) {
       
        document.getElementById("inp").value = "";
    }

})

    .catch(err => {
        console.log("Fetch error:", err);
    });

}

function addUsers(users) {

    const mid = document.getElementById("mid");

    if (!mid) {
        console.log("ERROR: mid nahi mila");
        return;
    }

    users.forEach(user => {

        const addp = document.createElement("div");
        addp.classList.add("addp");


        const profileBtn = document.createElement("button");
        profileBtn.className = "i";


        const img = document.createElement("img");
        img.alt = "profile";

        if (user.profile_pic) {
            img.src =
                "data:image/jpeg;base64," +
                user.profile_pic;
        } else {
            img.src = "noprofile.png";
        }

        profileBtn.appendChild(img);


        const name = document.createElement("div");
        name.className = "n";
        name.textContent = user.name || "";


        const forDiv = document.createElement("div");
        forDiv.className = "for";
        forDiv.textContent =
            "for:" + (user.broname || "");


        const commentDiv = document.createElement("div");
        commentDiv.className = "c";
        commentDiv.textContent =
            user.comment || "";


        const likeButton = document.createElement("button");
        likeButton.className = "l";
        likeButton.textContent = "like: ";

        likeButton.addEventListener("click", function () {
            likeButton.textContent = "❤️";
        });


        const replyButton = document.createElement("button");
        replyButton.className = "r";
        replyButton.textContent = "comment";

        replyButton.addEventListener("click", function () {
            pop(user.unique_id);
        });


        const shareButton = document.createElement("button");
        shareButton.className = "share";
        shareButton.textContent = "share";

        shareButton.addEventListener("click", async function () {

            const link =
                "https://rakhi-website.onrender.com/2nd.html?post=" + user.unique_id;

            const message =
                user.name + " ne aapke liye kuch bheja hai ❤️\n\n" + link;

            await navigator.clipboard.writeText(message);

            const choice = confirm(
                "Link copy ho gaya ❤️\n\n" +
                "WhatsApp\n" +
                "Instagram"
            );

            if (choice) {

                const whatsapp =
                    "https://wa.me/?text=" +
                    encodeURIComponent(message);

                window.open(whatsapp, "_blank");

            } else {

                window.open(
                    "https://www.instagram.com/",
                    "_blank"
                );
            }

        });


        addp.appendChild(profileBtn);
        addp.appendChild(name);
        addp.appendChild(forDiv);
        addp.appendChild(commentDiv);
        addp.appendChild(likeButton);
        addp.appendChild(replyButton);
        addp.appendChild(shareButton);

        
        mid.appendChild(addp);
    });
}
