// --- Custom Login and Dashboard Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Login Page Logic (student.html) ---
    const loginEmailBtn = document.getElementById('ctl00_Main_btnLoginEmail');
    const emailInput = document.getElementById('ctl00_Main_txtEmail');

    if (loginEmailBtn && emailInput) {
        loginEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
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
    const contentDiv = document.querySelector('.content');
    
    if (contentDiv && !document.getElementById('ctl00_Main_btnLoginEmail')) {
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        if (!loggedInEmail) {
            window.location.href = 'student.html';
            return;
        }

        const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
        const studentResults = studentsData.filter(s => s.email === loggedInEmail);

        const nameSidebar = document.getElementById('student-name-sidebar');
        const idSidebar = document.getElementById('student-id-sidebar');
        const catName = document.querySelector('.cat-name');

        if (studentResults.length > 0) {
            const studentInfo = studentResults[0];
            if (nameSidebar) nameSidebar.textContent = studentInfo.name;
            if (idSidebar) idSidebar.textContent = studentInfo.id;
            
            // Function to render Task List (Dashboard)
            window.renderDashboard = function() {
                if (catName) {
                    catName.style.display = 'block';
                    catName.textContent = 'Student Dashboard';
                }
                
                let html = `
                    <div style="padding:15px; border-bottom: 1px solid #ddd; margin-bottom: 15px;">
                        <strong>Welcome <br> ${studentInfo.name}</strong><br><br>
                        <strong>Please select a feature from Task List</strong>
                    </div>
                    <div class="list-group" id="task-list-container">
                `;
                
                studentResults.forEach((res, idx) => {
                    html += `
                        <a href="#" class="list-group-item term-link" data-index="${idx}">
                            ${res.term} <span class="badge label-primary pull-right" style="background-color: #ffb600;"> <i class="fa-solid fa-chevron-right"></i></span>
                        </a>
                    `;
                });
                html += `</div>`;
                contentDiv.innerHTML = html;

                // Add click listeners to terms
                document.querySelectorAll('.term-link').forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const index = parseInt(link.getAttribute('data-index'));
                        renderResultTable(studentResults[index]);
                    });
                });
            };

            // Function to render Result Table
            window.renderResultTable = function(resultObj) {
                if(catName) catName.style.display = 'none';

                let tableHTML = `
                    <div style="padding:10px;">
                        <h3 style="margin-top:0; color:#333; font-family: sans-serif;">${resultObj.term}</h3>
                        <hr>
                        <table class="table table-striped table-bordered" style="width:100%; margin-top:20px; border-bottom:1px solid #ddd;">
                            <thead>
                                <tr style="border-bottom: 2px solid #ddd;">
                                    <th style="padding:10px; text-align:left;">Material</th>
                                    <th style="padding:10px; text-align:left;">Grade name</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                if (resultObj.grades && resultObj.grades.length > 0) {
                    resultObj.grades.forEach(g => {
                        tableHTML += `
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding:15px 10px;">${g.material}</td>
                                <td style="padding:15px 10px;">${g.grade}</td>
                            </tr>
                        `;
                    });
                } else {
                    tableHTML += `<tr><td colspan="2" style="padding:15px 10px; text-align:center;">No grades available.</td></tr>`;
                }
                
                tableHTML += `
                            </tbody>
                        </table>
                    </div>
                `;
                contentDiv.innerHTML = tableHTML;
            };

            // Initial Render: show dashboard
            renderDashboard();

        } else {
            contentDiv.innerHTML = `
                <div class="alert alert-warning" style="margin:20px;">
                    لا توجد نتائج مسجلة لهذا البريد الإلكتروني: ${loggedInEmail}
                </div>
            `;
        }
    }
    
    // Prevent MTI original links from navigating away
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        if (link.href && link.href.includes('mti.edu.eg/university/student')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Handle specific sidebar links locally
                const text = link.textContent.trim();
                
                if (text === 'Account' || text.includes('Logout')) {
                    localStorage.removeItem('loggedInEmail');
                    window.location.href = 'student.html';
                    return;
                }
                
                if (text === 'Results' && window.renderDashboard) {
                    window.renderDashboard();
                    return;
                }

                // Default behavior for other intercepted links
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
