const createTaskModal = {
    template: 
    `
    <div class="modal-overlay">
        <div class="modal-body">
            <h1>Create Task</h1>
            <form action="">
                <input type="text" id="task-modal-todo" placeholder="Input your task">
                <h3>Choose your Task:</h3>
                <select>
                    <option value="">
                    </option>
                </select>
                <h3>Due Date:</h3>
                <input type="date">
                <button>Save Task</button>
            </form>
        </div>
    </div>
    `,
}

export {createTaskModal}