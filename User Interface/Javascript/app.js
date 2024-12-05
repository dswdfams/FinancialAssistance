// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDiOsr6bY5BDKdiBPRzDgSpurHdkkUlc3k",
    authDomain: "sia101-d60a1.firebaseapp.com",
    databaseURL: "https://sia101-d60a1-default-rtdb.firebaseio.com",
    projectId: "sia101-d60a1",
    storageBucket: "sia101-d60a1.appspot.com",
    messagingSenderId: "258109532727",
    appId: "1:258109532727:web:73d735dc749d2cb4ebedb2"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to fetch and display all applications
async function populateApplicationsTable() {
    const sortBy = document.getElementById('sortBy').value;
    try {
        const applicationsRef = database.ref('Residents');
        const snapshot = await applicationsRef.once('value');
        const applicationsData = snapshot.val();

        if (!applicationsData) {
            alert('No applications found.');
            return;
        }

        const applicationsBody = document.getElementById('applicationsBody');
        applicationsBody.innerHTML = ''; // Clear any existing data in the table body

        // Convert the applications data to an array for sorting
        const applicationsArray = Object.keys(applicationsData).map(key => {
            const application = applicationsData[key];
            return { ...application, residentId: key };
        });

        // Sort the data based on the selected criteria
        applicationsArray.sort((a, b) => {
            if (sortBy === 'typeOfAssistance') {
                return a.typeOfAssistance.localeCompare(b.typeOfAssistance);
            } else if (sortBy === 'status') {
                return a.status.localeCompare(b.status);
            }
            return 0;
        });

        // Loop through all applications and add a row for each one
        applicationsArray.forEach(application => {
            const row = document.createElement('tr');

            // Create table cells for each application detail
            const residentIdCell = document.createElement('td');
            residentIdCell.textContent = application.residentId;
            row.appendChild(residentIdCell);

            const fullNameCell = document.createElement('td');
            fullNameCell.textContent = `${application.firstName} ${application.middleName || ''} ${application.lastName}`;
            row.appendChild(fullNameCell);

            const precinctNumberCell = document.createElement('td');
            precinctNumberCell.textContent = application.precinctNumber;
            row.appendChild(precinctNumberCell);

            const addressCell = document.createElement('td');
            addressCell.textContent = application.address;
            row.appendChild(addressCell);

            const contactNumberCell = document.createElement('td');
            contactNumberCell.textContent = application.mobileNumber;
            row.appendChild(contactNumberCell);

            const typeOfAssistanceCell = document.createElement('td');
            typeOfAssistanceCell.textContent = application.typeOfAssistance;
            row.appendChild(typeOfAssistanceCell);

            const documentsCell = document.createElement('td');
            documentsCell.textContent = application.documents.join(', '); // Assuming documents are stored as an array
            row.appendChild(documentsCell);

            const statusCell = document.createElement('td');
            const statusSelect = document.createElement('select');
            const statusOptions = ['Pending', 'Accepted', 'Rejected'];

            statusOptions.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if (application.status === status) {
                    option.selected = true;
                }
                statusSelect.appendChild(option);
            });
            statusCell.appendChild(statusSelect);
            row.appendChild(statusCell);

            const remarksCell = document.createElement('td');
            const remarksTextarea = document.createElement('textarea');
            remarksTextarea.value = application.rejectionRemarks || '';
            remarksCell.appendChild(remarksTextarea);
            row.appendChild(remarksCell);

            // Create actions buttons
            const actionsCell = document.createElement('td');
            const actionButtons = document.createElement('div');
            actionButtons.classList.add('action-btns');
            
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update Status';
            updateButton.onclick = () => updateVerificationStatus(application.residentId, statusSelect.value, remarksTextarea.value);
            actionButtons.appendChild(updateButton);

            actionsCell.appendChild(actionButtons);
            row.appendChild(actionsCell);

            applicationsBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        alert('An error occurred while fetching applications.');
    }
}

// Function to update the verification status of an application
async function updateVerificationStatus(residentId, status, rejectionRemarks) {
    try {
        const applicationRef = database.ref('Residents/' + residentId);
        const updatedData = {
            status: status,
            rejectionRemarks: status === 'Rejected' ? rejectionRemarks : null
        };

        await applicationRef.update(updatedData); // Update Firebase with new status and remarks
        alert('Beneficiary status updated successfully!');
    } catch (error) {
        console.error('Error updating status:', error);
        alert('An error occurred while updating the status.');
    }
}

// Run the populateApplicationsTable function on page load
window.onload = populateApplicationsTable;
