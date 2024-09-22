let table1=document.querySelector('#table1');
let table2=document.querySelector('#table2');
let table3=document.querySelector('#table3');
let table2div=document.querySelector('.table2-div');
let plusbutton=document.querySelector('.plus-button');
let previewbutton=document.querySelector('#previewbutton');
let viewtimesheetbutton=document.querySelector('#viewtimesheet');

let addactivity=document.querySelector('.add-activity');

let leave1=document.querySelector('#leaveDropdown');
let project1=document.querySelector('#projectDropdown');
let subproject1=document.querySelector('#subprojectDropdown');
let batch1=document.querySelector('#branchDropdown');
let time1=document.querySelector('.time');
let description1=document.querySelector('textarea');
let date1 = document.querySelector("#myDate");  

plusbutton.addEventListener("click", cloneTableRow);

function cloneTableRow() {  
    GetProject();
    GetSubProject();
    GetBatch();
    let html='';
    html+=`

        <tr>
        <td>
        </td>
        <td>
        </td>
            <td>
                <div class="activity-div">
                    <div class="dropdowns">
                        <label for="projectDropdown" class="dropdownlabel1">Project</label>
                        <label for="projectDropdown" class="dropdownlabel2">Sub-Project</label>
                        <label for="projectDropdown" class="dropdownlabel3">Batch</label>
                        <br>

                        <div class="dropdown">
                            <select name="dropdown" id="projectDropdown1"> 
                                <option value=" " selected>Select Project</option>
                                <option value="javascript">javascript</option>
                                <option value="Dotnet" >Dotnet</option> 
                            </select>
                        </div>

                        <div class="dropdown">
                            <select name="dropdown" id="subprojectDropdown1"> 
                                <option value=" " selected>Select Sub Project</option>
                                <option value="ToDoApp">ToDoApp</option>
                                <option value="StudentApp" >StudentApp</option>
                            </select>
                        </div>    
                       
                        <div class="dropdown">
                            <select name="dropdown" id="branchDropdown1"> 
                                <option value=" " selected>Select Batch</option>
                                <option value="Auropay">Auropay</option>
                                <option value="Payments" >Payments</option>
                            </select>
                        </div>

                        
                    </div>
                        
                    <div>
                        <label>Hours Needed : </label>
                        <br>
                        <input type="text" class="time1">
                    </div>

                    <div>
                        <label>Activity</label>
                        <br>
                        <textarea class="activity1"></textarea>
                    </div>

                    <button class="btn add-activity" onclick="addData()">Add Activity</button>
                    <button class="btn cancelbutton" onclick="clonedCancel(this)">Remove</button>
                <div>
            </td>
            <td width="10%" class="edit-icon">
                    <button class="plus-button" onclick="cloneTableRow()">
                        <i class="bi bi-plus"></i>
                    </button>
            </td>

        </tr>    
    `
  
   table1.innerHTML+=html;
  
}

function clonedCancel(button)
    {
        const row = button.closest('tr');
        row.remove();
    }  

let activitiess = [];

async function addActivity() {
    function extractActivity(projectId, subprojectId, batchId, timeClass, descClass) {
        let project = document.querySelector(projectId).value;
        let subproject = document.querySelector(subprojectId).value;
        let batch = document.querySelector(batchId).value;
        let time = document.querySelector(timeClass).value;
        let description = document.querySelector(descClass).value;

        if (project && subproject && batch && time && description) {
            return {
                project: project,
                subProject: subproject,
                batch: batch,
                time: time,
                activityDesc: description
            };
        }
        return null;
    }
  
    const activity1 = extractActivity('#projectDropdown', '#subprojectDropdown', '#branchDropdown', '.time', 'textarea');
   
    if (activity1) activitiess.push(activity1);
    
    if (document.querySelector('#projectDropdown1') !== null) {
        const activity2 = extractActivity('#projectDropdown1', '#subprojectDropdown1', '#branchDropdown1', '.time1', '.activity1');
        if (activity2) activitiess.push(activity2);
    }
    console.log("Activities array:", activitiess);

    document.querySelectorAll('#projectDropdown, #subprojectDropdown, #branchDropdown, .time, textarea').forEach(el => el.value = "");
    if (document.querySelector('#projectDropdown1') !== null) {
        document.querySelectorAll('#projectDropdown1, #subprojectDropdown1, #branchDropdown1, .time1, .activity1').forEach(el => el.value = "");
    }
}

