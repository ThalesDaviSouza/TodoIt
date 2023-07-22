class Task {
    constructor(id, title = '', categoryId = -1, isFinished = false, dueDate, description = ''){
        this.id = id
        this.title = title
        this. categoryId = categoryId
        this.finished = isFinished
        this.dueDate = dueDate
        this.description = description
    }
}

class Category {
    constructor(id, name = '', description = '', isSelected = false, openToEdit = false){
        this.id = id
        this.name = name
        this.description = description
        this.isSelected = isSelected
        this.openToEdit = openToEdit
    }
}

export {Category, Task}