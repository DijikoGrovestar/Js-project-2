// Add a counter to generate unique IDs for contacts
var contactIdCounter = 0;

// var selectedContactId = null;

// Variable to track whether the form is in edit mode
var editMode = false;

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
  
  var formData = {
    // editMode ? selectedContactId :
    id:  contactIdCounter++,
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
      var existingContactIndex = storedData.findIndex(
        (item) => item.id === selectedContactId
      );
      if (existingContactIndex !== -1) {
        storedData[existingContactIndex] = formData;
      }
    } else {
      storedData.push(formData);
      // contactIdCounter++;
    }
    localStorage.setItem("addressBook", JSON.stringify(storedData));
    alert(
      editMode ? "Contact updated successfully." : "Data added successfully."
    );
    closeDialog();
    form.reset();
    editMode = false;
    displayContacts();
    // // Reload the page for the next continuous ID
    // window.location.reload();
  }
}

// Function to display contact details when a contact card is clicked
function displayContactDetails(selectedId) {
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
  console.log("stored dataaa", storedData)
  var contact = storedData.find((item) => item.id === selectedId);
  console.log("contacttt",contact)
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
    `displayContactDetails(${contact.id}); markAsActive(this, ${contact.id});`
  );
  // Create content for the contact card
  contactCard.innerHTML = `
      <p>${contact.name}</p>
      <p>${contact.email}</p>
      <p>${contact.mobilenumber}</p>
        `;
  contactCard.dataset.id = contact.id;
  return contactCard;
}

// Function to display contacts from local storage
function displayContacts() {
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
  var contactsContainer = document.getElementById("contactsContainer");
  contactsContainer.innerHTML = "";
  storedData.forEach(function (contact) {
    var contactCard = createContactCard(contact);
    contactsContainer.appendChild(contactCard);
  });
}
displayContacts();

// Function to mark a contact card as active
function markAsActive(card, id) {
  var contactCards = document.getElementsByClassName("contact-card");
  for (var i = 0; i < contactCards.length; i++) {
    contactCards[i].classList.remove("active");
  }
  // Add active class to the clicked contact card
  card.classList.add("active");
  selectedContactId = id;
}

// Function to delete a contact by ID
function deleteContact(contactId) {
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
  var contactIndex = storedData.findIndex((item) => item.id === contactId);
  if (contactIndex !== -1) {
    storedData.splice(contactIndex, 1);
    localStorage.setItem("addressBook", JSON.stringify(storedData));
    displayContacts();
    var detailsContainer = document.getElementById("contactDetails");
    detailsContainer.innerHTML = "";
    alert("Contact deleted successfully.");
  } else {
    alert("Contact not found.");
  }
}

function editContact(contactId) {
  var storedData = JSON.parse(localStorage.getItem("addressBook")) || [];
  var contact = storedData.find((item) => item.id === contactId);
  if (contact) {
    document.getElementById("name").value = contact.name;
    document.getElementById("email").value = contact.email;
    document.getElementById("mobilenumber").value = contact.mobilenumber;
    document.getElementById("landline").value = contact.landline;
    document.getElementById("website").value = contact.website;
    document.getElementById("address").value = contact.address;
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
