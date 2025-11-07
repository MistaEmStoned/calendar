const calendarBody = document.getElementById("calendar-body");
const monthTitle = document.getElementById("month");
const yearTitle = document.getElementById("year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// Start with current date
let currentDate = new Date(); // Today

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const API_KEY = "m2Sr3LcmKEQle8PXPBx1h8n0WC3nffUs"; // replace with your Calendarific key
const COUNTRY = "PH";

let holidayList = [];

async function fetchHolidays(year) {
  holidayList = [];
  try {
    const url = `https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${COUNTRY}&year=${year}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.response && data.response.holidays) {
      holidayList = data.response.holidays.map(h => ({
        date: h.date.iso.split("T")[0],
        name: h.name
      }));
    }
  } catch (error) {
    console.error("Failed to fetch holidays:", error);
    holidayList = [];
  }
}

function generateCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  monthTitle.textContent = months[month];
  yearTitle.textContent = year;

  calendarBody.innerHTML = "";

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const lastDay = new Date(year, month + 1, 0).getDate();

  let dayCounter = 1;

  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");

      if (i === 0 && j < firstDay) {
        row.appendChild(cell);
        continue;
      }

      if (dayCounter > lastDay) {
        row.appendChild(cell);
        continue;
      }

      const fullDate = `${year}-${String(month+1).padStart(2,'0')}-${String(dayCounter).padStart(2,'0')}`;
      let innerHTML = dayCounter;

      const holiday = holidayList.find(h => h.date === fullDate);
      if (holiday) {
        innerHTML += `<br><span class="holidaylb">${holiday.name}</span>`;
        cell.classList.add("holiday");
      }

      if (j >= 5) cell.classList.add("weekend");

      const today = new Date();
      if (
        dayCounter === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        innerHTML = `<span class="today">${dayCounter}</span>`;
      }

      cell.innerHTML = innerHTML;
      row.appendChild(cell);
      dayCounter++;
    }
    calendarBody.appendChild(row);
  }
}

async function renderCalendar() {
  // show loader
  calendarBody.innerHTML = "<tr><td colspan='7'>Loading...</td></tr>";
  await fetchHolidays(currentDate.getFullYear());
  generateCalendar(currentDate);
}

prevBtn.addEventListener("click", async () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  await renderCalendar();
});

nextBtn.addEventListener("click", async () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  await renderCalendar();
});

renderCalendar();
