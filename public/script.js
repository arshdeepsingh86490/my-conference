const registrationForm =
    document.getElementById("registrationForm");

const confirmation =
    document.getElementById("confirmation");

registrationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const collegeNumber = document.getElementById("number").value.trim();
    const eventName = document.getElementById("event").value;

    // Check phone number
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    // Get previous registrations
    let registrations = [];

    try {
        registrations = JSON.parse(
            localStorage.getItem("conferenceRegistrations") || "[]"
        );

        if (!Array.isArray(registrations)) {
            registrations = [];
        }
    } catch (error) {
        alert("Unable to read saved registrations.");
        return;
    }

    // Check duplicate registration
    const duplicate = registrations.some(function(reg) {
        return reg.email.toLowerCase() === email.toLowerCase()
            && reg.eventName === eventName;
    });

    if (duplicate) {
        alert("This email is already registered for this event.");
        return;
    }

    // Generate Registration ID
    const registrationID =
        "MC-" + Date.now().toString().slice(-8);

    // Create registration record
    const registration = {
        registrationID: registrationID,
        name: name,
        email: email,
        phone: phone,
        collegeNumber: collegeNumber,
        eventName: eventName,
        date: new Date().toLocaleDateString()
    };

    registrations.push(registration);

    // Save registration in browser
    try {
        localStorage.setItem(
            "conferenceRegistrations",
            JSON.stringify(registrations)
        );
    } catch (error) {
        alert("Unable to save registration. Please try again.");
        return;
    }

    // Show confirmation
    confirmation.hidden = false;
    confirmation.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Registration Successful!";

    const message = document.createElement("p");
    message.textContent =
        "Thank you for registering with My Conference.";

    const details = [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["College Registration Number", collegeNumber],
        ["Conference", eventName],
        ["Registration ID", registrationID],
        ["Registration Date", registration.date]
    ];

    confirmation.append(heading, message);

    details.forEach(function(item) {
        const paragraph = document.createElement("p");
        paragraph.textContent = item[0] + ": " + item[1];
        confirmation.appendChild(paragraph);
    });

    // Print admit card button
    const printButton = document.createElement("button");
    printButton.type = "button";
    printButton.textContent = "Print Admit Card";

    printButton.addEventListener("click", function() {
        window.print();
    });

    confirmation.appendChild(printButton);

    registrationForm.reset();

    confirmation.scrollIntoView({
        behavior: "smooth"
    });
});