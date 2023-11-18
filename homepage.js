// Add a counter to generate unique IDs for contacts
var contactIdCounter = 0;

// Variable to track whether the form is in edit mode
var editMode = false;

//display dialog box
function openDialog() {
  var addItemDialog = document.getElementById("addItemDialog");
  addItemDialog.showModal();
}

function closeDialog() {
  var addItemDialog = document.getElementById("addItemDialog");
  addItemDialog.close();
}

// add the form fields data
function addItem() {
  var form = document.getElementById("addItemForm");
  // Retrieve form data
  var formData = {
    id: editMode ? selectedContactId : contactIdCounter + 1, // Use selectedContactId in edit mode
    name: form.elements["name"].value,
    email: form.elements["email"].value,
    mobilenumber: form.elements["mobilenumber"].value,
    landline: form.elements["landline"].value,
    website: form.elements["website"].value,
    address: form.elements["address"].value,
  };
  console.log("formmmmm", formData);
  if (typeof Storage !== "undefined") {
    var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
    if (editMode) {
      // Update existing contact in edit mode
      var existingContactIndex = storedData.findIndex(
        (item) => item.id === selectedContactId
      );
      if (existingContactIndex !== -1) {
        storedData[existingContactIndex] = formData;
      }
    } else {
      // Add new contact in add mode
      storedData.push(formData);
      contactIdCounter++;
    }
    localStorage.setItem("addressBook", JSON.stringify(storedData));
    alert(
      editMode ? "Contact updated successfully." : "Data added successfully."
    );
    closeDialog();
    form.reset();
    editMode = false; // Reset edit mode after adding/updating contact
    // contactIdCounter++;
    displayContacts();
  }
}

// Function to display contact details when a contact card is clicked
function displayContactDetails(selectedId) {
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
  var contact = storedData.find((item) => item.id === selectedId);
  var detailsContainer = document.getElementById("contactDetails");
  detailsContainer.innerHTML = ""; // Clear previous content
  var detailsCard = document.createElement("div");
  detailsCard.className = "details-card";
  if (contact) {
    detailsCard.innerHTML += `

  <span class="edit-icon" onclick="editContact(${contact.id})">
    
     <img src="assets/edit1.jpg" alt="Edit" title="Edit"> Edit
  </span>

      <span class="delete-icon" onclick="deleteContact(${contact.id})">
        <img src="assets/delete1.png" alt="Delete" title="Delete"> Delete
      </span>
      <p><strong><h2>${contact.name}</h2></strong> </p>`;

    for (var field in contact) {
      if (field !== "name" && field !== "id") {
        detailsCard.innerHTML += `<p><strong>${field}:</strong> ${contact[field]}</p>`;
      }
    }
    // Set the edit mode to true and store the selected contact ID
    editMode = true;
    selectedContactId = contact.id;
  } else {
    detailsCard.innerHTML = "<p>No contact selected</p>";
  }
  detailsContainer.appendChild(detailsCard);
}

// Function to create a contact card with onclick attribute
function createContactCard(contact) {
  var contactCard = document.createElement("div");
  contactCard.className = "contact-card";
  contactCard.setAttribute(
    "onclick",
    `displayContactDetails(${contact.id}); markAsActive(this);`
  );
  // Create content for the contact card
  contactCard.innerHTML = `
      <p>${contact.name}</p>
      <p>${contact.email}</p>
      <p>${contact.mobilenumber}</p>
        `;
  contactCard.dataset.id = contact.id; // Set the id as a data attribute
  return contactCard;
}

// Function to display contacts from local storage
function displayContacts() {
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
  var contactsContainer = document.getElementById("contactsContainer");
  contactsContainer.innerHTML = ""; // Clear previous content
  // Iterate over the stored data and create HTML elements
  storedData.forEach(function (contact) {
    var contactCard = createContactCard(contact);
    contactsContainer.appendChild(contactCard);
  });
}
displayContacts();

// Function to mark a contact card as active
function markAsActive(card, index) {
  // Check if there are contact cards before attempting to remove the class
  var contactCards = document.getElementsByClassName("contact-card");

  // Remove active class from all contact cards
  for (var i = 0; i < contactCards.length; i++) {
    contactCards[i].classList.remove("active");
  }
  // Add active class to the clicked contact card
  card.classList.add("active");
  // Store the index for later use (deletion)
  selectedContactIndex = index;
}

// Function to delete a contact by ID
function deleteContact(contactId) {
  // Retrieve data from local storage
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];

  // Find the index of the contact with the specified ID
  var contactIndex = storedData.findIndex((item) => item.id === contactId);

  if (contactIndex !== -1) {
    // Remove the contact at the specified index
    storedData.splice(contactIndex, 1);

    // Update local storage with the modified data
    localStorage.setItem("addressBook", JSON.stringify(storedData));

    // Display updated contacts
    displayContacts();

    // Clear the details card after deleting the contact
    var detailsContainer = document.getElementById("contactDetails");
    detailsContainer.innerHTML = "";

    // Optionally, you can display an alert or perform other actions
    alert("Contact deleted successfully.");
  } else {
    // Handle the case where the contact is not found
    alert("Contact not found.");
  }
}

function editContact(contactId) {
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
  var contact = storedData.find((item) => item.id === contactId);

  if (contact) {
    // Populate the form fields with the contact details
    document.getElementById("name").value = contact.name;
    document.getElementById("email").value = contact.email;
    document.getElementById("mobilenumber").value = contact.mobilenumber;
    document.getElementById("landline").value = contact.landline;
    document.getElementById("website").value = contact.website;
    document.getElementById("address").value = contact.address;

    // Open the dialog for editing
    openDialog();
  } else {
    alert("Contact not found.");
  }
}

function cancelDialog() {
  var form = document.getElementById("addItemForm");
  form.reset();
  closeDialog();
}