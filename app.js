var newMemberAddBtn = document.querySelector(".addMemberBtn"),
  darkBg = document.querySelector(".dark_bg"),
  popupForm = document.querySelector(".popup"),
  crossBtn = document.querySelector(".closeBtn"),
  submitBtn = document.querySelector(".submitBtn"),
  modalTitle = document.querySelector(".modalTitle"),
  popupFooter = document.querySelector(".popupFooter"),
  imgInput = document.querySelector(".img"),
  imgHolder = document.querySelector(".imgholder");
(form = document.querySelector("form")),
  (formInputFields = document.querySelectorAll("form input")),
  (uploadimg = document.querySelector("#uploadimg")),
  (fName = document.getElementById("fName")),
  (lName = document.getElementById("lName")),
  (age = document.getElementById("age")),
  (city = document.getElementById("city")),
  (position = document.getElementById("position")),
  (salary = document.getElementById("salary")),
  (sDate = document.getElementById("sDate")),
  (email = document.getElementById("email")),
  (phone = document.getElementById("phone")),
  (entries = document.querySelector(".showEntries")),
  (tabSize = document.getElementById("table_size")),
  (userInfo = document.querySelector(".userInfo")),
  (table = document.querySelector("table")),
  (filterData = document.getElementById("search"));
let originalData = [];
let getData = [];
// Add event listeners to the table headers for sorting
document
  .getElementById("sortName")
  .addEventListener("click", () => sortData("fullname"));
document
  .getElementById("sortAge")
  .addEventListener("click", () => sortData("age"));
document
  .getElementById("sortCity")
  .addEventListener("click", () => sortData("city"));
document
  .getElementById("sortPosition")
  .addEventListener("click", () => sortData("position"));
document
  .getElementById("sortSalary")
  .addEventListener("click", () => sortData("salary"));
document
  .getElementById("sortStartDate")
  .addEventListener("click", () => sortData("startdate"));
document
  .getElementById("sortEmail")
  .addEventListener("click", () => sortData("email"));
document
  .getElementById("sortPhone")
  .addEventListener("click", () => sortData("phone"));

let sortDirection = 1; // 1 for ascending, -1 for descending

function sortData(field) {
  if (field === "fullname") {
    getData.sort((a, b) => {
      const nameA = (a.fName + " " + a.lName).toLowerCase();
      const nameB = (b.fName + " " + b.lName).toLowerCase();
      return compareStrings(nameA, nameB);
    });
  } else if (field === "age") {
    getData.sort((a, b) => (a.ageVal - b.ageVal) * sortDirection);
  } else if (field === "city") {
    getData.sort((a, b) =>
      compareStrings(a.cityVal.toLowerCase(), b.cityVal.toLowerCase())
    );
  } else if (field === "position") {
    getData.sort((a, b) =>
      compareStrings(a.positionVal.toLowerCase(), b.positionVal.toLowerCase())
    );
  } else if (field === "salary") {
    getData.sort(
      (a, b) =>
        (parseFloat(a.salaryVal) - parseFloat(b.salaryVal)) * sortDirection
    );
  } else if (field === "startdate") {
    getData.sort((a, b) => {
      const dateA = new Date(a.sDateVal);
      const dateB = new Date(b.sDateVal);
      return (dateA - dateB) * sortDirection;
    });
  } else if (field === "email") {
    getData.sort((a, b) =>
      compareStrings(a.emailVal.toLowerCase(), b.emailVal.toLowerCase())
    );
  } else if (field === "phone") {
    getData.sort((a, b) =>
      compareStrings(a.phoneVal.toLowerCase(), b.phoneVal.toLowerCase())
    );
  }

  // Toggle the sort direction for next click
  sortDirection = -sortDirection;

  // Refresh the displayed data after sorting
  showInfo();
  highlightIndexBtn();
}

// Helper function to compare strings with sort direction
function compareStrings(strA, strB) {
  if (strA < strB) return -1 * sortDirection;
  if (strA > strB) return 1 * sortDirection;
  return 0;
}

