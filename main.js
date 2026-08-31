// --- Custom Login and Dashboard Logic ---
document.addEventListener('DOMContentLoaded', () => {

    const defaultData = [
        {
            name: 'محمد عيد عبدالغنى الديب', email: 'mohamed.121140@dnt.mti.edu.eg', id: '121140',
            term: 'Summer Oral&Dental 2026',
            grades: [ 
                { material: 'General histology (GMS 113)', grade: 'C' },
                { material: 'Bio Chemistry 2 (GMS 121)', grade: 'B-' },
                { material: 'Dental Anatomy (DA 111)', grade: 'C' }
            ]
        },
        {
            name: 'محمد عيد عبدالغنى الديب', email: 'mohamed.121140@dnt.mti.edu.eg', id: '121140',
            term: '2026 -SPRING -Oral and Dental Medicine',
            grades: [ { material: 'General histology (GMS 113)', grade: 'F' } ]
        },
        {
            name: 'محمد عيد عبدالغنى الديب', email: 'mohamed.121140@dnt.mti.edu.eg', id: '121140',
            term: 'oral & dental fall 2025',
            grades: [
                { material: 'General Anatomy (GMS 112)', grade: 'B-' },
                { material: 'General histology (GMS 113)', grade: 'F' },
                { material: 'Bio Chemistry (GMS 111)', grade: 'F' },
                { material: 'Computer (CSC 111)', grade: 'C-' },
                { material: 'Dental Anatomy (DA 111)', grade: 'F' },
                { material: 'English (ENG 111)', grade: 'D' },
                { material: 'Physiology (GMS 114)', grade: 'C' }
            ]
        }
    ];

    // Check existing data
    let existingStudents = JSON.parse(localStorage.getItem('studentsData'));
    
    // If NO data at all (like visiting on github pages for the first time), set default data
    if (!existingStudents || existingStudents.length === 0) {
        existingStudents = defaultData;
        localStorage.setItem('studentsData', JSON.stringify(existingStudents));
    } else {
        // Migration to fix typo and update specific grades automatically for existing users
        let updated = false;
        existingStudents.forEach(s => {
            // Fix email typo
            if (s.email === 'mohamed.121140@dnt.mti.edu') {
                s.email = 'mohamed.121140@dnt.mti.edu.eg';
                updated = true;
            }
            // Update grades for Summer term from F to C if they haven't been edited
            if (s.term === 'Summer Oral&Dental 2026') {
                s.grades.forEach(g => {
                    if (g.material.includes('GMS 113') && g.grade === 'F') { g.grade = 'C'; updated = true; }
                    if (g.material.includes('DA 111') && g.grade === 'F') { g.grade = 'C'; updated = true; }
                });
                
                // Add the missing Bio Chemistry 2 if it's the very old default that only had one grade
                if (s.grades.length === 1 && s.grades[0].material.includes('GMS 112')) {
                    s.grades = [ 
                        { material: 'General histology (GMS 113)', grade: 'C' },
                        { material: 'Bio Chemistry 2 (GMS 121)', grade: 'B-' },
                        { material: 'Dental Anatomy (DA 111)', grade: 'C' }
                    ];
                    updated = true;
                }
            }
        });
        if (updated) {
            localStorage.setItem('studentsData', JSON.stringify(existingStudents));
        }
    }
    
    // --- 1. Login Page Logic (student.html) ---
    const loginEmailBtn = document.getElementById('ctl00_Main_btnLoginEmail');
    const emailInput = document.getElementById('ctl00_Main_txtEmail');

    if (loginEmailBtn && emailInput) {
        loginEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim().toLowerCase();
            if (email) {
                localStorage.setItem('loggedInEmail', email);
                window.location.href = 'Result.html?ID=381';
            } else {
                alert('الرجاء إدخال البريد الإلكتروني');
            }
        });
        loginEmailBtn.href = '#';
    }

    // --- 2. Dashboard / Result Page Logic (Result.html) ---
    const mainArea = document.querySelector('.col-md-9.col-sm-12');
    const logoutBtn = document.getElementById('ctl00_btnOut');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInEmail');
            window.location.href = 'student.html';
        });
    }
    
    if (mainArea && !document.getElementById('ctl00_Main_btnLoginEmail')) {
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        if (!loggedInEmail) {
            window.location.href = 'student.html';
            return;
        }

        const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
        const studentResults = studentsData.filter(s => s.email.toLowerCase() === loggedInEmail.toLowerCase());

        const nameSidebar = document.getElementById('student-name-sidebar');
        const idSidebar = document.getElementById('student-id-sidebar');
        const sidebarTaskList = document.querySelector('#lap0 #task-list'); // inside Results accordion

        if (studentResults.length > 0) {
            const studentInfo = studentResults[0];
            if (nameSidebar) nameSidebar.textContent = studentInfo.name;
            if (idSidebar) idSidebar.textContent = studentInfo.id;
            
            // Populate Sidebar Accordion (Results)
            if (sidebarTaskList) {
                let sbHtml = '';
                studentResults.forEach((res, idx) => {
                    sbHtml += `
                        <a href="#" class="list-group-item term-link" data-index="${idx}">
                            ${res.term} <span class="badge label-primary pull-right" style="background-color: #777;"> <i class="fa-solid fa-chevron-right"></i></span>
                        </a>
                    `;
                });
                sidebarTaskList.innerHTML = sbHtml;
            }

            // Function to render Task List (Main Dashboard)
            window.renderDashboard = function() {
                let html = `
                <div class="block news">
                    <div class="title">
                        <div class="cat-name">Student Dashboard</div>
                        <div class="content" style="padding:10px;">
                            <div class="panel-body" style="padding-left:15px; padding-bottom:15px;">
                                <strong>Welcome <br> ${studentInfo.name}</strong><br><br>
                                <strong>Please select a feature from Task List</strong>
                            </div>
                            <div class="list-group" id="main-task-list">
                `;
                
                studentResults.forEach((res, idx) => {
                    html += `
                        <a href="#" class="list-group-item term-link" data-index="${idx}">
                            ${res.term} <span class="badge label-primary pull-right" style="background-color: #ffb600;"> <i class="fa-solid fa-chevron-right"></i></span>
                        </a>
                    `;
                });
                html += `
                            </div>
                        </div>
                    </div>
                </div>`;
                mainArea.innerHTML = html;
                attachTermLinks();
            };

            // Function to render Result Table (matching the screenshot exactly)
            window.renderResultTable = function(resultObj) {
                let tableHTML = `
                    <h2>Result: ${resultObj.term}</h2>
                    <div class="table-responsive">
                        <table class="table table-hover" style="margin-top:20px;">
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th>Grade name</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                if (resultObj.grades && resultObj.grades.length > 0) {
                    resultObj.grades.forEach(g => {
                        tableHTML += `
                            <tr>
                                <td>${g.material}</td>
                                <td>${g.grade}</td>
                            </tr>
                        `;
                    });
                } else {
                    tableHTML += `<tr><td colspan="2" style="text-align:center;">No grades available.</td></tr>`;
                }
                
                tableHTML += `
                            </tbody>
                        </table>
                    </div>
                `;
                mainArea.innerHTML = tableHTML;
            };

            // Attach listeners to term links (both sidebar and main)
            function attachTermLinks() {
                document.querySelectorAll('.term-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const index = parseInt(link.getAttribute('data-index'));
                        renderResultTable(studentResults[index]);
                    });
                });
            }

            // Initial Render: show dashboard
            renderDashboard();
            attachTermLinks();

        } else {
            mainArea.innerHTML = `
                <div class="alert alert-warning" style="margin:20px;">
                    لا توجد نتائج مسجلة لهذا البريد الإلكتروني: ${loggedInEmail}
                </div>
            `;
        }
    }
    
    // Prevent MTI original links from navigating away (but ignore accordions with href starting with #)
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Ignore accordion links (starting with #)
        if (href && href.startsWith('#')) return;

        if (href && link.href.includes('mti.edu.eg/university/student')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (localStorage.getItem('loggedInEmail')) {
                    window.location.href = 'Result.html?ID=381';
                } else {
                    window.location.href = 'student.html';
                }
            });
        }
    });
});

// Fake the URL to look like ASPX for the illusion
if (window.location.pathname.endsWith('Result.html')) {
    const newUrl = window.location.href.replace('Result.html', 'Result.aspx');
    window.history.replaceState({}, '', newUrl);
}

// Better empty link reload prevention
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if(link) {
        const href = link.getAttribute('href');
        if (href === '#' || href === '') {
            if(!link.hasAttribute('data-toggle') && !link.classList.contains('dropdown-toggle')) {
                e.preventDefault();
            }
        }
    }
});
