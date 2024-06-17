let currentCharts = []
let currentStatisticTable = null
let headers = null
let studentDataList = null
let courseName = null

async function drawCharts() {
    if (currentCharts.length > 0) {
        return
    }
    const courseId = document.getElementById('course').value

    const data = await fetch(`/courses/${courseId}/score_statistic/`).then(res => res.json())

    if (data) {
        drawTable(data)
        const chartArea = document.getElementById('chart')
        data.forEach(item => {
            const labels = []
            const currentData = []
            let name = null
            Object.keys(item).forEach(key => {
                switch (key) {
                    case "bad": {
                        currentData.push(item[key])
                        labels.push('Less than 5')
                        break
                    }
                    case "average": {
                        currentData.push(item[key])
                        labels.push("From 5 to 8")
                        break
                    }
                    case "good": {
                        currentData.push(item[key])
                        labels.push("Greater than 8")
                        break
                    }
                    case "name": {
                        if (item[key] === "mid-term") {
                            name = "Mid Term"
                        } else if (item[key] === "end-term") {
                            name = "End Term"
                        } else {
                            name = item[key]
                        }
                    }
                }
            })
            const chartData = {
                labels: labels,
                datasets: [
                    {
                        labels: 'Quantity',
                        data: currentData
                    }
                ]
            }
            const chartConfig = {
                type: 'pie',
                data: chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        },
                        title: {
                            display: true,
                            text: name
                        }
                    }
                },
            }
            const newChartElement = document.createElement('canvas')
            chartArea.appendChild(newChartElement)
            const newChart = new Chart(newChartElement, chartConfig)
            currentCharts.push(newChart)


        })
    }
}

function drawTable(data) {
    const statisticTableArea = document.getElementById("statisticDetail")
    const tableHeaders = Object.keys(data[0]).map(key => key)
    const tableElement = document.createElement('table')
    tableElement.classList.add("table")
    tableElement.classList.add("table-stripped")
    const tableHeaderElement = document.createElement("thead")
    const trHeader = document.createElement('tr')
    tableHeaders.forEach(h => {
        const head = document.createElement("th")
        head.innerText = h
        trHeader.appendChild(head)
    })
    tableHeaderElement.appendChild(trHeader)
    tableElement.appendChild(tableHeaderElement)
    const tableBodyElement = document.createElement('tbody')
    data.forEach(d => {
        const tr = document.createElement('tr')
        const vals = Object.values(d)
        vals.forEach(v => {
            const td = document.createElement('td')

            td.innerText = v
            tr.appendChild(td)
        })
        tableBodyElement.appendChild(tr)
    })
    tableElement.appendChild(tableBodyElement)
    currentStatisticTable = tableElement
    statisticTableArea.appendChild(tableElement)
}

function closeAllChart() {

    currentCharts.forEach(c => {
        c.destroy()
    })
    currentCharts = []
    const c = document.getElementById('chart')
    while (c.firstChild) {
        c.removeChild(c.firstChild)
    }
}

function closeTable() {
    if (currentStatisticTable === null) {
        return
    }
    const statisticTableArea = document.getElementById("statisticDetail")
    statisticTableArea.removeChild(currentStatisticTable)
}

document.getElementById('course').addEventListener('change', async (event) => {
    closeAllChart()
    closeTable()
    const courseId = event.target.value
    event.target.disabled = true

    const currentScoreData = await fetch(`/courses/${courseId}/all_scores`).then(res => res.json())
    if (currentScoreData) {
        // overall data
        document.getElementById('courseId').innerText = `ID: ${currentScoreData.id}`
        document.getElementById('courseName').innerText = `Name: ${currentScoreData.name}`
        document.getElementById('courseSubject').innerText = `Subject: ${currentScoreData.subject.name}`
        document.getElementById('courseLecturer').innerText = `Lecturer: ${currentScoreData.lecturer.first_name} ${currentScoreData.lecturer.last_name}`
        document.getElementById('courseTotalStudent').innerText = `Total student:: ${currentScoreData.total_student}`

        //table

        await extractStudentScoreData(currentScoreData)


        const studentTableArea = document.getElementById('scoreTable')
        while (studentTableArea.firstChild) {
            studentTableArea.removeChild(studentTableArea.firstChild)
        }
        const studentTable = document.createElement('table')
        studentTable.classList.add('table', 'table-stripped')
        const studentTableHeader = document.createElement("thead")
        const studentTableHeaderRow = document.createElement("tr")
        headers.forEach(head => {
            const h = document.createElement('th')
            h.innerText = head
            studentTableHeaderRow.appendChild(h)
        })
        studentTableHeader.appendChild(studentTableHeaderRow)
        studentTable.appendChild(studentTableHeader)
        const studentTableBody = document.createElement('tbody')
        studentDataList.forEach(studentData => {
            const studentTableBodyRow = document.createElement('tr')
            studentData.forEach(data => {
                const dataCell = document.createElement('td')
                dataCell.innerText = data
                studentTableBodyRow.appendChild(dataCell)
            })
            studentTableBody.appendChild(studentTableBodyRow)
        })
        studentTable.appendChild(studentTableBody)
        studentTableArea.appendChild(studentTable)

        event.target.disabled = false
    }
})

function extractStudentScoreData(currentScoreData) {
    courseName = currentScoreData['name']
    headers = ['ID', 'FIRST NAME', 'LAST NAME', 'EMAIL', 'GENDER']
    const scoreHeaders = currentScoreData['score_columns'].map(col => {
        if (col['name'] === 'mid-term') {
            return "MID TERM"
        } else if (col['name'] === 'end-term') {
            return "END TERM"
        } else return col['name']
    })

    headers = headers.concat(scoreHeaders)
    headers.push("SUMMARY")

    studentDataList = []
    currentScoreData['students'].forEach(student => {
        const studentData = []
        studentData.push(student['student']['id'])
        studentData.push(student['student']['first_name'])
        studentData.push(student['student']['last_name'])
        studentData.push(student['student']['email'])
        if (student['student']['gender']) {
            studentData.push(
                "Male"
            )
        } else studentData.push(
            "Female"
        )
        student['scores'].forEach(score => {
            studentData.push(score['score'])
        })
        studentData.push(student['summary_score'])
        studentDataList.push(studentData)
    })
}


const options = {
    root: null,
    threshold: 0,
    rootMargin: '0px',
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {

            drawCharts()
        }
    });
});


async function exportData(element) {
    element.disabled = true
    const courseId = document.getElementById('course').value
    if (headers === null || studentDataList === null) {
        const currentScoreData = await fetch(`/courses/${courseId}/all_scores`).then(res => res.json())
        await extractStudentScoreData(currentScoreData)

    }
    const type = document.querySelector('input[name="export_type"]:checked').value
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([headers])
    XLSX.utils.sheet_add_aoa(worksheet, studentDataList, {origin: "A2", skipHeader: true})
    XLSX.utils.book_append_sheet(workbook, worksheet, "Score")
    if (type === 'excel') {

        XLSX.writeFile(workbook, `${courseName}_score.xlsx`)
    } else if (type === 'pdf') {
        html = XLSX.utils.sheet_to_html(worksheet)

        html2pdf(html, {
            margin: 25,
            filename: `${courseName}_score.pdf`,
            html2canvas: {scale: 2, logging: true, dpi: 192, letterRendering: true},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'}
        })
    }
    element.disabled = false
}

const chart = document.getElementById('chart')
observer.observe(chart, options)