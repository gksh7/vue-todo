Vue.createApp({
  data: function () {
    return {
      todoTitle: '',
      todoDescription: '',

      todoCategories: [],
      selectedCategory: '',

      todos: [],
      categories: [],

      hideDoneTodo: false,
      searchWord: '',
      order: 'desc',
      categoryName: '',
    }
  },
  computed: {
    canCreateTodo: function () {
      return this.todoTitle !== ''
    },
    canCreateCategory: function () {
      //空であり、かつ すでに存在する場合はfalse
      //空でない、かつ すでに存在しない場合はtrue(=can)
      return this.categoryName !== '' && !this.existsCategory
    },

    existsCategory: function () {
      const categoryName = this.categoryName
      //すでにcategoriesに存在する場合はtrueが返る。存在しない場合はfalseが返る。
      return this.categories.indexOf(categoryName) !== -1
    },

    hasTodos: function () {
      return this.todos.length > 0
    },
    resultTodos: function () {
      const selectedCategory = this.selectedCategory
      const hideDoneTodo = this.hideDoneTodo
      const order = this.order
      const searchWord = this.searchWord

      return this.todos
        .filter(function (todo) {
          return (
            selectedCategory === '' ||
            todo.categories.indexOf(selectedCategory) !== -1
          )
        })
        .filter(function (todo) {
          if (hideDoneTodo) {
            return !todo.done
          }
          return true
        })
        .filter(function (todo) {
          return (
            todo.title.indexOf(searchWord) !== -1 ||
            todo.description.indexOf(searchWord) !== -1
          )
        })
        .sort(function (a, b) {
          if (order === 'asc') {
            return a.dateTime - b.dateTime
          }
          return b.dateTime - a.dateTime
        })
    },
  },

  watch: {
    todos: {
      handler: function (next) {
        window.localStorage.setItem('todos', JSON.stringify(next))
      },
      deep: true,
    },
    categories: {
      handler: function (next) {
        window.localStorage.setItem('categories', JSON.stringify(next))
      },
      deep: true,
    },
  },

  methods: {
    createTodo: function () {
      if (!this.canCreateTodo) {
        return
      }

      this.todos.push({
        id: 'todo-' + Date.now(),
        title: this.todoTitle,
        description: this.todoDescription,
        categories: this.todoCategories,
        dateTime: Date.now(),
        done: false,
      })

      this.todoTitle = ''
      this.todoDescription = ''
      this.todoCategories = []
    },

    createCategory: function () {
      if (!this.canCreateCategory) {
        return
      }

      this.categories.push(this.categoryName)
      this.categoryName = ''
    },
  },

  created: function () {
    const todos = window.localStorage.getItem('todos')
    const categories = window.localStorage.getItem('categories')

    if (todos) {
      this.todos = JSON.parse(todos)
    }

    if (categories) {
      this.categories = JSON.parse(categories)
    }
  },
}).mount('#app')