async function addData() {
   
    let date = document.querySelector("#myDate").value; 
    let leave=document.querySelector('#leaveDropdown').value;
    addActivity();
    let activiti={
                activities:activitiess,
                dateTime:date,
                onLeave:leave             
            };
    console.log(activiti);
    previewData(activiti);

    try {
        if(date && leave && activitiess.length>0)
        {
            const response = await fetch('https://localhost:7120/api/Timesheet/Timesheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activiti)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseText = await response.text();
            console.log('Raw Response:', responseText);
            let data;
            if (responseText) {
                data = JSON.parse(responseText);
                console.log('Timesheet Added:', data);
            } else {
                console.log('No JSON data received');
            }
            
            alert('Timesheet and Activity added successfully!');  
            //activitiess=[]; 
            //console.log(activitiess);          
        }
        else
        {
            alert("Please fill all details");
        }
       
    } catch (error) {
        console.error('Error adding activity:', error);
        alert("Failed to add activity.");
    }
    date.value='';
    leave.value='';
    // document.querySelector('#leaveDropdown').value="";
    // document.querySelector("#myDate").value=""; 
}

async function previewData(data)
{  
    let html="";
    const header=`
            <tr>
                <th>Index</th>
                <th>Date</th>
                <th>On Leave</th>
                <th>Project</th>
                <th>Sub Project</th>
                <th>Branch</th>
                <th>Hours</th>
                <th>Description</th>
            </tr>
        `
    
    table2.innerHTML=header;

    data.activities.forEach((activity, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${data.dateTime}</td>
                <td>${data.onLeave ? 'Yes' : 'No'}</td>
                <td>${activity.project}</td>
                <td>${activity.subProject}</td>
                <td>${activity.batch}</td>
                <td>${activity.time}</td>
                <td>${activity.activityDesc}</td>
            </tr>
        `;
    });
    table2.innerHTML += html;

    let cancel = document.querySelector('.cancelbutton');
    if (!cancel) {
        let cancel=document.createElement('button');
        cancel.classList.add('cancelbutton');
        table2div.appendChild(cancel);
        cancel.textContent="Cancel";

        cancel.addEventListener('click',()=>{
            table2.style.display = "none";
            cancel.style.display="none";
        })
    }
    
    //table2.innerHTML+=html;

    

}

async function GetProject() {
    try {
        const response = await fetch('https://localhost:7120/api/Activity/Project');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const projects = await response.json();
        console.log('Fetched Projects:', projects);
        if (Array.isArray(projects)) {
            displayProjects(projects);
        } else {
            console.error('Expected an array but got:', projects);
        }

        return projects;
    } catch (error) {
        console.error('Error fetching Projects:', error);
    }
}
async function displayProjects(projects) {
   
    if (!project1) {
        console.error('Dropdown element not found');
        return;
    }
    project1.innerHTML = '<option value="">Select a Project</option>';
    projects.forEach(project => {
        let option = document.createElement('option');
        option.value = project.projetName;  
        option.textContent = project.projetName;  
        project1.appendChild(option);
    });
    
}

async function GetSubProject() {
    try {
        const response = await fetch('https://localhost:7120/api/Activity/SubProject');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const subprojects = await response.json();
        console.log('Fetched Sub Projects:', subprojects);
        if (Array.isArray(subprojects)) {
            displaySubProjects(subprojects);
        } else {
            console.error('Expected an array but got:', subprojects);
        }

        return subprojects;
    } catch (error) {
        console.error('Error fetching Projects:', error);
    }
}
async function displaySubProjects(subprojects) {
   
    if (!subproject1) {
        console.error('Dropdown element not found');
        return;
    }
    subproject1.innerHTML = '<option value="">Select a Sub Project</option>';
    subprojects.forEach(project => {
        let option = document.createElement('option');
        option.value = project.subProjetName;  
        option.textContent = project.subProjetName;  
        subproject1.appendChild(option);
    });
    
}

async function GetBatch() {
    try {
        const response = await fetch('https://localhost:7120/api/Activity/Batch');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const batches = await response.json();
        console.log('Fetched Batches:', batches);
        if (Array.isArray(batches)) {
            displayBatches(batches);
        } else {
            console.error('Expected an array but got:', batches);
        }

        return batches;
    } catch (error) {
        console.error('Error fetching Projects:', error);
    }
}
async function displayBatches(batches) {
   
    if (!batch1) {
        console.error('Dropdown element not found');
        return;
    }
    batch1.innerHTML = '<option value="">Select Batch</option>';
    batches.forEach(project => {
        let option = document.createElement('option');
        option.value = project.batchName;  
        option.textContent = project.batchName;  
        batch1.appendChild(option);
    });
    
}

viewtimesheetbutton.addEventListener('click',()=>{
    window.location.href='index2.html';
});

document.addEventListener('DOMContentLoaded', () => {
    GetProject();
    GetSubProject();
    GetBatch();
});