function fetchData() {
  fetch("https://671775f1b910c6a6e028532c.mockapi.io/api/members")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
      // Assuming data is an array of members
      originalData = data;
      getData = [...originalData];
      showInfo(); // Call showInfo to display the fetched data
      displayIndexBtn(); // Update the pagination
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Call the fetchData function to get the data when the page loads
fetchData();

let isEdit = false,
  editId;

var arrayLength = 0;
var tableSize = 10;
var startIndex = 1;
var endIndex = 0;
var currentIndex = 1;
var maxIndex = 0;

showInfo();

newMemberAddBtn.addEventListener("click", () => {
  isEdit = false;
  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
  popupFooter.style.display = "block";
  imgInput.src = "./img/pic1.png";
  darkBg.classList.add("active");
  popupForm.classList.add("active");
});

crossBtn.addEventListener("click", () => {
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  form.reset();
});

uploadimg.onchange = function () {
  if (uploadimg.files[0].size < 1000000) {
    // 1MB = 1000000
    var fileReader = new FileReader();

    fileReader.onload = function (e) {
      var imgUrl = e.target.result;
      imgInput.src = imgUrl;
    };

    fileReader.readAsDataURL(uploadimg.files[0]);
  } else {
    alert("This file is too large!");
  }
};

function preLoadCalculations() {
  array = getData;
  arrayLength = array.length;
  maxIndex = arrayLength / tableSize;

  if (arrayLength % tableSize > 0) {
    maxIndex++;
  }
}

function displayIndexBtn() {
  preLoadCalculations();

  const pagination = document.querySelector(".pagination");

  pagination.innerHTML = "";

  pagination.innerHTML =
    '<button onclick="prev()" class="prev">Previous</button>';

  for (let i = 1; i <= maxIndex; i++) {
    pagination.innerHTML +=
      '<button onclick= "paginationBtn(' +
      i +
      ')" index="' +
      i +
      '">' +
      i +
      "</button>";
  }

  pagination.innerHTML += '<button onclick="next()" class="next">Next</button>';

  highlightIndexBtn();
}

function highlightIndexBtn() {
  startIndex = (currentIndex - 1) * tableSize + 1;
  endIndex = startIndex + tableSize - 1;

  if (endIndex > arrayLength) {
    endIndex = arrayLength;
  }

  if (maxIndex >= 2) {
    var nextBtn = document.querySelector(".next");
    nextBtn.classList.add("act");
  }

  entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`;

  var paginationBtns = document.querySelectorAll(".pagination button");
  paginationBtns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.getAttribute("index") === currentIndex.toString()) {
      btn.classList.add("active");
    }
  });

  showInfo();
}

function showInfo() {
  document
    .querySelectorAll(".employeeDetails")
    .forEach((info) => info.remove());

  var tab_start = startIndex - 1;
  var tab_end = endIndex;

  if (getData.length > 0) {
    for (var i = tab_start; i < tab_end; i++) {
      var staff = getData[i];

      if (staff) {
        let createElement = `<tr class = "employeeDetails">
                <td>${i + 1}</td>
                <td><img src="${
                  staff.picture
                }" alt="" width="40" height="40"></td>
                <td>${staff.fName + " " + staff.lName}</td>
                <td>${staff.ageVal}</td>
                <td>${staff.cityVal}</td>
                <td>${staff.positionVal}</td>
                <td>${staff.salaryVal}</td>
                <td>${staff.sDateVal}</td>
                <td>${staff.emailVal}</td>
                <td>${staff.phoneVal}</td>
                <td>
                    <button onclick="readInfo('${staff.picture}', '${
          staff.fName
        }', '${staff.lName}', '${staff.ageVal}', '${staff.cityVal}', '${
          staff.positionVal
        }', '${staff.salaryVal}', '${staff.sDateVal}', '${staff.emailVal}', '${
          staff.phoneVal
        }')"><i class="fa-regular fa-eye"></i></button>

                    <button onclick="editInfo('${staff.id}', '${
          staff.picture
        }', '${staff.fName}', '${staff.lName}', '${staff.ageVal}', '${
          staff.cityVal
        }', '${staff.positionVal}', '${staff.salaryVal}', '${
          staff.sDateVal
        }', '${staff.emailVal}', '${
          staff.phoneVal
        }')"><i class="fa-regular fa-pen-to-square"></i></button><button onclick = "deleteInfo(${
          staff.id
        })"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`;

        userInfo.innerHTML += createElement;
        table.style.minWidth = "1400px";
      }
    }
  } else {
    function showLoadingInTable() {
      userInfo.innerHTML = `
        <tr class="employeeDetails">
          <td class="empty" colspan="11" align="center">
            <div class="loading-spinner"></div>
          </td>
        </tr>
      `;

      // Đảm bảo kích thước bảng như ban đầu
      table.style.minWidth = "1400px";
    }

    // CSS động cho spinner
    const style = document.createElement("style");
    style.innerHTML = `
      .loading-spinner {
        border: 6px solid #f3f3f3;
        border-top: 6px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }
    
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    // Gọi hàm khi cần hiển thị spinner
    showLoadingInTable();
  }
}

showInfo();

function readInfo(
  pic,
  fname,
  lname,
  Age,
  City,
  Position,
  Salary,
  SDate,
  Email,
  Phone
) {
  imgInput.src = pic;
  fName.value = fname;
  lName.value = lname;
  age.value = Age;
  city.value = City;
  position.value = Position;
  salary.value = Salary;
  sDate.value = SDate;
  email.value = Email;
  phone.value = Phone;

  darkBg.classList.add("active");
  popupForm.classList.add("active");
  popupFooter.style.display = "none";
  modalTitle.innerHTML = "Profile";
  formInputFields.forEach((input) => {
    input.disabled = true;
  });

  imgHolder.style.pointerEvents = "none";
}

function editInfo(
  id,
  pic,
  fname,
  lname,
  Age,
  City,
  Position,
  Salary,
  SDate,
  Email,
  Phone
) {
  isEdit = true;
  editId = id;

  // Find the index of the item to edit in the original data based on id
  const originalIndex = originalData.findIndex((item) => item.id === id);

  // Update the original data
  originalData[originalIndex] = {
    id: id,
    picture: pic,
    fName: fname,
    lName: lname,
    ageVal: Age,
    cityVal: City,
    positionVal: Position,
    salaryVal: Salary,
    sDateVal: SDate,
    emailVal: Email,
    phoneVal: Phone,
  };

  imgInput.src = pic;
  fName.value = fname;
  lName.value = lname;
  age.value = Age;
  city.value = City;
  position.value = Position;
  salary.value = Salary;
  sDate.value = SDate;
  email.value = Email;
  phone.value = Phone;

  darkBg.classList.add("active");
  popupForm.classList.add("active");
  popupFooter.style.display = "block";
  modalTitle.innerHTML = "Update the Form";
  submitBtn.innerHTML = "Update";
  formInputFields.forEach((input) => {
    input.disabled = false;
  });

  imgHolder.style.pointerEvents = "auto";
}

function deleteInfo(index) {
  const memberId = index; // Assuming each member has a unique ID

  if (confirm("Are you sure you want to delete?")) {
    // Send DELETE request to the API
    fetch(
      `https://671775f1b910c6a6e028532c.mockapi.io/api/members/${memberId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the member from originalData after successful deletion
        fetchData();
        preLoadCalculations();

        if (getData.length === 0) {
          currentIndex = 1;
          startIndex = 1;
          endIndex = 0;
        } else if (currentIndex > maxIndex) {
          currentIndex = maxIndex;
        }

        showInfo(); // Refresh the displayed list
        highlightIndexBtn(); // Highlight the active page
        displayIndexBtn(); // Update pagination buttons

        var nextBtn = document.querySelector(".next");
        var prevBtn = document.querySelector(".prev");

        if (Math.floor(maxIndex) > currentIndex) {
          nextBtn.classList.add("act");
        } else {
          nextBtn.classList.remove("act");
        }

        if (currentIndex > 1) {
          prevBtn.classList.add("act");
        }
      })
      .catch((error) => console.error("Error deleting member:", error));
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const information = {
    createAt: new Date().toISOString(),
    picture: imgInput.src === undefined ? "./img/pic1.png" : imgInput.src,
    fName: fName.value,
    lName: lName.value,
    ageVal: age.value,
    cityVal: city.value,
    positionVal: position.value,
    salaryVal: salary.value,
    sDateVal: sDate.value,
    emailVal: email.value,
    phoneVal: phone.value,
  };

  if (!isEdit) {
    // Add new member using POST
    fetch("https://671775f1b910c6a6e028532c.mockapi.io/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(information),
    })
      .then((response) => response.json())
      .then((data) => {
        originalData.unshift(data); // Add the newly created member to originalData
        getData = [...originalData]; // Update getData
        showInfo(); // Refresh the displayed list
        displayIndexBtn(); // Update pagination
      })
      .catch((error) => console.error("Error adding member:", error));
  } else {
    // Update existing member using PUT
    fetch(`https://671775f1b910c6a6e028532c.mockapi.io/api/members/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(information),
    })
      .then((response) => response.json())
      .then((data) => {
        const originalIndex = originalData.findIndex(
          (item) => item.id === editId
        );
        originalData[originalIndex] = data; // Update the member in originalData
        getData = [...originalData]; // Update getData
        showInfo(); // Refresh the displayed list
        displayIndexBtn(); // Update pagination
      })
      .catch((error) => console.error("Error updating member:", error));
  }

  submitBtn.innerHTML = "Submit";
  modalTitle.innerHTML = "Fill the Form";
  darkBg.classList.remove("active");
  popupForm.classList.remove("active");
  form.reset();

  // Update button states
  highlightIndexBtn();
  var nextBtn = document.querySelector(".next");
  var prevBtn = document.querySelector(".prev");
  if (Math.floor(maxIndex) > currentIndex) {
    nextBtn.classList.add("act");
  } else {
    nextBtn.classList.remove("act");
  }

  if (currentIndex > 1) {
    prevBtn.classList.add("act");
  }
});

function next() {
  var prevBtn = document.querySelector(".prev");
  var nextBtn = document.querySelector(".next");

  if (currentIndex <= maxIndex - 1) {
    currentIndex++;
    prevBtn.classList.add("act");

    highlightIndexBtn();
  }

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove("act");
  }
}

function prev() {
  var prevBtn = document.querySelector(".prev");

  if (currentIndex > 1) {
    currentIndex--;
    prevBtn.classList.add("act");
    highlightIndexBtn();
  }

  if (currentIndex < 2) {
    prevBtn.classList.remove("act");
  }
}

function paginationBtn(i) {
  currentIndex = i;

  var prevBtn = document.querySelector(".prev");
  var nextBtn = document.querySelector(".next");

  highlightIndexBtn();

  if (currentIndex > maxIndex - 1) {
    nextBtn.classList.remove("act");
  } else {
    nextBtn.classList.add("act");
  }

  if (currentIndex > 1) {
    prevBtn.classList.add("act");
  }

  if (currentIndex < 2) {
    prevBtn.classList.remove("act");
  }
}

tabSize.addEventListener("change", () => {
  var selectedValue = parseInt(tabSize.value);
  tableSize = selectedValue;
  currentIndex = 1;
  startIndex = 1;
  displayIndexBtn();
});

filterData.addEventListener("input", () => {
  const searchTerm = filterData.value.toLowerCase().trim();

  if (searchTerm !== "") {
    const filteredData = originalData.filter((item) => {
      const fullName = (item.fName + " " + item.lName).toLowerCase();
      const city = item.cityVal.toLowerCase();
      const position = item.positionVal.toLowerCase();

      return (
        fullName.includes(searchTerm) ||
        city.includes(searchTerm) ||
        position.includes(searchTerm)
      );
    });

    // Update the current data with filtered data
    getData = filteredData;
  } else {
    // If searchTerm is empty, reset getData to originalData
    getData = [...originalData]; // Use the full list of original data
  }

  currentIndex = 1; // Reset to the first index
  startIndex = 1; // Reset start index
  displayIndexBtn(); // Update pagination
  showInfo(); // Refresh the displayed list
});

displayIndexBtn();
