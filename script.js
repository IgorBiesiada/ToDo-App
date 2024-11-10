const apikey = 'a8e2ca55-53b5-4e5a-99ee-0a74e939e419';
const apihost = 'https://todo-api.coderslab.pl';

function  apiListTasks(){
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey}
        }
        ).then(
            function(resp) {
                if(!resp.ok) {
                    alert("wystąpił błąd")
                }
                return resp.json();
            }
    )
}
function apiListOperationsForTask(taskId) {
    return fetch().then(function(resp) {

        if (!resp.ok) {
            alert('Wystąpił błąd');
        }
        return resp.json();
    });
}





function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.className = 'card mt-m5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div')
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if(status == 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);

    if(status == 'open') {
        const  addOperationDiv = document.createElement('div');
        addOperationDiv.className = 'card-body js-task-open-only';
        section.appendChild(addOperationDiv);

        const form = document.createElement('form')
        form.className = 'operation-form';
        addOperationDiv.appendChild(form);

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        form.appendChild(inputGroup)

        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'opis operacji');
        descriptionInput.className = 'form-control';
        inputGroup.appendChild(descriptionInput);
    }

}

function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');

    operationsList.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = timeSpent + 'm';
    descriptionDiv.appendChild(time);

    if (status == 'open') {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'js-task-open-only';
        li.appendChild(controlDiv);

        const add15minButton = document.createElement('button');
        add15minButton.className = 'btn btn-outline-success btn-sm mr-2';
        add15minButton.innerText = '+15 min';
        controlDiv.appendChild(add15minButton);

        add15minButton.addEventListener('click', function () {
            apiUpadteOperation(operationId, operationDescription, timeSpent + 15).then(function(response) {
                time.innerText = formatTime(response.data.timeSpent);
                timeSpent = response.data.timeSpent;
            });
        });

        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1 h';
        controlDiv.appendChild(add1hButton);

        add1hButton.addEventListener('click', function() {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then(function(response) {
                time.innerText = formatTime(response.data.timeSpent);
                timeSpent = response.data.timeSpent;

            });
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-success btn-sm mr-2';
        deleteButton.innerText = 'delete';
        controlDiv.appendChild(deleteButton);

        deleteButton.addEventListener('click', function () {
            apiDeleteOperation(operationId).then(function () {
                li.parentElement.removeChild(li);
                });
            });
    }
}

function formatTime(total) {
    const hour = Math.floor(total / 60);
    const minutes  = total / 60;
    if (hour > 0) {
        return hour + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    apiListTasks().then(
        function(response) {

        response.data.forEach(
            function(task) {renderTask(task.id, task.title, task.description, task.status); }
        );

        }
    );
});
