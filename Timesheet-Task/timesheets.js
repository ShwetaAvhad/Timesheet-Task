let table2=document.querySelector('#table2');
let table2div=document.querySelector('.table2-div');
let backButoon=document.querySelector('#backButton');

async function GetData() {
    try {
        const response = await fetch('https://localhost:7120/api/Timesheet/Timesheet');
        const data=await response.json();

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Fetched Data :', data);
        
        if (Array.isArray(data)) {
            displayTimesheets(data);
        } else {
            console.error('Expected an array but got:', data);
        }

        return data;
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

async function displayTimesheets(data) {
    let html = "";
    const header = `
        <tr>
            <th>Index</th>
            <th>Date</th>
            <th>On Leave</th>
            <th>Project</th>
            <th>Sub Project</th>
            <th>Branch</th>
            <th>Hours</th>
            <th>Description</th>
            <th></th>
            <th></th>
        </tr>
    `;
    
    table2.innerHTML = header;
    data.forEach((item, index) => {
        if (item.activities && item.activities.length > 0) {
            html += `
                <tr id="row">
                    <td rowspan="${item.activities.length}">${index + 1}</td>
                    <td rowspan="${item.activities.length}">${item.dateTime}</td>
                    <td rowspan="${item.activities.length}">${item.onLeave}</td>
            `;
           
            item.activities.forEach((activity)=> {
                html += `     
                        <td>${activity.project}</td>
                        <td>${activity.subProject}</td>
                        <td>${activity.batch}</td>
                        <td>${activity.time}</td>
                        <td>${activity.activityDesc}</td>
                        <td>
                            <button class="btn btn-success editbutton" onclick="showEditForm(${activity.activityId}, '${activity.project}', '${activity.subProject}', '${activity.batch}', '${activity.time}', '${activity.activityDesc}')">Edit</button>
                        </td>
                        <td><button class="btn btn-danger deletebutton" onclick="DeleteData(${activity.activityId})">Delete</button></td>

                    </tr>                   
                `;
            });
        } else {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.dateTime}</td>
                    <td>${item.onLeave}</td>
                    <td colspan="5">No activities available</td>
                    <td><button class="btn btn-success editbutton">Edit</button></td>
                    <td><button class="btn btn-danger deletebutton" onclick="DeleteData(${item.timesheetId})">Delete</button></td>
                </tr>
            `;
        }
    });
   
    table2.innerHTML += html;
}

function showEditForm(activityId, project, subProject, batch, time, activityDesc) {
    const row = document.getElementById(`row`);
    row.innerHTML = `
        <td colspan="10">
            <form id="edit-form" onsubmit="submitEditForm(event, ${activityId})">
                <input type="text" id="editproject" value="${project}" placeholder="Project" />
                <br>
                <input type="text" id="editsubProject" value="${subProject}" placeholder="Sub Project" />
                <br>
                <input type="text" id="editbatch" value="${batch}" placeholder="Batch" />
                <br>
                <input type="text" id="edittime" value="${time}" placeholder="Hours" />
                <br>
                <input type="text" id="editdesc" value="${activityDesc}" placeholder="Description" />
                <br>
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEdit(${activityId})">Cancel</button>
            </form>
        </td>
    `;
}

function cancelEdit(activityId)
{
    GetData(); 
}

async function submitEditForm(event, activityId) 
{
    event.preventDefault(); 

    const updatedActivity = {
        activityId: activityId,
        project: document.getElementById(`editproject`).value,
        subProject: document.getElementById(`editsubProject`).value,
        batch: document.getElementById(`editbatch`).value,
        time: document.getElementById(`edittime`).value,
        activityDesc: document.getElementById(`editdesc`).value
    };

    try 
    {
        const response = await fetch(`https://localhost:7120/api/Activity/Activity`, 
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedActivity)
        });
        console.log(response);
        
        if (!response.ok) {
            throw new Error(`Failed to update activity: ${response.status}`);
        }

        let responseData;
        const responseText = await response.text(); 
        if (responseText) {
            responseData = JSON.parse(responseText); 
            console.log('Activity updated successfully:', responseData);
        }
        alert('Activity updated successfully!');
        GetData(); 
    } catch (error) {
        console.error('Error updating activity:', error);
        alert('Failed to update activity.');
    }
}

async function DeleteData(activityId)
{
    try 
    {
        const response = await fetch(`https://localhost:7120/api/Activity/Activity${activityId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.status}`);
        }
        
        alert("Data Deleted Successfully!");
        GetData();
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
}

backButoon.addEventListener('click', () => {
    window.history.back(); 
});

window.onload = () => {
    GetData();
};
