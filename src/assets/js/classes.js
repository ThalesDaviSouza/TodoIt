class Task {
    title = ''
    description = ''
    constructor(id, title, categoryId, isFinished = false, dueDate, description){
        this.id = id
        this.title = title
        this. categoryId = categoryId
        this.finished = isFinished
        this.dueDate = dueDate
        this.description = description
    }
}

class Category {
    name = ''
    constructor(id, name, isSelected = false, openToEdit = false){
        this.id = id
        this.name = name
        this.isSelected = isSelected
        this.openToEdit = openToEdit
    }
}

export {Category, Task}