// ===============================
// USER REGISTRATION
// ===============================

document.getElementById("registerForm")?.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("auctionUser", JSON.stringify(user));

    alert("Registration successful!");

    window.location.href = "login.html";
});


// ===============================
// USER LOGIN
// ===============================

document.getElementById("loginForm")?.addEventListener("submit", function(event) {

    event.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let savedUser = JSON.parse(localStorage.getItem("auctionUser"));

    if (savedUser === null) {
        alert("No account found. Please register first.");
        return;
    }

    if (email === savedUser.email && password === savedUser.password) {

        localStorage.setItem("isLoggedIn", "true");

        alert("Login successful!");

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid email or password.");

    }

});


// ===============================
// USER LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("isLoggedIn");

    window.location.href = "index.html";
}


// ===============================
// PLACE BID
// ===============================

function placeBid(product, currentBid) {

    let bid = prompt(
        "Enter your bid for " + product +
        "\nCurrent Bid: ₹" + currentBid
    );

    if (bid === null) {
        return;
    }

    bid = Number(bid);

    if (isNaN(bid) || bid <= currentBid) {

        alert("Your bid must be higher than ₹" + currentBid);
        return;

    }

    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];

    let auction = auctions.find(function(item) {
        return item.name === product;
    });

    if (auction) {

        auction.currentBid = bid;

        localStorage.setItem("auctions", JSON.stringify(auctions));

        // Save user's bid
        let myBids = JSON.parse(localStorage.getItem("myBids")) || [];

        myBids.push({
            product: product,
            bidAmount: bid,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("myBids", JSON.stringify(myBids));

        alert(
            "Bid placed successfully!\n\n" +
            "Product: " + product +
            "\nYour Bid: ₹" + bid
        );

        displayUserAuctions();
    }
}


// ===============================
// VIEW MY BIDS
// ===============================

function viewMyBids() {

    let myBids = JSON.parse(localStorage.getItem("myBids")) || [];

    if (myBids.length === 0) {

        alert("You have not placed any bids yet.");
        return;

    }

    let message = "MY BIDS\n\n";

    myBids.forEach(function(bid, index) {

        message +=
            (index + 1) + ". " +
            bid.product +
            " - ₹" +
            bid.bidAmount +
            "\nDate: " +
            bid.date +
            "\n\n";

    });

    alert(message);
}


// ===============================
// ADMIN LOGIN
// ===============================

document.getElementById("adminLoginForm")?.addEventListener("submit", function(event) {

    event.preventDefault();

    let username = document.getElementById("adminUsername").value;
    let password = document.getElementById("adminPassword").value;

    if (username === "jahnavi" && password === "12345") {

        localStorage.setItem("adminLoggedIn", "true");

        alert("Admin login successful!");

        window.location.href = "admin-dashboard.html";

    } else {

        alert("Invalid admin username or password.");

    }

});


// ===============================
// ADMIN LOGOUT
// ===============================

function adminLogout() {

    localStorage.removeItem("adminLoggedIn");

    window.location.href = "index.html";
}


// ===============================
// ADD AUCTION WITH IMAGE
// ===============================

document.getElementById("auctionForm")?.addEventListener("submit", function(event) {

    event.preventDefault();

    let productName = document.getElementById("productName").value;
    let startingBid = Number(document.getElementById("startingBid").value);
    let description = document.getElementById("description").value;

    let imageFile = document.getElementById("productImage").files[0];

    if (!imageFile) {

        alert("Please select a product image.");
        return;

    }

    let reader = new FileReader();

    reader.onload = function() {

        let auctions = JSON.parse(localStorage.getItem("auctions")) || [];

        let newAuction = {

            id: Date.now(),
            name: productName,
            startingBid: startingBid,
            currentBid: startingBid,
            description: description,
            image: reader.result

        };

        auctions.push(newAuction);

        localStorage.setItem("auctions", JSON.stringify(auctions));

        alert("Auction added successfully!");

        document.getElementById("auctionForm").reset();

        displayAdminAuctions();

    };

    reader.readAsDataURL(imageFile);

});


// ===============================
// DISPLAY ADMIN AUCTIONS
// ===============================

function displayAdminAuctions() {

    let list = document.getElementById("adminAuctionList");

    if (!list) {
        return;
    }

    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];

    list.innerHTML = "";

    if (auctions.length === 0) {

        list.innerHTML = "<p>No auction items added yet.</p>";
        return;

    }

    auctions.forEach(function(auction) {

        let item = document.createElement("div");

        item.className = "product";

        item.innerHTML = `
            <img src="${auction.image || ''}" alt="${auction.name}">
            <h2>${auction.name}</h2>
            <p>Starting Bid: ₹${auction.startingBid}</p>
            <p>Current Bid: ₹${auction.currentBid}</p>
            <p>${auction.description}</p>

            <button onclick="deleteAuction(${auction.id})">
                Delete
            </button>
        `;

        list.appendChild(item);

    });

}


// ===============================
// DELETE AUCTION
// ===============================

function deleteAuction(id) {

    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];

    auctions = auctions.filter(function(auction) {

        return auction.id !== id;

    });

    localStorage.setItem("auctions", JSON.stringify(auctions));

    displayAdminAuctions();

    alert("Auction deleted successfully!");
}


// ===============================
// DISPLAY USER AUCTIONS
// ===============================

function displayUserAuctions() {

    let list = document.getElementById("auctionList");

    if (!list) {
        return;
    }

    let auctions = JSON.parse(localStorage.getItem("auctions")) || [];

    list.innerHTML = "";

    if (auctions.length === 0) {

        list.innerHTML = "<p>No live auctions available.</p>";
        return;

    }

    auctions.forEach(function(auction) {

        let item = document.createElement("div");

        item.className = "product";

        item.innerHTML = `
            <img src="${auction.image || ''}" alt="${auction.name}">
            <h2>${auction.name}</h2>
            <p>Starting Bid: ₹${auction.startingBid}</p>
            <p>Current Bid: ₹${auction.currentBid}</p>
            <p>${auction.description}</p>

            <button onclick="placeBid('${auction.name}', ${auction.currentBid})">
                Bid Now
            </button>
        `;

        list.appendChild(item);

    });

}


// ===============================
// LOAD AUCTIONS
// ===============================

displayAdminAuctions();
displayUserAuctions();