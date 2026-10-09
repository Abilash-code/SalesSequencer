document.getElementById("ingestion-form").addEventListener("submit",async (e) => {
    e.preventDefault()
    const formdata = new FormData(e.target)
    const response = await fetch("http://localhost:5050/",{
        method : "POST",
        body : new URLSearchParams(formdata) // new URLSearchParams because our middle wear is set up for urlencoded forms , so we convert our current multipart/form-data into url data
    });
    fetchLeads();
})

async function fetchLeads(){
    const response = await fetch('http://localhost:5050/leads')
    const leads = await response.json()
    rendertable(leads)
    console.log("hello")
}

function rendertable(leads){
    const noleads = document.getElementById("no-leads");
    const leadstable = document.getElementById("leads-table");
    const tableBody = document.getElementById("leads-table-body");

    tableBody.innerHTML = "";

    if(leads.length === 0){
        noleads.style.display = "block";
        leadstable.style.display = "none";
        return;
    }

    noleads.style.display = "none";
    leadstable.style.display = "block";

    leads.forEach((lead) => {
        const row = `<tr>
            <td>${lead.id}</td>
            <td>${lead.Full_Name}</td>
            <td>${lead.Company_Name}</td>
            <td>${lead.Email_Address}</td>
            <td>${lead.Phone}</td>
            <td>${lead.Source_Channel}</td>
            <td>${lead.Region}</td>
            <td>${lead.Interest}</td>
            <td>${lead.Intent_Score}</td>
            <td>${lead.Pipeline_Stage}</td>
            <td>${lead.Assigned_Rep}</td>
            <td>${lead.Ingestion_Timestamp}</td>
            <td><button onclick="changePipelineStage(${lead.id})">Update Pipeline</button></td>
        </tr>`;

        tableBody.insertAdjacentHTML('beforeend',row);
    });
}

window.onload = fetchLeads;

async function changePipelineStage(id){
    const response = await fetch(`http://localhost:5050/change/${id}`,{
        method : 'PATCH'
    })
    fetchLeads();
}