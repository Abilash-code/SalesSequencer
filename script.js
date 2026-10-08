document.getElementById("ingestion-form").addEventListener("submit",async (e) => {
    e.preventDefault()
    const formdata = new FormData(e.target)
    const response = await fetch("http://localhost:5050/",{
        method : "POST",
        body : new URLSearchParams(formdata) // new URLSearchParams because our middle wear is set up for urlencoded forms , so we convert our current multipart/form-data into url data
    });
})

async function fetchLeads(){
    const response = await fetch('http://localhost:5050/leads')
}