// --- Custom Login and Dashboard Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Login Page Logic (student.html) ---
    const loginEmailBtn = document.getElementById('ctl00_Main_btnLoginEmail');
    const emailInput = document.getElementById('ctl00_Main_txtEmail');

    if (loginEmailBtn && emailInput) {
        // Prevent default postback and handle custom login
        loginEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (email) {
                localStorage.setItem('loggedInEmail', email);
                window.location.href = 'Result.html?ID=381';
            } else {
                alert('?????? ????? ?????? ??????????');
            }
        });
        
        loginEmailBtn.href = '#';
    }

    // --- 2. Dashboard / Result Page Logic (Result.html) ---
    // Make sure we only execute this if we are on the Result page
    const contentDiv = document.querySelector('.content');
    
    if (contentDiv && !document.getElementById('ctl00_Main_btnLoginEmail')) {
        const loggedInEmail = localStorage.getItem('loggedInEmail');
        if (!loggedInEmail) {
            // Redirect back to login if no email found
            window.location.href = 'student.html';
            return;
        }

        const studentsData = JSON.parse(localStorage.getItem('studentsData')) || [];
        const student = studentsData.find(s => s.email === loggedInEmail);

        // Sidebar Elements
        const nameSidebar = document.getElementById('student-name-sidebar');
        const idSidebar = document.getElementById('student-id-sidebar');

        if (student) {
            if (nameSidebar) nameSidebar.textContent = student.name;
            if (idSidebar) idSidebar.textContent = student.id;
            
            // Replace the entire .content div HTML with the detailed result table
            
            let tableHTML = 
                <div style="padding:10px;">
                    <h3 style="margin-top:0; color:#333; font-family: sans-serif;">\</h3>
                    <hr>
                    <table class="table table-striped table-bordered" style="width:100%; margin-top:20px; border-bottom:1px solid #ddd;">
                        <thead>
                            <tr style="border-bottom: 2px solid #ddd;">
                                <th style="padding:10px; text-align:left;">Material</th>
                                <th style="padding:10px; text-align:left;">Grade name</th>
                            </tr>
                        </thead>
                        <tbody>
            ;
            
            if (student.grades && student.grades.length > 0) {
                student.grades.forEach(g => {
                    tableHTML += 
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding:15px 10px;">\</td>
                            <td style="padding:15px 10px;">\</td>
                        </tr>
                    ;
                });
            } else {
                tableHTML += <tr><td colspan="2" style="padding:15px 10px; text-align:center;">No grades available.</td></tr>;
            }
            
            tableHTML += 
                        </tbody>
                    </table>
                </div>
            ;
            
            // Overwrite the content div completely to look exactly like the screenshot
            contentDiv.innerHTML = tableHTML;
            
            // Hide the cat-name if it says 'Student Dashboard'
            const catName = document.querySelector('.cat-name');
            if(catName && catName.textContent.includes('Student Dashboard')) {
                catName.style.display = 'none';
            }
            
        } else {
            // Student not found
            contentDiv.innerHTML = 
                <div class="alert alert-warning" style="margin:20px;">
                    ?? ???? ????? ????? ???? ?????? ??????????: \
                </div>
            ;
        }
    }
    
    // Prevent accidental clicking of main site link for Dashboard (which would break the illusion)
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        if (link.href && link.href.includes('mti.edu.eg/university/student')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // If it's a student portal link, just stay on the local dashboard
                if (localStorage.getItem('loggedInEmail')) {
                    window.location.href = 'Result.html?ID=381';
                } else {
                    window.location.href = 'student.html';
                }
            });
        }
    });
});
